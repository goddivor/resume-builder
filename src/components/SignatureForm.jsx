import { Calendar, PenTool, ShieldCheck, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const SignatureForm = ({data, onChange, removeSignatureBackground, setRemoveSignatureBackground}) => {
    const { t } = useTranslation();

    const handleChange = (field, value)=>{
        onChange({...data, [field]: value})
    }

    const removeSignatureImage = () => {
        onChange({...data, image: ''})
        setRemoveSignatureBackground(false)
    }

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>{t('forms.signature.title')}</h3>
      <p className='text-sm text-gray-600'>{t('forms.signature.subtitle')}</p>

      <div className='flex items-center gap-2'>
        {data.image ? (
            <div className='relative group mt-5'>
                <label className='cursor-pointer'>
                    <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="signature" className='h-16 max-w-xs object-contain ring ring-slate-300 group-hover:opacity-80 rounded'/>
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={(e)=>handleChange("image", e.target.files[0])}/>
                </label>
                <button onClick={removeSignatureImage} className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'>
                    <X className='size-3'/>
                </button>
            </div>
        ) : (
            <label className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                <PenTool className='size-10 p-2.5 border rounded-full'/>
                {t('forms.signature.uploadSignature')}
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={(e)=>handleChange("image", e.target.files[0])}/>
            </label>
        )}
        {typeof data.image === 'object' && (
            <div className='flex flex-col gap-1 pl-4 text-sm'>
                <p>{t('forms.signature.removeBackground')}</p>
                <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                    <input type="checkbox" className="sr-only peer" onChange={()=>setRemoveSignatureBackground(prev => !prev)} checked={removeSignatureBackground}/>
                    <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
                    </div>
                    <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                </label>
            </div>
        )}
      </div>

      {/* Declaration checkbox */}
      <div className='mt-5'>
        <label className='flex items-center gap-2 cursor-pointer text-sm text-gray-700'>
            <input
                type="checkbox"
                checked={data.show_declaration || false}
                onChange={(e) => handleChange('show_declaration', e.target.checked)}
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <ShieldCheck className='size-4' color="#3b82f6" />
            {t('forms.signature.declaration')}
        </label>
      </div>

      <div className='space-y-1 mt-5'>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Calendar className="size-4"/>
            {t('forms.signature.date')}
        </label>
        <input
            type="date"
            value={data.date || ""}
            onChange={(e)=>handleChange("date", e.target.value)}
            className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
        />
      </div>

      {/* Date format selector */}
      {data.date && (
        <div className='space-y-1 mt-4'>
            <label className="text-sm font-medium text-gray-600">
                {t('forms.signature.dateFormatLabel')}
            </label>
            <div className='flex gap-3 mt-1'>
                <label className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${data.date_format !== 'short' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    <input
                        type="radio"
                        name="date_format"
                        value="long"
                        checked={data.date_format !== 'short'}
                        onChange={() => handleChange('date_format', 'long')}
                        className='sr-only'
                    />
                    {t('forms.signature.dateFormatLong')}
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${data.date_format === 'short' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    <input
                        type="radio"
                        name="date_format"
                        value="short"
                        checked={data.date_format === 'short'}
                        onChange={() => handleChange('date_format', 'short')}
                        className='sr-only'
                    />
                    {t('forms.signature.dateFormatShort')}
                </label>
            </div>
        </div>
      )}
    </div>
  )
}

export default SignatureForm
