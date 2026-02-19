import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { translations } from "../../utils/translations";
import { getImagePositionStyle } from "../../utils/imagePosition";

const ClassicTemplate = ({ data, accentColor, showImage = true, language = "en" }) => {
    const t = translations[language];
    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        // Check if date contains month (yyyy-mm format)
        if (dateStr.includes("-")) {
            const [year, month] = dateStr.split("-");
            return new Date(year, month - 1).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short"
            });
        }

        // Just year (yyyy format)
        return dateStr;
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
            {/* Header */}
            <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
                {showImage && data.personal_info?.image && (
                    <div className="mb-4">
                        <div className="w-24 h-24 rounded-full mx-auto border-4 overflow-hidden" style={{ borderColor: accentColor }}>
                            <img
                                src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                style={getImagePositionStyle(data.personal_info)}
                            />
                        </div>
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="size-4" />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="size-4" />
                            <span className="break-all">{data.personal_info.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        {t.professionalSummary}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.professionalExperience}
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? t.present : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.projects}
                    </h2>

                    <ul className="space-y-3 ">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-6">
                                <div>
                                    <li className="font-semibold text-gray-800 ">{proj.name}</li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Publications */}
            {data.publication && data.publication.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.publications}
                    </h2>

                    <div className="space-y-4">
                        {data.publication.map((pub, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                                        <p className="text-gray-700 font-medium">{pub.publication}</p>
                                    </div>
                                    {pub.date && (
                                        <div className="text-right text-sm text-gray-600">
                                            <p>{pub.date}</p>
                                        </div>
                                    )}
                                </div>
                                {pub.authors && (
                                    <p className="text-sm text-gray-600 italic">{pub.authors}</p>
                                )}
                                {pub.description && (
                                    <p className="text-gray-700 leading-relaxed mt-1">{pub.description}</p>
                                )}
                                {pub.url && (
                                    <p className="text-sm text-gray-600 break-all mt-1">{pub.url}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.education}
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{edu.is_current ? t.present : formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.coreSkills}
                    </h2>

                    <div className="flex gap-4 flex-wrap">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700">
                                • {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Interests */}
            {data.interests && data.interests.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.interests}
                    </h2>

                    <div className="flex gap-4 flex-wrap">
                        {data.interests.map((interest, index) => (
                            <div key={index} className="text-gray-700">
                                • {interest}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        {t.languages}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {data.languages.map((lang, index) => {
                            const getProficiencyLevel = (proficiency) => {
                                if (proficiency >= 90) return t.native;
                                if (proficiency >= 70) return t.fluent;
                                if (proficiency >= 50) return t.intermediate;
                                if (proficiency >= 30) return t.basic;
                                return t.beginner;
                            };

                            return (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="relative w-20 h-20 mb-3">
                                        <svg className="w-20 h-20 transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke="#e5e7eb"
                                                strokeWidth="6"
                                                fill="none"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke={accentColor}
                                                strokeWidth="6"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 32}`}
                                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - lang.proficiency / 100)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {lang.proficiency}%
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="font-medium text-gray-900 text-center">{lang.name}</h4>
                                    <p className="text-xs text-gray-600">{getProficiencyLevel(lang.proficiency)}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Signature */}
            {(data.signature?.image || data.signature?.date) && (
                <section className="mt-8 pt-6">
                    <div className="flex flex-col items-end">
                        {data.signature.image && (
                            <img
                                src={typeof data.signature.image === 'string' ? data.signature.image : URL.createObjectURL(data.signature.image)}
                                alt="Signature"
                                className="h-16 mb-2 object-contain"
                            />
                        )}
                        {data.signature.date && (
                            <p className="text-sm text-gray-600">
                                {t.date}: {new Date(data.signature.date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;