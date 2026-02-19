import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, X, Crop } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageRepositioner from './ImageRepositioner'

const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground}) => {
    const { t } = useTranslation();
    const [showRepositioner, setShowRepositioner] = useState(false)

    const handleChange = (field, value)=>{
        onChange({...data, [field]: value})
    }

    const removeImage = () => {
        onChange({...data, image: '', image_position: { x: 50, y: 50 }, image_scale: 1})
        setRemoveBackground(false)
    }

    const fields = [
        {key: "full_name", label: t('forms.personalInfo.fullName'), icon: User, type: "text", required: true},
        {key: "email", label: t('forms.personalInfo.email'), icon: Mail, type: "email", required: true},
        { key: "phone", label: t('forms.personalInfo.phone'), icon: Phone, type: "tel" },
        { key: "location", label: t('forms.personalInfo.location'), icon: MapPin, type: "text" },
        { key: "profession", label: t('forms.personalInfo.profession'), icon: BriefcaseBusiness, type: "text" },
        { key: "linkedin", label: t('forms.personalInfo.linkedin'), icon: Linkedin, type: "url" },
        { key: "website", label: t('forms.personalInfo.website'), icon: Globe, type: "url" }
    ]

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>{t('forms.personalInfo.title')}</h3>
      <p className='text-sm text-gray-600'>{t('forms.personalInfo.subtitle')}</p>
      <div className='flex items-center gap-2'>
        {data.image ? (
            <div className='relative group mt-5'>
                <label className='cursor-pointer'>
                    <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="user-image" className='w-16 h-16 rounded-full object-cover ring ring-slate-300 group-hover:opacity-80'/>
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={(e)=> onChange({...data, image: e.target.files[0], image_position: { x: 50, y: 50 }, image_scale: 1})}/>
                </label>
                <button onClick={removeImage} className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'>
                    <X className='size-3'/>
                </button>
            </div>
        ) : (
            <label className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                <User className='size-10 p-2.5 border rounded-full'/>
                {t('forms.personalInfo.uploadImage')}
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={(e)=> onChange({...data, image: e.target.files[0], image_position: { x: 50, y: 50 }, image_scale: 1})}/>
            </label>
        )}
        {typeof data.image === 'object' && (
            <div className='flex flex-col gap-1 pl-4 text-sm'>
                <p>{t('forms.personalInfo.removeBackground')}</p>
                <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                    <input type="checkbox" className="sr-only peer" onChange={()=>setRemoveBackground(prev => !prev)} checked={removeBackground}/>
                    <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
                    </div>
                    <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                </label>
            </div>
        )}
      </div>
      {data.image && (
        <div className='mt-3'>
            <button
                type="button"
                onClick={() => setShowRepositioner(prev => !prev)}
                className='flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors'
            >
                <Crop className='size-3.5' color="currentColor" />
                {t('forms.personalInfo.adjustImage')}
            </button>
            {showRepositioner && (
                <ImageRepositioner
                    imageSrc={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                    position={data.image_position || { x: 50, y: 50 }}
                    scale={data.image_scale || 1}
                    onPositionChange={(pos) => handleChange('image_position', pos)}
                    onScaleChange={(s) => handleChange('image_scale', s)}
                />
            )}
        </div>
      )}

    {fields.map((field)=>{
        const Icon = field.icon;
        return (
            <div key={field.key} className='space-y-1 mt-5'>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Icon className="size-4"/>
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                </label>
                <input type={field.type} value={data[field.key] || ""} onChange={(e)=>handleChange(field.key, e.target.value)} className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm' placeholder={`${t('forms.personalInfo.enterYour')} ${field.label.toLowerCase()}`} required={field.required}/>
            </div>
        )
    })}
    </div>
  )
}

export default PersonalInfoForm
