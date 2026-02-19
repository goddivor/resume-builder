export const getImagePositionStyle = (personalInfo) => ({
    objectPosition: `${personalInfo?.image_position?.x ?? 50}% ${personalInfo?.image_position?.y ?? 50}%`,
    transform: `scale(${personalInfo?.image_scale ?? 1})`,
})
