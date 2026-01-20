import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Heart, Globe } from "lucide-react";
import { translations } from "../../utils/translations";

const NeoTimelineTemplate = ({
    data,
    accentColor = "#2563eb",
    showImage = true,
    language = "en"
}) => {
    const t = translations[language];

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) {
            const [year, month] = dateStr.split("-");
            return new Date(year, month - 1).toLocaleDateString(
                language === "fr" ? "fr-FR" : "en-US",
                { year: "numeric", month: "short" }
            );
        }
        return dateStr;
    };

    // Lighten color for backgrounds
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-gray-800 min-h-[297mm]">
            {/* HEADER */}
            <header
                className="p-8 pb-6"
                style={{ backgroundColor: hexToRgba(accentColor, 0.08) }}
            >
                <div className="flex gap-6 items-start">
                    {/* Image */}
                    {showImage && data.personal_info?.image && (
                        <div className="flex-shrink-0">
                            <div
                                className="p-1 rounded-2xl"
                                style={{ backgroundColor: accentColor }}
                            >
                                <img
                                    src={
                                        typeof data.personal_info.image === "string"
                                            ? data.personal_info.image
                                            : URL.createObjectURL(data.personal_info.image)
                                    }
                                    alt="Profile"
                                    className="w-28 h-28 object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    )}

                    {/* Identity */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>

                        {data.personal_info?.profession && (
                            <p
                                className="text-lg font-medium mt-1"
                                style={{ color: accentColor }}
                            >
                                {data.personal_info.profession}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
                            {data.personal_info?.email && (
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} color={accentColor} />
                                    {data.personal_info.email}
                                </span>
                            )}
                            {data.personal_info?.phone && (
                                <span className="flex items-center gap-1.5">
                                    <Phone size={14} color={accentColor} />
                                    {data.personal_info.phone}
                                </span>
                            )}
                            {data.personal_info?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} color={accentColor} />
                                    {data.personal_info.location}
                                </span>
                            )}
                            {data.personal_info?.birth_date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} color={accentColor} />
                                    {data.personal_info.birth_date}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {data.professional_summary && (
                    <p className="mt-5 text-sm text-gray-700 leading-relaxed border-l-3 pl-4" style={{ borderColor: accentColor }}>
                        {data.professional_summary}
                    </p>
                )}
            </header>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-12 gap-0">
                {/* LEFT COLUMN - Timeline */}
                <div className="col-span-8 p-6 pr-4">
                    {/* EXPERIENCE TIMELINE */}
                    {data.experience?.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-5">
                                <Briefcase size={18} color={accentColor} />
                                <h2
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: accentColor }}
                                >
                                    {t.professionalExperience}
                                </h2>
                            </div>

                            <div className="relative">
                                {/* Timeline line */}
                                <div
                                    className="absolute left-[7px] top-2 bottom-2 w-0.5"
                                    style={{ backgroundColor: hexToRgba(accentColor, 0.3) }}
                                />

                                <div className="space-y-6">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-7">
                                            {/* Timeline dot */}
                                            <div
                                                className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-3 bg-white"
                                                style={{ borderColor: accentColor }}
                                            />

                                            <div className="flex justify-between items-start gap-2 flex-wrap">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {exp.position}
                                                    </h3>
                                                    <p className="text-sm" style={{ color: accentColor }}>
                                                        {exp.company}{exp.location && ` • ${exp.location}`}
                                                    </p>
                                                </div>
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full font-medium"
                                                    style={{
                                                        backgroundColor: hexToRgba(accentColor, 0.1),
                                                        color: accentColor
                                                    }}
                                                >
                                                    {formatDate(exp.start_date)} - {exp.is_current ? t.present : formatDate(exp.end_date)}
                                                </span>
                                            </div>

                                            {exp.description && (
                                                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                                    {exp.description.split("\n").filter(line => line.trim()).map((line, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span style={{ color: accentColor }}>•</span>
                                                            <span>{line}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* EDUCATION TIMELINE */}
                    {data.education?.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-5">
                                <GraduationCap size={18} color={accentColor} />
                                <h2
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: accentColor }}
                                >
                                    {t.education}
                                </h2>
                            </div>

                            <div className="relative">
                                {/* Timeline line */}
                                <div
                                    className="absolute left-[7px] top-2 bottom-2 w-0.5"
                                    style={{ backgroundColor: hexToRgba(accentColor, 0.3) }}
                                />

                                <div className="space-y-5">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="relative pl-7">
                                            {/* Timeline dot */}
                                            <div
                                                className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-3 bg-white"
                                                style={{ borderColor: accentColor }}
                                            />

                                            <div className="flex justify-between items-start gap-2 flex-wrap">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {edu.degree}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {edu.institution}{edu.location && ` • ${edu.location}`}
                                                    </p>
                                                </div>
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full font-medium"
                                                    style={{
                                                        backgroundColor: hexToRgba(accentColor, 0.1),
                                                        color: accentColor
                                                    }}
                                                >
                                                    {edu.is_current ? t.present : formatDate(edu.graduation_date)}
                                                </span>
                                            </div>

                                            {edu.description && (
                                                <p className="mt-1 text-sm text-gray-600 italic">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* PROJECTS */}
                    {data.project?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <Award size={18} color={accentColor} />
                                <h2
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: accentColor }}
                                >
                                    {t.projects}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {data.project.map((project, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-lg border"
                                        style={{ borderColor: hexToRgba(accentColor, 0.2) }}
                                    >
                                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                                        {project.type && (
                                            <p className="text-xs mt-0.5" style={{ color: accentColor }}>
                                                {project.type}
                                            </p>
                                        )}
                                        {project.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN - Skills & Others */}
                <div
                    className="col-span-4 p-6 pl-4"
                    style={{ backgroundColor: hexToRgba(accentColor, 0.04) }}
                >
                    {/* SKILLS */}
                    {data.skills?.length > 0 && (
                        <section className="mb-8">
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-4"
                                style={{ color: accentColor }}
                            >
                                {t.skills}
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-xs font-medium rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(accentColor, 0.15),
                                            color: accentColor
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* LANGUAGES */}
                    {data.languages?.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe size={16} color={accentColor} />
                                <h2
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: accentColor }}
                                >
                                    {t.languages}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {data.languages.map((lang, i) => {
                                    const getProficiencyLabel = (proficiency) => {
                                        if (proficiency >= 90) return language === "fr" ? "Natif" : "Native";
                                        if (proficiency >= 70) return t.fluent;
                                        if (proficiency >= 50) return t.intermediate;
                                        if (proficiency >= 30) return t.basic;
                                        return t.beginner;
                                    };

                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-800">{lang.name}</span>
                                                <span className="text-gray-500 text-xs">
                                                    {getProficiencyLabel(lang.proficiency)}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${lang.proficiency}%`,
                                                        backgroundColor: accentColor
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* INTERESTS */}
                    {data.interests?.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart size={16} color={accentColor} />
                                <h2
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: accentColor }}
                                >
                                    {t.interests}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {data.interests.map((interest, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-1 text-xs rounded-md bg-white border text-gray-700"
                                        style={{ borderColor: hexToRgba(accentColor, 0.3) }}
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* PUBLICATIONS */}
                    {data.publication?.length > 0 && (
                        <section>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-4"
                                style={{ color: accentColor }}
                            >
                                {t.publications}
                            </h2>

                            <div className="space-y-3">
                                {data.publication.map((pub, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="font-medium text-gray-900">{pub.title}</p>
                                        {pub.publication && (
                                            <p className="text-xs text-gray-600">{pub.publication}</p>
                                        )}
                                        {pub.date && (
                                            <p className="text-xs mt-0.5" style={{ color: accentColor }}>
                                                {formatDate(pub.date)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SIGNATURE */}
                    {(data.signature?.image || data.signature?.date) && (
                        <section className="mt-8 pt-4 border-t" style={{ borderColor: hexToRgba(accentColor, 0.2) }}>
                            <div className="flex flex-col items-end">
                                {data.signature.image && (
                                    <img
                                        src={typeof data.signature.image === 'string'
                                            ? data.signature.image
                                            : URL.createObjectURL(data.signature.image)
                                        }
                                        alt="Signature"
                                        className="h-12 mb-1 object-contain"
                                    />
                                )}
                                {data.signature.date && (
                                    <p className="text-xs text-gray-500">
                                        {t.date}: {new Date(data.signature.date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeoTimelineTemplate;
