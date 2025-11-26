import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, BookOpen, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, Globe2, GraduationCap, Heart, ImageIcon, Languages, Link2, PenTool, Share2Icon, Sparkles, User, X } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import InterestsForm from '../components/InterestsForm'
import PublicationForm from '../components/PublicationForm'
import LanguagesForm from '../components/LanguagesForm'
import SignatureForm from '../components/SignatureForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const ResumeBuilder = () => {
  const { t, i18n } = useTranslation();
  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    publication: [],
    skills: [],
    interests: [],
    languages: [],
    signature: {},
    template: "classic",
    accent_color: "#3B82F6",
    template_settings: {},
    public: false,
  })

  const loadExistingResume = async () => {
   try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: { Authorization: token }})
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title;
    }
   } catch (error) {
    console.log(error.message)
   }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);
  const [removeSignatureBackground, setRemoveSignatureBackground] = useState(false);
  const [language, setLanguage] = useState('en');
  const [originalData, setOriginalData] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSlugModal, setShowSlugModal] = useState(false);
  const [customSlug, setCustomSlug] = useState('');

  const sections = [
    { id: "personal", name: t('resumeBuilder.sections.personal'), icon: User },
    { id: "summary", name: t('resumeBuilder.sections.summary'), icon: FileText },
    { id: "experience", name: t('resumeBuilder.sections.experience'), icon: Briefcase },
    { id: "education", name: t('resumeBuilder.sections.education'), icon: GraduationCap },
    { id: "projects", name: t('resumeBuilder.sections.projects'), icon: FolderIcon },
    { id: "publications", name: t('resumeBuilder.sections.publications'), icon: BookOpen },
    { id: "skills", name: t('resumeBuilder.sections.skills'), icon: Sparkles },
    { id: "interests", name: t('resumeBuilder.sections.interests'), icon: Heart },
    { id: "languages", name: t('resumeBuilder.sections.languages'), icon: Globe2 },
    { id: "signature", name: t('resumeBuilder.sections.signature'), icon: PenTool },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(()=>{
    loadExistingResume()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const changeResumeVisibility = async () => {
    try {
       const formData = new FormData()
       formData.append("resumeId", resumeId)
       formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

       const {data} = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

       setResumeData({...resumeData, public: !resumeData.public})
       toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const handleShare = async () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    // Use slug if available, otherwise use resumeId
    const identifier = resumeData.slug || resumeId;
    const resumeUrl = frontendUrl + '/view/' + identifier;

    try {
      // Try Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare({ url: resumeUrl })) {
        await navigator.share({
          title: resumeData.title || 'My Resume',
          text: 'Check out my resume',
          url: resumeUrl
        });
        toast.success(t('resumeBuilder.sharedSuccess'));
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(resumeUrl);
        toast.success(t('resumeBuilder.linkCopied'));
      }
    } catch (error) {
      // If both fail, use clipboard as final fallback
      if (error.name === 'AbortError') {
        // User cancelled the share
        return;
      }

      try {
        await navigator.clipboard.writeText(resumeUrl);
        toast.success(t('resumeBuilder.linkCopied'));
      // eslint-disable-next-line no-unused-vars
      } catch (clipboardError) {
        // Last resort: show URL in prompt
        prompt(t('resumeBuilder.copyLinkPrompt'), resumeUrl);
      }
    }
  }

  const handleCustomizeSlug = () => {
    setCustomSlug(resumeData.slug || '');
    setShowSlugModal(true);
  }

  const saveCustomSlug = async () => {
    try {
      const slugValue = customSlug.trim().toLowerCase();

      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (slugValue && !slugRegex.test(slugValue)) {
        toast.error(t('resumeBuilder.invalidSlugFormat'));
        return;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append('resumeData', JSON.stringify({ slug: slugValue || null }));

      const { data } = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }});

      setResumeData(prev => ({ ...prev, slug: data.resume.slug }));
      setShowSlugModal(false);
      toast.success(t('resumeBuilder.slugSaved'));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const downloadResume = ()=>{
    window.print();
  }

  const switchToEnglish = () => {
    if (originalData) {
      setResumeData(originalData);
      setOriginalData(null);
    }
    setLanguage('en');
  };

  const switchToFrench = async () => {
    if (language === 'fr') return;

    setIsTranslating(true);
    try {
      const dataToTranslate = {
        personal_info: resumeData.personal_info,
        professional_summary: resumeData.professional_summary,
        experience: resumeData.experience,
        education: resumeData.education,
        project: resumeData.project,
        publication: resumeData.publication,
        skills: resumeData.skills,
        interests: resumeData.interests
      };

      const { data } = await api.post('/api/ai/translate', {
        resumeData: dataToTranslate,
        targetLanguage: 'fr'
      }, { headers: { Authorization: token } });

      setOriginalData(resumeData);
      setResumeData({
        ...resumeData,
        ...data.translatedData
      });
      setLanguage('fr');
      toast.success(t('resumeBuilder.translatedSuccess'));
    } catch (error) {
      toast.error(t('resumeBuilder.translationFailed'));
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  }


const saveResume = async () => {
  try {
    let updatedResumeData = structuredClone(resumeData)

    // remove image from updatedResumeData
    if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }

    // remove signature image from updatedResumeData
    if(typeof resumeData.signature?.image === 'object'){
      delete updatedResumeData.signature.image
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    removeBackground && formData.append("removeBackground", "yes");
    removeSignatureBackground && formData.append("removeSignatureBackground", "yes");
    typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)
    typeof resumeData.signature?.image === 'object' && formData.append("signature", resumeData.signature.image)

    const { data } = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

    setResumeData(data.resume)
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:", error)
  }
}

  return (
    <div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4"/> {t('resumeBuilder.backToDashboard')}
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0  h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev => ({...prev, accent_color: color}))}/>
                  <label className='flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-xs text-gray-700' title={t('resumeBuilder.showImage')}>
                    <input
                      type="checkbox"
                      checked={resumeData.template_settings?.[resumeData.template]?.show_image !== false}
                      onChange={(e)=>{
                        setResumeData(prev => ({
                          ...prev,
                          template_settings: {
                            ...prev.template_settings,
                            [prev.template]: {
                              ...prev.template_settings?.[prev.template],
                              show_image: e.target.checked
                            }
                          }
                        }))
                      }}
                      className='w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                    <ImageIcon className='size-3.5'/>
                  </label>
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className="size-4"/> {t('resumeBuilder.previous')}
                    </button>
                  )}
                  <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                      {t('resumeBuilder.next')} <ChevronRight className="size-4"/>
                    </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                  )}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))}/>
                  )}
                  {activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))}/>
                  )}
                  {activeSection.id === 'projects' && (
                    <ProjectForm data={resumeData.project} onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))}/>
                  )}
                  {activeSection.id === 'publications' && (
                    <PublicationForm data={resumeData.publication} onChange={(data)=> setResumeData(prev=> ({...prev, publication: data}))}/>
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))}/>
                  )}
                  {activeSection.id === 'interests' && (
                    <InterestsForm data={resumeData.interests} onChange={(data)=> setResumeData(prev=> ({...prev, interests: data}))}/>
                  )}
                  {activeSection.id === 'languages' && (
                    <LanguagesForm data={resumeData.languages} onChange={(data)=> setResumeData(prev=> ({...prev, languages: data}))}/>
                  )}
                  {activeSection.id === 'signature' && (
                    <SignatureForm data={resumeData.signature} onChange={(data)=> setResumeData(prev=> ({...prev, signature: data}))} removeSignatureBackground={removeSignatureBackground} setRemoveSignatureBackground={setRemoveSignatureBackground}/>
                  )}

              </div>
              <button onClick={()=> {toast.promise(saveResume, {loading: t('resumeBuilder.saving')})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                {t('resumeBuilder.saveChanges')}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                    <div className='flex items-center gap-1'>
                      <button
                        onClick={switchToEnglish}
                        disabled={isTranslating}
                        className='flex items-center p-2 px-3 gap-1 text-xs bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 rounded-lg ring-orange-300 hover:ring transition-colors disabled:opacity-50'
                      >
                        EN
                      </button>
                      <button
                        onClick={switchToFrench}
                        disabled={isTranslating}
                        className='flex items-center p-2 px-3 gap-1 text-xs bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 rounded-lg ring-orange-300 hover:ring transition-colors disabled:opacity-50'
                      >
                        {isTranslating ? <Languages className='size-3 animate-spin'/> : null}
                        FR
                      </button>
                    </div>
                    {resumeData.public && (
                      <>
                        <button onClick={handleCustomizeSlug} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600 rounded-lg ring-cyan-300 hover:ring transition-colors'>
                          <Link2 className='size-4'/> {t('resumeBuilder.customizeUrl')}
                        </button>
                        <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                          <Share2Icon className='size-4'/> {t('resumeBuilder.share')}
                        </button>
                      </>
                    )}
                    <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                      {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                      {resumeData.public ? t('resumeBuilder.public') : t('resumeBuilder.private')}
                    </button>
                    <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                      <DownloadIcon className='size-4'/> {t('resumeBuilder.download')}
                    </button>
                </div>
              </div>

              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} language={i18n.language}/>
          </div>
        </div>
      </div>

      {/* Custom Slug Modal */}
      {showSlugModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowSlugModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t('resumeBuilder.customizeUrlTitle')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('resumeBuilder.customizeUrlDescription')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resumeBuilder.customSlugLabel')}
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-500 flex-shrink-0">
                    {window.location.origin}/view/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="john-doe-resume"
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t('resumeBuilder.slugFormatHint')}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSlugModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('resumeBuilder.cancel')}
                </button>
                <button
                  onClick={saveCustomSlug}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-colors"
                >
                  {t('resumeBuilder.saveSlug')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ResumeBuilder
