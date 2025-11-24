import { translations } from "../../utils/translations";

const MinimalTemplate = ({ data, accentColor, showImage = true, language = "en" }) => {
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
    const formatDate = (dateStr) => {
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                {showImage && data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                    <div className="mb-4">
                        <img src={data.personal_info.image} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                    </div>
                ) : (
                    showImage && data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                        <div className="mb-4">
                            <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                        </div>
                    ) : null
                )}
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">{data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        {t.experience}
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? t.present : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
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
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        {t.projects}
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Publications */}
            {data.publication && data.publication.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        {t.publications}
                    </h2>

                    <div className="space-y-6">
                        {data.publication.map((pub, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{pub.title}</h3>
                                    {pub.date && (
                                        <span className="text-sm text-gray-500">{pub.date}</span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-2">{pub.publication}</p>
                                {pub.authors && (
                                    <p className="text-sm text-gray-600 italic">{pub.authors}</p>
                                )}
                                {pub.description && (
                                    <p className="text-gray-700 leading-relaxed mt-2">{pub.description}</p>
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
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        {t.education}
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        {t.skills}
                    </h2>

                    <div className="text-gray-700">
                        {data.skills.join(" • ")}
                    </div>
                </section>
            )}

            {/* Signature */}
            {(data.signature?.image || data.signature?.date) && (
                <section className="mt-10">
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

export default MinimalTemplate;