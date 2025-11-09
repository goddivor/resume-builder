import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, FileTextIcon, FolderOpenIcon, PaperclipIcon, EyeIcon, CopyIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
import AnnexeManager from '../components/AnnexeManager'
import AnnexeAssigner from '../components/AnnexeAssigner'

const Dashboard = () => {

  const navigate = useNavigate()
  const {token} = useSelector(state => state.auth)

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [showUploadAnnexe, setShowUploadAnnexe] = useState(false)
  const [showManageAnnexes, setShowManageAnnexes] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [annexeFile, setAnnexeFile] = useState(null)
  const [annexeTitle, setAnnexeTitle] = useState('')
  const [editResumeId, setEditResumeId] = useState('')
  const [showAssignAnnexes, setShowAssignAnnexes] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const loadAllResumes = async () =>{
    try {
      const { data } = await api.get('/api/users/resumes', {headers: { Authorization: token }})
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
   try {
    event.preventDefault()
    const { data } = await api.post('/api/resumes/create', {title}, {headers: { Authorization: token }})
    setAllResumes([...allResumes, data.resume])
    setTitle('')
    setShowCreateResume(false)
    navigate(`/app/builder/${data.resume._id}`)
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
   }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: { Authorization: token }})
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: { title }}, {headers: { Authorization: token }})
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
     
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
     if(confirm){
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: { Authorization: token }})
      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
     }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }

  }

  const cloneResume = async (resumeId) => {
    try {
      const {data} = await api.post(`/api/resumes/${resumeId}/clone`, {}, {headers: { Authorization: token }})
      setAllResumes([...allResumes, data.resume])
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadAnnexe = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', annexeTitle)
      formData.append('annexe', annexeFile)

      const { data } = await api.post('/api/annexes/upload', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      })

      setAnnexeTitle('')
      setAnnexeFile(null)
      setShowUploadAnnexe(false)
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    loadAllResumes()
  },[])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, Joe Doe</p>

        <div className='flex gap-4 flex-wrap'>
            <button onClick={()=> setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
            </button>
            <button onClick={()=> setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
            </button>
            <button onClick={()=> setShowUploadAnnexe(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <FileTextIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-amber-300 to-amber-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-amber-600 transition-all duration-300'>Upload Annexes</p>
            </button>
            <button onClick={()=> setShowManageAnnexes(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-teal-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <FolderOpenIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-teal-300 to-teal-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-teal-600 transition-all duration-300'>Manage Annexes</p>
            </button>
        </div>

      <hr className='border-slate-300 my-6' />

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 ">
        {allResumes.map((resume, index)=>{
          const baseColor = colors[index % colors.length];
          return (
            <div key={index} className='relative w-full sm:max-w-36 h-48 rounded-lg border group hover:shadow-lg transition-all duration-300' style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>

              {/* Main clickable area */}
              <button onClick={()=> navigate(`/app/builder/${resume._id}`)} className='absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer'>
                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all " style={{ color: baseColor }}/>
                <p className='text-sm group-hover:scale-105 transition-all px-2 text-center' style={{ color: baseColor }}>{resume.title}</p>
              </button>

              {/* Date at bottom */}
              <p className='absolute bottom-1 left-0 right-0 text-[11px] text-center px-2' style={{ color: baseColor + '90' }}>
                 Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Top right buttons - View, Annexes, Clone, Delete, Rename */}
              <div onClick={e=> e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                <EyeIcon onClick={()=> navigate(`/app/preview-final/${resume._id}`)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" title="View Final"/>
                <PaperclipIcon onClick={()=> {setSelectedResumeId(resume._id); setShowAssignAnnexes(true)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" title="Assign Annexes"/>
                <CopyIcon onClick={()=>cloneResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" title="Clone"/>
                <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" title="Delete"/>
                <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" title="Rename"/>
              </div>
            </div>
          )
        })}
      </div>

        {showCreateResume && (
          <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowCreateResume(false); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
                <div>
                  <label htmlFor="resume-input" className="block text-sm text-slate-700">
                    Select resume file
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                      {resume ? (
                        <p className='text-green-700'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-14 stroke-1'/>
                          <p>Upload resume</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
                </div>
              <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
                
                </button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowUploadResume(false); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {editResumeId && (
          <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setEditResumeId(''); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {showUploadAnnexe && (
          <form onSubmit={uploadAnnexe} onClick={()=> setShowUploadAnnexe(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Upload Annexe</h2>
              <input onChange={(e)=>setAnnexeTitle(e.target.value)} value={annexeTitle} type="text" placeholder='Enter annexe title' className='w-full px-4 py-2 mb-4 focus:border-amber-600 ring-amber-600' required/>
                <div>
                  <label htmlFor="annexe-input" className="block text-sm text-slate-700">
                    Select PDF file
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-amber-500 hover:text-amber-700 cursor-pointer transition-colors'>
                      {annexeFile ? (
                        <p className='text-amber-700'>{annexeFile.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-14 stroke-1'/>
                          <p>Upload PDF annexe</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='annexe-input' accept='.pdf' hidden onChange={(e)=> setAnnexeFile(e.target.files[0])}/>
                </div>
              <button disabled={isLoading} className='w-full py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors flex items-center justify-center gap-2'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
                {isLoading ? 'Uploading...' : 'Upload Annexe'}
              </button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowUploadAnnexe(false); setAnnexeTitle(''); setAnnexeFile(null)}}/>
            </div>
          </form>
        )
        }

        <AnnexeManager isOpen={showManageAnnexes} onClose={() => setShowManageAnnexes(false)} />
        <AnnexeAssigner
          isOpen={showAssignAnnexes}
          onClose={() => {setShowAssignAnnexes(false); setSelectedResumeId('')}}
          resumeId={selectedResumeId}
        />

      </div>
    </div>
  )
}

export default Dashboard
