import React, { useState, useMemo, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTranslation } from 'react-i18next';
import ResumePreview from './ResumePreview';
import AnnexePage from './AnnexePage';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FinalResumePreview = ({ resumeData, annexes, template, accentColor, language }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState({});

  const onDocumentLoadSuccess = useCallback((annexeId, { numPages }) => {
    setNumPages(prev => ({ ...prev, [annexeId]: numPages }));
  }, []);

  // Mémoriser les options pour éviter les re-renders
  const pdfOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  }), []);

  // Mémoriser les URLs des annexes
  const annexeUrls = useMemo(() => {
    return annexes.map(annexe => ({
      id: annexe._id,
      file: { url: `${import.meta.env.VITE_BASE_URL}/api/proxy/pdf?url=${encodeURIComponent(annexe.fileUrl)}` }
    }));
  }, [annexes]);

  return (
    <div className='space-y-8'>
      {/* Resume Pages */}
      <div className='bg-white shadow-lg'>
        <ResumePreview
          data={resumeData}
          template={template}
          accentColor={accentColor}
          language={language}
          classes='py-4'
        />
      </div>

      {/* Annexe Separator Page (only if there are annexes) */}
      {annexes && annexes.length > 0 && (
        <>
          <div className='shadow-lg'>
            <AnnexePage />
          </div>

          {/* Annexe PDF Previews */}
          {annexeUrls.map((annexeUrl) => {

            return (
              <div key={annexeUrl.id} className='bg-white shadow-lg p-4'>
                <Document
                  file={annexeUrl.file}
                  onLoadSuccess={({ numPages }) => onDocumentLoadSuccess(annexeUrl.id, { numPages })}
                  loading={<div className='p-8 text-center text-slate-500'>{t('previewFinal.loadingPDF')}</div>}
                  error={(error) => (
                    <div className='p-8 text-center'>
                      <p className='text-red-500'>{t('previewFinal.failedToLoadPDF')}</p>
                      <p className='text-sm text-slate-500 mt-2'>{error?.message}</p>
                    </div>
                  )}
                  options={pdfOptions}
                >
                  {numPages[annexeUrl.id] &&
                    Array.from(new Array(numPages[annexeUrl.id]), (el, i) => (
                      <Page
                        key={`page_${i + 1}`}
                        pageNumber={i + 1}
                        width={794}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className='mb-4'
                      />
                    ))}
                </Document>
              </div>
            );
          })}
        </>
      )}

      {/* Message if no annexes */}
      {(!annexes || annexes.length === 0) && (
        <div className='bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center'>
          <p className='text-slate-500'>{t('previewFinal.noAnnexesAssigned')}</p>
        </div>
      )}
    </div>
  );
};

export default FinalResumePreview;
