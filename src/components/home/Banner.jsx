import React from 'react'
import { useTranslation } from 'react-i18next'

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full py-2.5 font-medium text-sm text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#FDFEFF]">
        <p><span className="px-3 py-1 rounded-lg text-white bg-green-600 mr-2">{t('banner.new')}</span>{t('banner.message')}</p>
    </div>
  )
}

export default Banner
