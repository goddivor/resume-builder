import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { translations } from "../../utils/translations";

const ModernTemplate = ({ data, accentColor, showImage = true, language = "en" }) => {
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
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
				<div className="flex items-center gap-6 mb-4">
					{showImage && data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
						<img src={data.personal_info.image} alt="Profile" className="w-24 h-24 object-cover rounded-full border-4 border-white" />
					) : (
						showImage && data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
							<img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-24 h-24 object-cover rounded-full border-4 border-white" />
						) : null
					)}
					<h1 className="text-4xl font-light">
						{data.personal_info?.full_name || "Your Name"}
					</h1>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info?.linkedin} className="flex items-center gap-2">
							<Linkedin className="size-4" />
							<span className="break-all text-xs">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info?.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="break-all text-xs">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							{t.professionalSummary}
						</h2>
						<p className="text-gray-700 ">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
							{t.experience}
						</h2>

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatDate(exp.start_date)} - {exp.is_current ? t.present : formatDate(exp.end_date)}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
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
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							{t.projects}
						</h2>

						<div className="space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>


									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Publications */}
				{data.publication && data.publication.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
							{t.publications}
						</h2>

						<div className="space-y-6">
							{data.publication.map((pub, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{pub.title}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{pub.publication}</p>
										</div>
										{pub.date && (
											<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
												{pub.date}
											</div>
										)}
									</div>
									{pub.authors && (
										<p className="text-sm text-gray-600 italic mt-1">{pub.authors}</p>
									)}
									{pub.description && (
										<p className="text-gray-700 leading-relaxed mt-3">{pub.description}</p>
									)}
									{pub.url && (
										<p className="text-sm text-gray-600 break-all mt-2">{pub.url}</p>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
								{t.education}
							</h2>

							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="font-semibold text-gray-900">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center text-sm text-gray-600">
											<span>{edu.is_current ? t.present : formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span>GPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills & Languages Column */}
					<div className="space-y-8">
						{/* Skills */}
						{data.skills && data.skills.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									{t.skills}
								</h2>

								<div className="flex flex-wrap gap-2">
									{data.skills.map((skill, index) => (
										<span
											key={index}
											className="px-3 py-1 text-sm text-white rounded-full"
											style={{ backgroundColor: accentColor }}
										>
											{skill}
										</span>
									))}
								</div>
							</section>
						)}

						{/* Interests */}
						{data.interests && data.interests.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									{t.interests}
								</h2>

								<div className="flex flex-wrap gap-2">
									{data.interests.map((interest, index) => (
										<span
											key={index}
											className="px-3 py-1 text-sm text-white rounded-full"
											style={{ backgroundColor: accentColor }}
										>
											{interest}
										</span>
									))}
								</div>
							</section>
						)}

						{/* Languages */}
						{data.languages && data.languages.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									{t.languages}
								</h2>

								<div className="grid grid-cols-2 gap-4">
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
					</div>
				</div>

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
		</div>
	);
}

export default ModernTemplate;