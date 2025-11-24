import React, { useEffect, useState } from 'react';
import { FileTextIcon, TrashIcon, XIcon, LoaderCircleIcon } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AnnexeManager = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.auth);
  const [annexes, setAnnexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAnnexes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/annexes/list', {
        headers: { Authorization: token }
      });
      setAnnexes(data.annexes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const deleteAnnexe = async (annexeId) => {
    try {
      const confirm = window.confirm(t('annexeManager.deleteConfirm'));
      if (confirm) {
        const { data } = await api.delete(`/api/annexes/delete/${annexeId}`, {
          headers: { Authorization: token }
        });
        setAnnexes(annexes.filter(annexe => annexe._id !== annexeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  useEffect(() => {
    if (isOpen) {
      loadAnnexes();
    }
  }, [isOpen, loadAnnexes]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
      <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>{t('annexeManager.title')}</h2>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <LoaderCircleIcon className='animate-spin size-8 text-slate-400' />
          </div>
        ) : annexes.length === 0 ? (
          <div className='text-center py-8 text-slate-500'>
            <FileTextIcon className='size-12 mx-auto mb-2 text-slate-300' />
            <p>{t('annexeManager.noAnnexes')}</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {annexes.map((annexe) => (
              <div key={annexe._id} className='flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3 flex-1'>
                  <FileTextIcon className='size-8 text-amber-500' />
                  <div className='flex-1'>
                    <h3 className='font-medium text-slate-700'>{annexe.title}</h3>
                    <p className='text-sm text-slate-500'>
                      {annexe.fileName} • {formatFileSize(annexe.fileSize)}
                    </p>
                    <p className='text-xs text-slate-400'>
                      {t('annexeManager.uploadedOn')} {new Date(annexe.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAnnexe(annexe._id)}
                  className='p-2 hover:bg-red-50 rounded text-red-600 transition-colors'
                >
                  <TrashIcon className='size-5' />
                </button>
              </div>
            ))}
          </div>
        )}

        <XIcon
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default AnnexeManager;
