import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';
import { TEMPLATES } from './templatesCatalog';

export default function ResumePreview({ resumeData, selectedTemplate }) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    targetRole
  } = resumeData;

  // Find template metadata from catalog, fallback to 'modern'
  const templateConfig = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const theme = templateConfig.theme || {};

  const fontClass = theme.fontFamily || 'font-sans';
  const accentColor = theme.headerAccentColor || 'text-blue-600';
  const borderColor = theme.headerBorderColor || 'border-blue-600';
  const badgeStyle = theme.badgeStyle || 'bg-slate-100 text-slate-800 border-slate-200';

  // Section Header Class Helper
  const getSectionHeaderClass = () => {
    switch (theme.sectionHeaderStyle) {
      case 'blue-underline':
        return `${accentColor} border-b-2 ${borderColor} pb-1 text-xs font-bold uppercase tracking-wider mb-2.5`;
      case 'left-bar':
        return `pl-2 border-l-4 ${borderColor} ${accentColor} text-xs font-bold uppercase tracking-wider mb-2.5`;
      case 'heavy-bar':
        return `text-slate-900 border-b-4 border-slate-800 pb-1 text-xs font-extrabold uppercase tracking-wider mb-2.5`;
      case 'dashed-underline':
        return `text-slate-900 border-b border-dashed border-slate-400 pb-1 text-xs font-bold uppercase tracking-wider mb-2.5`;
      case 'uppercase-bold':
        return `text-slate-900 border-b border-slate-900 pb-1 text-xs font-bold uppercase tracking-widest mb-2.5`;
      case 'solid-underline':
      default:
        return `text-slate-900 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider mb-2.5`;
    }
  };

  const sectionHeaderClass = getSectionHeaderClass();

  return (
    <div className="bg-white text-slate-800 rounded-card shadow-2xl overflow-hidden p-8 min-h-[800px] border border-slate-200 text-xs leading-relaxed select-text select-all">
      <div className={fontClass}>

        {/* HEADER */}
        <div
          className={`mb-6 ${
            theme.headerStyle === 'centered'
              ? 'text-center border-b pb-4 ' + borderColor
              : theme.headerStyle === 'left-bar'
              ? 'border-l-4 pl-4 py-1 ' + borderColor
              : theme.headerStyle === 'boxed'
              ? 'bg-slate-900 text-white p-6 rounded-xl mb-6'
              : theme.headerStyle === 'compact'
              ? 'border-b pb-2 mb-4 ' + borderColor
              : 'border-b-2 pb-4 ' + borderColor
          }`}
        >
          <h1
            className={`text-2xl font-bold tracking-tight ${
              theme.headerStyle === 'boxed' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {personalInfo?.fullName || 'Your Full Name'}
          </h1>

          {targetRole && (
            <div
              className={`text-xs font-semibold mt-0.5 ${
                theme.headerStyle === 'boxed' ? 'text-blue-200' : accentColor
              }`}
            >
              {targetRole}
            </div>
          )}

          <div
            className={`flex flex-wrap gap-3 mt-3 text-[11px] ${
              theme.headerStyle === 'boxed' ? 'text-slate-200' : 'text-slate-600'
            } ${theme.headerStyle === 'centered' ? 'justify-center' : ''}`}
          >
            {personalInfo?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo?.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo?.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3" />
                {personalInfo.github}
              </span>
            )}
            {personalInfo?.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {personalInfo.portfolio}
              </span>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="mb-5">
            <h2 className={sectionHeaderClass}>Professional Summary</h2>
            <p className="text-slate-700 leading-normal">{summary}</p>
          </div>
        )}

        {/* EXPERIENCE */}
        {experience && experience.length > 0 && (
          <div className="mb-5">
            <h2 className={sectionHeaderClass}>Work Experience</h2>
            <div className="space-y-3.5">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.position || 'Position Title'}</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span className="font-semibold text-slate-800">{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {exp.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <div className="mb-5">
            <h2 className={sectionHeaderClass}>Projects</h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1">
                      {proj.title}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                    </span>
                  </div>
                  {proj.subtitle && (
                    <div className="text-[11px] text-slate-600 italic mb-1 font-mono">
                      {proj.subtitle}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                      {proj.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <div className="mb-5">
            <h2 className={sectionHeaderClass}>Education</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">{edu.institution}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {skills &&
          (skills.technical?.length > 0 ||
            skills.frameworks?.length > 0 ||
            skills.tools?.length > 0 ||
            skills.soft?.length > 0) && (
            <div className="mb-5">
              <h2 className={sectionHeaderClass}>Skills & Expertise</h2>

              <div className="space-y-2 text-slate-700">
                {skills.technical?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 mr-2">Technical:</span>
                    {theme.skillStyle === 'inline' ? (
                      <span className="text-slate-800">{skills.technical.join(', ')}</span>
                    ) : (
                      <div className="inline-flex flex-wrap gap-1.5 align-middle mt-1">
                        {skills.technical.map((sk, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${badgeStyle}`}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {skills.frameworks?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 mr-2">Frameworks:</span>
                    {theme.skillStyle === 'inline' ? (
                      <span className="text-slate-800">{skills.frameworks.join(', ')}</span>
                    ) : (
                      <div className="inline-flex flex-wrap gap-1.5 align-middle mt-1">
                        {skills.frameworks.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {skills.tools?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 mr-2 font-mono text-[11px]">
                      Tools & Platforms:
                    </span>
                    {theme.skillStyle === 'inline' ? (
                      <span className="text-slate-800">{skills.tools.join(', ')}</span>
                    ) : (
                      <div className="inline-flex flex-wrap gap-1.5 align-middle mt-1">
                        {skills.tools.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <div className="mb-5">
            <h2 className={sectionHeaderClass}>Certifications</h2>
            <div className="space-y-1.5">
              {certifications.map((c, idx) => (
                <div key={c.id || idx} className="flex justify-between text-slate-800">
                  <span className="font-semibold">
                    {c.name}{' '}
                    <span className="text-slate-500 font-normal">({c.issuer})</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <div>
            <h2 className={sectionHeaderClass}>Key Achievements & Honors</h2>
            <div className="space-y-2">
              {achievements.map((a, idx) => (
                <div key={a.id || idx}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{a.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{a.date}</span>
                  </div>
                  {a.description && <p className="text-slate-700 mt-0.5">{a.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
