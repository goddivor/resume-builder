import { Plus, Heart, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const InterestsForm = ({ data, onChange }) => {
    const { t } = useTranslation();
    const [newInterest, setNewInterest] = useState("")

     const addInterest = () => {
        if(newInterest.trim() && !data.includes(newInterest.trim())){
            onChange([...data, newInterest.trim()])
            setNewInterest("")
        }
     }

      const removeInterest = (indexToRemove)=>{
        onChange(data.filter((_, index)=> index !== indexToRemove))
      }

      const handleKeyPress = (e)=>{
        if(e.key === "Enter"){
            e.preventDefault();
            addInterest();
        }
      }
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>{t('forms.interests.title')}</h3>
        <p className='text-sm text-gray-500'>{t('forms.interests.subtitle')}</p>
      </div>

      <div className="flex gap-2">
            <input type="text" placeholder={t('forms.interests.placeholder')} className='flex-1 px-3 py-2 text-sm'
            onChange={(e)=>setNewInterest(e.target.value)}
            value={newInterest}
            onKeyDown={handleKeyPress}
            />
            <button onClick={addInterest} disabled={!newInterest.trim} className='flex items-center gap-2 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                <Plus className="size-4"/> {t('forms.interests.add')}
            </button>
      </div>

      {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
            {data.map((interest, index)=>(
                <span key={index} className='flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm'>
                    {interest}
                    <button onClick={()=> removeInterest(index)} className="ml-1 hover:bg-pink-200 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </div>
      )
    :
    (
        <div className='text-center py-6 text-gray-500'>
            <Heart className="w-10 h-10 mx-auto mb-2 text-gray-300"/>
            <p>{t('forms.interests.noInterests')}</p>
            <p className="text-sm">{t('forms.interests.getStarted')}</p>
        </div>
    )}

    <div className='bg-pink-50 p-3 rounded-lg'>
        <p className='text-sm text-pink-800'>{t('forms.interests.tip')}</p>
    </div>
    </div>
  )
}

export default InterestsForm
