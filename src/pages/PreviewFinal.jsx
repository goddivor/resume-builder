import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import Loader from '../components/Loader';
import FinalResumePreview from '../components/FinalResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';

const PreviewFinal = () => {
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
      toastId = toast.loading('Generating complete PDF...');

      // 1. Créer un PDF merger
      const mergedPdf = await PDFDocument.create();

      // 2. Générer le PDF du CV via l'API backend (évite le problème oklch)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondes de timeout

      const cvResponse = await fetch(`http://localhost:3000/api/resumes/${resumeId}/generate-pdf`, {
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
        annexePage.drawText('ANNEXES', {
          x: 220,
          y: 420,
          size: 48,
        });

        // 4. Ajouter les PDFs des annexes
        for (const annexe of annexes) {
          try {
            const proxyUrl = `http://localhost:3000/api/proxy/pdf?url=${encodeURIComponent(annexe.fileUrl)}`;
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
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (toastId) toast.dismiss(toastId);
      toast.error('Failed to generate PDF');
    }
    setIsDownloading(false);
  };

  useEffect(() => {
    if (resumeId) {
      loadResumeWithAnnexes();
    }
  }, [resumeId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!resumeData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
        <button
          onClick={() => navigate('/app')}
          className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'
        >
          <ArrowLeftIcon className='mr-2 size-4' />
          Back to Dashboard
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
          <span>Back to Dashboard</span>
        </button>

        <h2 className='text-lg font-bold text-slate-800 mb-4'>Final Preview</h2>
        <p className='text-sm text-slate-600 mb-6'>
          Customize template and color. Content is locked.
        </p>

        <div className='space-y-6'>
          <div>
            <h3 className='text-sm font-semibold text-slate-700 mb-3'>Template</h3>
            <TemplateSelector selectedTemplate={template} onChange={handleTemplateChange} />
          </div>

          <div>
            <h3 className='text-sm font-semibold text-slate-700 mb-3'>Accent Color</h3>
            <ColorPicker selectedColor={accentColor} onChange={handleColorChange} />
          </div>

          <div className='pt-4 border-t border-slate-200'>
            <button
              onClick={downloadCompletePDF}
              disabled={isDownloading}
              className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors'
            >
              <DownloadIcon className='size-4' />
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
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
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewFinal;
