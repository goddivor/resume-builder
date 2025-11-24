import { Languages, Plus, Trash2 } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguagesForm = ({ data = [], onChange }) => {
    const { t } = useTranslation();

    const languages = data || [];

    const addLanguage = () =>{
        const newLanguage = {
            name: "",
            proficiency: 50 // Default to 50%
        };
        onChange([...languages, newLanguage])
    }

    const removeLanguage = (index)=>{
        const updated = languages.filter((_, i)=> i !== index);
        onChange(updated)
    }

    const updateLanguage = (index, field, value)=>{
        const updated = [...languages];
        updated[index] = {...updated[index], [field]: value}
        onChange(updated)
    }

// Helper to get proficiency level text
const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 90) return t('forms.languages.native');
    if (proficiency >= 70) return t('forms.languages.fluent');
    if (proficiency >= 50) return t('forms.languages.intermediate');
    if (proficiency >= 30) return t('forms.languages.basic');
    return t('forms.languages.beginner');
}

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>{t('forms.languages.title')}</h3>
            <p className='text-sm text-gray-500'>{t('forms.languages.subtitle')}</p>
        </div>
        <button onClick={addLanguage} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
            <Plus className="size-4"/>
            {t('forms.languages.addLanguage')}
        </button>
      </div>

      {languages.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
            <Languages className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
            <p>{t('forms.languages.noLanguages')}</p>
            <p className="text-sm">{t('forms.languages.getStarted')}</p>
        </div>
      ): (
        <div className='space-y-4'>
            {languages.map((language, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className='flex justify-between items-start'>
                        <h4>{t('forms.languages.languageNumber')}{index + 1}</h4>
                        <button onClick={()=> removeLanguage(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='space-y-3'>
                        <input
                            value={language.name || ""}
                            onChange={(e)=>updateLanguage(index, "name", e.target.value)}
                            type="text"
                            placeholder={t('forms.languages.languageName')}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />

                        <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                                <label className='text-sm font-medium text-gray-700'>
                                    {t('forms.languages.proficiency')}
                                </label>
                                <span className='text-sm text-blue-600 font-semibold'>
                                    {language.proficiency}% - {getProficiencyLevel(language.proficiency)}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={language.proficiency || 50}
                                onChange={(e)=>updateLanguage(index, "proficiency", parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className='flex justify-between text-xs text-gray-500'>
                                <span>{t('forms.languages.beginner')}</span>
                                <span>{t('forms.languages.native')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default LanguagesForm
