import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FinalResumePreview from '../components/FinalResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)
  const [annexes, setAnnexes] = useState([])

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId + '/with-annexes')
      setResumeData(data.resume)

      // Extract annexes data
      if (data.resume.annexes && data.resume.annexes.length > 0) {
        const sortedAnnexes = data.resume.annexes
          .filter(a => a.annexeId)
          .sort((a, b) => a.order - b.order)
          .map(a => a.annexeId);
        setAnnexes(sortedAnnexes);
      }
    } catch (error) {
      console.log(error.message);
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadResume()
  },[])
  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-4xl mx-auto py-10 px-4'>
        <FinalResumePreview
          resumeData={resumeData}
          annexes={annexes}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
          <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
            <ArrowLeftIcon className='mr-2 size-4'/>
            go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview
