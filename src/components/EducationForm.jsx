import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next'

const EducationForm = ({ data, onChange }) => {
    const { t } = useTranslation();

const addEducation = () =>{
    const newEducation = {
        institution: "",
        degree: "",
        field: "",
        graduation_date: "",
        gpa: "",
        is_current: false
    };
    onChange([...data, newEducation])
}

const removeEducation = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateEducation = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>{t('forms.education.title')}</h3>
            <p className='text-sm text-gray-500'>{t('forms.education.subtitle')}</p>
        </div>
        <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
            <Plus className="size-4"/>
            {t('forms.education.addEducation')}
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
            <p>{t('forms.education.noEducation')}</p>
            <p className="text-sm">{t('forms.education.getStarted')}</p>
        </div>
      ): (
        <div className='space-y-4'>
            {data.map((education, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className='flex justify-between items-start'>
                        <h4>{t('forms.education.educationNumber')}{index + 1}</h4>
                        <button onClick={()=> removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid md:grid-cols-2 gap-3'>

                        <input value={education.institution || ""} onChange={(e)=>updateEducation(index, "institution", e.target.value)} type="text" placeholder={t('forms.education.institutionName')} className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"/>

                        <input value={education.degree || ""} onChange={(e)=>updateEducation(index, "degree", e.target.value)} type="text" placeholder={t('forms.education.degree')} className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"/>

                        <input value={education.field || ""} onChange={(e)=>updateEducation(index, "field", e.target.value)} type="text" className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder={t('forms.education.fieldOfStudy')}/>

                        <input
                            value={education.graduation_date || ""}
                            onChange={(e)=>updateEducation(index, "graduation_date", e.target.value)}
                            type="text"
                            placeholder="YYYY-MM or YYYY"
                            disabled={education.is_current}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <input value={education.gpa || ""} onChange={(e)=>updateEducation(index, "gpa", e.target.value)} type="text" className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder={t('forms.education.gpa')}/>

                    <label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
                        <input
                            type="checkbox"
                            checked={education.is_current || false}
                            onChange={(e)=>updateEducation(index, "is_current", e.target.checked)}
                            className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                        <span>{t('forms.education.currentlyStudying')}</span>
                    </label>

                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm
