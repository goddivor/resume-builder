import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalSidebarTemplate from './templates/ProfessionalSidebarTemplate'
import NeoTimelineTemplate from './templates/NeoTimelineTemplate'

const ResumePreview = ({data, template, accentColor, classes = "", language = "en"}) => {

    const showImage = data.template_settings?.[template]?.show_image !== false;
    const sidebarColor = data.template_settings?.["professional-sidebar"]?.sidebar_color || "#4a4a4a";

    const renderTemplate = ()=>{
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor} showImage={showImage} language={language}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor} showImage={showImage} language={language}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor} showImage={showImage} language={language}/>;
            case "professional-sidebar":
                return <ProfessionalSidebarTemplate data={data} accentColor={accentColor} sidebarColor={sidebarColor} showImage={showImage} language={language}/>;
            case "neo timeline":
              return <NeoTimelineTemplate data={data} accentColor={accentColor} showImage={showImage} language={language}/>;

            default:
                return <ClassicTemplate data={data} accentColor={accentColor} showImage={showImage} language={language}/>;
        }
    }

  return (
    <div className='w-full bg-gray-100'>
      <div id="resume-preview" className={"border border-gray-200 print:shadow-none print:border-none " + classes}>
        {renderTemplate()}
      </div>

      <style jsx>
        {`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden; 
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
        `}
      </style>
    </div>
  )
}

export default ResumePreview
