import { useRef, useState, useCallback } from 'react'
import { Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ImageRepositioner = ({ imageSrc, position, scale, onPositionChange, onScaleChange }) => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const dragStartRef = useRef({ x: 0, y: 0 })
    const startPositionRef = useRef({ x: 50, y: 50 })

    const handlePointerDown = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        startPositionRef.current = { x: position.x, y: position.y }
        e.target.setPointerCapture(e.pointerId)
    }, [position])

    const handlePointerMove = useCallback((e) => {
        if (!isDragging) return
        e.preventDefault()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * -100 * scale
        const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * -100 * scale

        const newX = Math.max(0, Math.min(100, startPositionRef.current.x + deltaX))
        const newY = Math.max(0, Math.min(100, startPositionRef.current.y + deltaY))

        onPositionChange({ x: Math.round(newX), y: Math.round(newY) })
    }, [isDragging, scale, onPositionChange])

    const handlePointerUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleReset = () => {
        onPositionChange({ x: 50, y: 50 })
        onScaleChange(1)
    }

    return (
        <div className="mt-3 space-y-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <Move className="size-3" color="#6b7280" />
                {t('forms.personalInfo.repositionImage')}
            </p>

            <div
                ref={containerRef}
                className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-grab active:cursor-grabbing mx-auto"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
            >
                <img
                    src={imageSrc}
                    alt="Reposition preview"
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable={false}
                    style={{
                        objectPosition: `${position.x}% ${position.y}%`,
                        transform: `scale(${scale})`,
                    }}
                />
                {!isDragging && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                        <Move className="size-6 drop-shadow" color="#ffffff" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 justify-center">
                <ZoomOut className="size-4" color="#9ca3af" />
                <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={scale}
                    onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                    className="w-32 accent-blue-500"
                />
                <ZoomIn className="size-4" color="#9ca3af" />
            </div>

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                >
                    <RotateCcw className="size-3" color="currentColor" />
                    {t('forms.personalInfo.resetPosition')}
                </button>
            </div>
        </div>
    )
}

export default ImageRepositioner
