import { Check, PanelLeft } from 'lucide-react';
import { useState } from 'react'

const SidebarColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: "Charcoal", value: "#4a4a4a" },
        { name: "Slate", value: "#475569" },
        { name: "Gray", value: "#6b7280" },
        { name: "Zinc", value: "#52525b" },
        { name: "Stone", value: "#57534e" },
        { name: "Navy", value: "#1e3a5f" },
        { name: "Dark Blue", value: "#1e40af" },
        { name: "Dark Teal", value: "#115e59" },
        { name: "Dark Green", value: "#166534" },
        { name: "Dark Purple", value: "#581c87" },
        { name: "Dark Red", value: "#991b1b" },
        { name: "Black", value: "#1f2937" }
    ]

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-1 text-sm text-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 ring-slate-300 hover:ring transition-all px-3 py-2 rounded-lg'
            >
                <PanelLeft size={16} color={selectedColor} />
                <span className="max-sm:hidden">Sidebar</span>
            </button>
            {isOpen && (
                <div className='grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    {colors.map((color) => (
                        <div
                            key={color.value}
                            className='relative cursor-pointer group flex flex-col'
                            onClick={() => { onChange(color.value); setIsOpen(false) }}
                        >
                            <div
                                className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors"
                                style={{ backgroundColor: color.value }}
                            >
                            </div>
                            {selectedColor === color.value && (
                                <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                    <Check className="size-5 text-white" />
                                </div>
                            )}
                            <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SidebarColorPicker
