import { Mail, Phone, MapPin, Calendar, Flag, Car, Briefcase, GraduationCap, Award } from "lucide-react";
import { translations } from "../../utils/translations";
import { getImagePositionStyle } from "../../utils/imagePosition";

const ProfessionalSidebarTemplate = ({ data, accentColor, sidebarColor = "#4a4a4a", showImage = true, language = "en" }) => {
    const t = translations[language];

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) {
            const [year, month] = dateStr.split("-");
            return new Date(year, month - 1).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                year: "numeric",
                month: "long",
            });
        }
        return dateStr;
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800 min-h-[297mm]">
            <div className="grid grid-cols-12 min-h-[297mm]">
                {/* Left Sidebar */}
                <aside
                    className="col-span-4 p-6 text-white"
                    style={{ backgroundColor: sidebarColor }}
                >
                    {/* Profile Image */}
                    {showImage && data.personal_info?.image && (
                        <div className="mb-6 flex justify-center">
                            <div
                                className="rounded-full p-1.5"
                                style={{ backgroundColor: accentColor }}
                            >
                                <div className="w-36 h-36 rounded-full overflow-hidden">
                                    <img
                                        src={typeof data.personal_info.image === 'string'
                                            ? data.personal_info.image
                                            : URL.createObjectURL(data.personal_info.image)
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        style={getImagePositionStyle(data.personal_info)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Info */}
                    <section className="mb-6">
                        <div className="space-y-2.5 text-sm">
                            {data.personal_info?.location && (
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} color="#e74c3c" className="mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-200">{data.personal_info.location}</span>
                                </div>
                            )}
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone size={16} color="#27ae60" className="flex-shrink-0" />
                                    <span className="text-gray-200">{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={16} color="#f39c12" className="flex-shrink-0" />
                                    <span className="text-gray-200 break-all">{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.birth_date && (
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} color="#3498db" className="flex-shrink-0" />
                                    <span className="text-gray-200">{data.personal_info.birth_date}</span>
                                </div>
                            )}
                            {data.personal_info?.nationality && (
                                <div className="flex items-center gap-3">
                                    <Flag size={16} color="#3498db" className="flex-shrink-0" />
                                    <span className="text-gray-200">{data.personal_info.nationality}</span>
                                </div>
                            )}
                            {data.personal_info?.driving_license && (
                                <div className="flex items-center gap-3">
                                    <Car size={16} color="#27ae60" className="flex-shrink-0" />
                                    <span className="text-gray-200">{data.personal_info.driving_license}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Professional Summary */}
                    {data.professional_summary && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold tracking-wide mb-3 pb-1 border-b border-gray-500 uppercase">
                                {t.professionalSummary}
                            </h2>
                            <p className="text-sm text-gray-300 leading-relaxed text-justify">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold tracking-wide mb-3 pb-1 border-b border-gray-500 uppercase">
                                {t.skills}
                            </h2>
                            <ul className="space-y-1.5 text-sm text-gray-300">
                                {data.skills.map((skill, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span style={{ color: accentColor }}>•</span>
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Interests */}
                    {data.interests && data.interests.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold tracking-wide mb-3 pb-1 border-b border-gray-500 uppercase">
                                {t.interests}
                            </h2>
                            <ul className="space-y-1.5 text-sm text-gray-300">
                                {data.interests.map((interest, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span style={{ color: accentColor }}>•</span>
                                        <span>{interest}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold tracking-wide mb-3 pb-1 border-b border-gray-500 uppercase">
                                {t.languages}
                            </h2>
                            <ul className="space-y-1.5 text-sm text-gray-300">
                                {data.languages.map((lang, index) => {
                                    const getProficiencyLabel = (proficiency) => {
                                        if (proficiency >= 90) return language === "fr" ? "Langue maternelle" : "Native";
                                        if (proficiency >= 70) return t.fluent;
                                        if (proficiency >= 50) return t.intermediate;
                                        if (proficiency >= 30) return t.basic;
                                        return t.beginner;
                                    };
                                    return (
                                        <li key={index} className="flex items-start gap-2">
                                            <span style={{ color: accentColor }}>•</span>
                                            <span>{lang.name} : {getProficiencyLabel(lang.proficiency)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-8 relative">
                    {/* Accent color bar on the left */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-2"
                        style={{ backgroundColor: accentColor }}
                    />

                    <div className="pl-8 pr-6 py-8">
                        {/* Name */}
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold leading-tight text-gray-900">
                                {data.personal_info?.full_name || "Your Name"}
                            </h1>
                            {data.personal_info?.profession && (
                                <p className="text-lg text-zinc-600 mt-1">
                                    {data.personal_info.profession}
                                </p>
                            )}
                        </header>

                        {/* Experience */}
                        {data.experience && data.experience.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-lg font-bold mb-4 pb-1 border-b-2 uppercase"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    {t.professionalExperience}
                                </h2>
                                <div className="space-y-5">
                                    {data.experience.map((exp, index) => (
                                        <div key={index}>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: accentColor }}
                                            >
                                                {formatDate(exp.start_date)} - {exp.is_current ? t.present : formatDate(exp.end_date)}
                                            </p>
                                            <h3 className="font-bold text-zinc-800">
                                                {exp.position}
                                            </h3>
                                            <p className="text-sm text-zinc-600 mb-2">
                                                {exp.company}{exp.location && ` | ${exp.location}`}
                                            </p>
                                            {exp.description && (
                                                <ul className="text-sm text-zinc-700 space-y-1 ml-4">
                                                    {exp.description.split("\n").filter(line => line.trim()).map((line, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-zinc-400">•</span>
                                                            <span className="text-justify">{line}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-lg font-bold mb-4 pb-1 border-b-2 uppercase"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    {t.education}
                                </h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, index) => (
                                        <div key={index}>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: accentColor }}
                                            >
                                                {edu.is_current ? t.present : formatDate(edu.graduation_date)}
                                            </p>
                                            <h3 className="font-bold text-zinc-800">
                                                {edu.degree}
                                            </h3>
                                            <p className="text-sm text-zinc-600">
                                                {edu.institution}{edu.location && `, ${edu.location}`}
                                            </p>
                                            {edu.description && (
                                                <p className="text-sm text-zinc-600 mt-1 italic">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {data.project && data.project.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-lg font-bold mb-4 pb-1 border-b-2 uppercase"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    {t.projects}
                                </h2>
                                <div className="space-y-4">
                                    {data.project.map((project, index) => (
                                        <div key={index}>
                                            <h3 className="font-bold text-zinc-800">
                                                {project.name}
                                            </h3>
                                            {project.type && (
                                                <p className="text-sm mb-1" style={{ color: accentColor }}>
                                                    {project.type}
                                                </p>
                                            )}
                                            {project.description && (
                                                <ul className="text-sm text-zinc-700 space-y-1 ml-4">
                                                    {project.description.split("\n").filter(line => line.trim()).map((line, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-zinc-400">•</span>
                                                            <span>{line}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Publications */}
                        {data.publication && data.publication.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-lg font-bold mb-4 pb-1 border-b-2 uppercase"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    {t.publications}
                                </h2>
                                <div className="space-y-4">
                                    {data.publication.map((pub, index) => (
                                        <div key={index}>
                                            {pub.date && (
                                                <p
                                                    className="text-sm font-semibold"
                                                    style={{ color: accentColor }}
                                                >
                                                    {formatDate(pub.date)}
                                                </p>
                                            )}
                                            <h3 className="font-bold text-zinc-800">
                                                {pub.title}
                                            </h3>
                                            {pub.publication && (
                                                <p className="text-sm text-zinc-600">{pub.publication}</p>
                                            )}
                                            {pub.authors && (
                                                <p className="text-sm text-zinc-500 italic">{pub.authors}</p>
                                            )}
                                            {pub.description && (
                                                <p className="text-sm text-zinc-700 mt-1">{pub.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Signature */}
                        {(data.signature?.image || data.signature?.date || data.signature?.show_declaration) && (
                            <section className="mt-8">
                                {data.signature.show_declaration && (
                                    <p className="text-xs text-zinc-700 italic mb-4">{t.declaration}</p>
                                )}
                                <div className="flex flex-col items-end">
                                    {data.signature.image && (
                                        <img
                                            src={typeof data.signature.image === 'string'
                                                ? data.signature.image
                                                : URL.createObjectURL(data.signature.image)
                                            }
                                            alt="Signature"
                                            className="h-16 mb-2 object-contain"
                                        />
                                    )}
                                    {data.signature.date && (
                                        <p className="text-xs text-zinc-600">
                                            {t.date}: {data.signature.date_format === 'short'
                                                ? new Date(data.signature.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')
                                                : new Date(data.signature.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfessionalSidebarTemplate;
