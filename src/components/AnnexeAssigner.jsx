import React, { useEffect, useState } from 'react';
import { FileTextIcon, XIcon, LoaderCircleIcon, GripVerticalIcon, CheckIcon } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AnnexeAssigner = ({ isOpen, onClose, resumeId }) => {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.auth);
  const [allAnnexes, setAllAnnexes] = useState([]);
  const [selectedAnnexes, setSelectedAnnexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load all user annexes
      const annexesRes = await api.get('/api/annexes/list', {
        headers: { Authorization: token }
      });
      setAllAnnexes(annexesRes.data.annexes);

      // Load current resume to get assigned annexes
      const resumeRes = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token }
      });

      if (resumeRes.data.resume.annexes && resumeRes.data.resume.annexes.length > 0) {
        setSelectedAnnexes(resumeRes.data.resume.annexes.map(a => a.annexeId));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const toggleAnnexe = (annexeId) => {
    if (selectedAnnexes.includes(annexeId)) {
      setSelectedAnnexes(selectedAnnexes.filter(id => id !== annexeId));
    } else {
      if (selectedAnnexes.length >= 15) {
        toast.error(t('annexeAssigner.maxAnnexes'));
        return;
      }
      setSelectedAnnexes([...selectedAnnexes, annexeId]);
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSelected = [...selectedAnnexes];
    const draggedItem = newSelected[draggedIndex];
    newSelected.splice(draggedIndex, 1);
    newSelected.splice(index, 0, draggedItem);

    setSelectedAnnexes(newSelected);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const saveAssignments = async () => {
    setIsSaving(true);
    try {
      const annexes = selectedAnnexes.map((annexeId, index) => ({
        annexeId,
        order: index + 1
      }));

      const { data } = await api.put(`/api/resumes/${resumeId}/annexes`, { annexes }, {
        headers: { Authorization: token }
      });

      toast.success(data.message);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsSaving(false);
  };

  useEffect(() => {
    if (isOpen && resumeId) {
      loadData();
    }
  }, [isOpen, loadData, resumeId]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-20 flex items-center justify-center'>
      <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>{t('annexeAssigner.title')}</h2>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <LoaderCircleIcon className='animate-spin size-8 text-slate-400' />
          </div>
        ) : (
          <>
            <p className='text-sm text-slate-600 mb-4'>
              {t('annexeAssigner.instruction')}
            </p>

            {/* Selected Annexes - Draggable */}
            {selectedAnnexes.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-sm font-semibold text-slate-700 mb-2'>
                  {t('annexeAssigner.selectedAnnexes')} ({selectedAnnexes.length}/15)
                </h3>
                <div className='space-y-2'>
                  {selectedAnnexes.map((annexeId, index) => {
                    const annexe = allAnnexes.find(a => a._id === annexeId);
                    if (!annexe) return null;
                    return (
                      <div
                        key={annexe._id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-move hover:shadow-md transition-all ${
                          draggedIndex === index ? 'opacity-50' : ''
                        }`}
                      >
                        <GripVerticalIcon className='size-5 text-blue-500' />
                        <div className='flex-1 flex items-center gap-3'>
                          <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold'>
                            {index + 1}
                          </span>
                          <FileTextIcon className='size-6 text-blue-600' />
                          <div className='flex-1'>
                            <p className='font-medium text-slate-700'>{annexe.title}</p>
                            <p className='text-xs text-slate-500'>{annexe.fileName}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAnnexe(annexe._id)}
                          className='p-2 hover:bg-red-100 rounded text-red-600 transition-colors'
                        >
                          <XIcon className='size-4' />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Annexes */}
            <h3 className='text-sm font-semibold text-slate-700 mb-2'>{t('annexeAssigner.availableAnnexes')}</h3>
            {allAnnexes.length === 0 ? (
              <div className='text-center py-8 text-slate-500'>
                <FileTextIcon className='size-12 mx-auto mb-2 text-slate-300' />
                <p>{t('annexeAssigner.noAnnexesAvailable')}</p>
              </div>
            ) : (
              <div className='space-y-2 mb-6'>
                {allAnnexes.map((annexe) => {
                  const isSelected = selectedAnnexes.includes(annexe._id);
                  return (
                    <button
                      key={annexe._id}
                      onClick={() => !isSelected && toggleAnnexe(annexe._id)}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <FileTextIcon className={`size-6 ${isSelected ? 'text-gray-400' : 'text-slate-600'}`} />
                      <div className='flex-1 text-left'>
                        <p className='font-medium text-slate-700'>{annexe.title}</p>
                        <p className='text-xs text-slate-500'>{annexe.fileName}</p>
                      </div>
                      {isSelected && (
                        <CheckIcon className='size-5 text-green-600' />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className='flex gap-3'>
              <button
                onClick={onClose}
                className='flex-1 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors'
              >
                {t('annexeAssigner.cancel')}
              </button>
              <button
                onClick={saveAssignments}
                disabled={isSaving}
                className='flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
              >
                {isSaving && <LoaderCircleIcon className='animate-spin size-4' />}
                {isSaving ? t('annexeAssigner.saving') : t('annexeAssigner.saveButton')}
              </button>
            </div>
          </>
        )}

        <XIcon
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default AnnexeAssigner;
