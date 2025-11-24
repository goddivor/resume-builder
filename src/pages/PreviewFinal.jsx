import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import Loader from '../components/Loader';
import FinalResumePreview from '../components/FinalResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import { ArrowLeftIcon, DownloadIcon, Share2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { useTranslation } from 'react-i18next';

const PreviewFinal = () => {
  const { t, i18n } = useTranslation();
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [annexes, setAnnexes] = useState([]);
  const [template, setTemplate] = useState('classic');
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [isDownloading, setIsDownloading] = useState(false);

  const loadResumeWithAnnexes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/resumes/${resumeId}/with-annexes`, {
        headers: { Authorization: token }
      });

      setResumeData(data.resume);
      setTemplate(data.resume.template || 'classic');
      setAccentColor(data.resume.accent_color || '#3B82F6');

      // Extract annexes data
      if (data.resume.annexes && data.resume.annexes.length > 0) {
        const sortedAnnexes = data.resume.annexes
          .filter(a => a.annexeId) // Filter out null annexeIds
          .sort((a, b) => a.order - b.order)
          .map(a => a.annexeId);
        setAnnexes(sortedAnnexes);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const saveTemplateChanges = async (newTemplate, newColor) => {
    try {
      await api.put(
        '/api/resumes/update',
        {
          resumeId,
          resumeData: {
            template: newTemplate || template,
            accent_color: newColor || accentColor
          }
        },
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.error('Error saving template changes:', error);
    }
  };

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    setResumeData(prev => ({ ...prev, template: newTemplate }));
    saveTemplateChanges(newTemplate, null);
  };

  const handleColorChange = (newColor) => {
    setAccentColor(newColor);
    setResumeData(prev => ({ ...prev, accent_color: newColor }));
    saveTemplateChanges(null, newColor);
  };

  const downloadCompletePDF = async () => {
    setIsDownloading(true);
    let toastId;
    try {
      toastId = toast.loading(t('previewFinal.generatingCompletePDF'));

      // 1. Créer un PDF merger
      const mergedPdf = await PDFDocument.create();

      // 2. Générer le PDF du CV via l'API backend (évite le problème oklch)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondes de timeout

      const cvResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/resumes/${resumeId}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template,
          accentColor
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!cvResponse.ok) {
        throw new Error('Failed to generate resume PDF');
      }

      const cvPdfBytes = await cvResponse.arrayBuffer();
      const cvPdfDoc = await PDFDocument.load(cvPdfBytes);

      // Copier les pages du CV
      const cvPages = await mergedPdf.copyPages(cvPdfDoc, cvPdfDoc.getPageIndices());
      cvPages.forEach(page => mergedPdf.addPage(page));

      // 3. Ajouter la page "ANNEXES" si il y a des annexes
      if (annexes && annexes.length > 0) {
        const annexePage = mergedPdf.addPage([595.28, 841.89]); // A4 size in points
        annexePage.drawText(t('previewFinal.annexes'), {
          x: 220,
          y: 420,
          size: 48,
        });

        // 4. Ajouter les PDFs des annexes
        for (const annexe of annexes) {
          try {
            const proxyUrl = `${import.meta.env.VITE_BASE_URL}/api/proxy/pdf?url=${encodeURIComponent(annexe.fileUrl)}`;
            const annexePdfBytes = await fetch(proxyUrl).then(res => res.arrayBuffer());
            const annexePdfDoc = await PDFDocument.load(annexePdfBytes);

            const annexePages = await mergedPdf.copyPages(annexePdfDoc, annexePdfDoc.getPageIndices());
            annexePages.forEach(page => mergedPdf.addPage(page));
          } catch (error) {
            console.error('Error adding annexe:', error);
          }
        }
      }

      // 5. Sauvegarder et télécharger
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.title || 'Resume'}_Complete.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success(t('previewFinal.pdfDownloadSuccess'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (toastId) toast.dismiss(toastId);
      toast.error(t('previewFinal.pdfDownloadError'));
    }
    setIsDownloading(false);
  };

  const handleShare = async () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    try {
      // Try Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare({ url: resumeUrl })) {
        await navigator.share({
          title: resumeData.title || 'My Resume',
          text: 'Check out my resume',
          url: resumeUrl
        });
        toast.success(t('previewFinal.sharedSuccess'));
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(resumeUrl);
        toast.success(t('previewFinal.linkCopied'));
      }
    } catch (error) {
      // If both fail, use clipboard as final fallback
      if (error.name === 'AbortError') {
        // User cancelled the share
        return;
      }

      try {
        await navigator.clipboard.writeText(resumeUrl);
        toast.success(t('previewFinal.linkCopied'));
      // eslint-disable-next-line no-unused-vars
      } catch (clipboardError) {
        // Last resort: show URL in prompt
        prompt(t('previewFinal.copyLinkPrompt'), resumeUrl);
      }
    }
  };

  useEffect(() => {
    if (resumeId) {
      loadResumeWithAnnexes();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!resumeData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-center text-6xl text-slate-400 font-medium'>{t('previewFinal.resumeNotFound')}</p>
        <button
          onClick={() => navigate('/app')}
          className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'
        >
          <ArrowLeftIcon className='mr-2 size-4' />
          {t('previewFinal.backToDashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-slate-100'>
      {/* Sidebar */}
      <div className='w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto'>
        <button
          onClick={() => navigate('/app')}
          className='flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors'
        >
          <ArrowLeftIcon className='size-4' />
          <span>{t('previewFinal.backToDashboard')}</span>
        </button>

        <h2 className='text-lg font-bold text-slate-800 mb-4'>{t('previewFinal.finalPreview')}</h2>
        <p className='text-sm text-slate-600 mb-6'>
          {t('previewFinal.customizeInfo')}
        </p>

        <div className='space-y-6'>
          <div>
            <h3 className='text-sm font-semibold text-slate-700 mb-3'>{t('previewFinal.template')}</h3>
            <TemplateSelector selectedTemplate={template} onChange={handleTemplateChange} />
          </div>

          <div>
            <h3 className='text-sm font-semibold text-slate-700 mb-3'>{t('previewFinal.accentColor')}</h3>
            <ColorPicker selectedColor={accentColor} onChange={handleColorChange} />
          </div>

          <div className='pt-4 border-t border-slate-200 space-y-3'>
            {resumeData.public && (
              <button
                onClick={handleShare}
                className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors'
              >
                <Share2Icon className='size-4' />
                {t('previewFinal.shareResume')}
              </button>
            )}
            <button
              onClick={downloadCompletePDF}
              disabled={isDownloading}
              className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors'
            >
              <DownloadIcon className='size-4' />
              {isDownloading ? t('previewFinal.generatingPDF') : t('previewFinal.downloadPDF')}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className='flex-1 overflow-y-auto p-8'>
        <div className='max-w-4xl mx-auto'>
          <FinalResumePreview
            resumeData={resumeData}
            annexes={annexes}
            template={template}
            accentColor={accentColor}
            language={i18n.language}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewFinal;
