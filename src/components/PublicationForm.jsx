import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const PublicationForm = ({ data, onChange }) => {

const addPublication = () =>{
    const newPublication = {
        title: "",
        publication: "",
        date: "",
        authors: "",
        url: "",
        description: "",
    };
    onChange([...data, newPublication])
}

const removePublication = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updatePublication = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Publications </h3>
            <p className='text-sm text-gray-500'>Add your publications</p>
        </div>
        <button onClick={addPublication} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
            <Plus className="size-4"/>
            Add Publication
        </button>
      </div>


        <div className='space-y-4 mt-6'>
            {data.map((publication, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className='flex justify-between items-start'>
                        <h4>Publication #{index + 1}</h4>
                        <button onClick={()=> removePublication(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid gap-3'>

                        <input value={publication.title || ""} onChange={(e)=>updatePublication(index, "title", e.target.value)} type="text" placeholder="Title" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={publication.publication || ""} onChange={(e)=>updatePublication(index, "publication", e.target.value)} type="text" placeholder="Publication Name" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={publication.date || ""} onChange={(e)=>updatePublication(index, "date", e.target.value)} type="text" placeholder="Date" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={publication.authors || ""} onChange={(e)=>updatePublication(index, "authors", e.target.value)} type="text" placeholder="Authors (optional)" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={publication.url || ""} onChange={(e)=>updatePublication(index, "url", e.target.value)} type="text" placeholder="URL (optional)" className="px-3 py-2 text-sm rounded-lg"/>

                        <textarea rows={3} value={publication.description || ""} onChange={(e)=>updatePublication(index, "description", e.target.value)} placeholder="Description (optional)..." className="w-full px-3 py-2 text-sm rounded-lg resize-none"/>

                    </div>


                </div>
            ))}
        </div>

    </div>
  )
}

export default PublicationForm
