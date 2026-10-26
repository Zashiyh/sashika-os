import { education, getSocial, profile, projects, skillCategories } from "@/data/portfolio";

/** Plain semantic version of the portfolio (no-JS fallback). */
export function PortfolioStatic() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl space-y-10 px-6 py-12 text-slate-200">
      <header>
        <p className="text-xs tracking-[0.3em] text-cyan-300">SASHIKA OS — TEXT MODE</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{profile.name}</h1>
        <p className="text-cyan-200">
          {profile.role} · {profile.location}
        </p>
        {profile.intro.map((p) => (
          <p key={p.slice(0, 20)} className="mt-3 leading-relaxed">
            {p}
          </p>
        ))}
      </header>
      <section>
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <ul className="mt-3 space-y-4">
          {projects.map((project) => (
            <li key={project.id}>
              <h3 className="font-semibold text-white">{project.name}</h3>
              <p className="text-sm">{project.description}</p>
              {project.tech.length > 0 && <p className="text-xs text-slate-400">{project.tech.join(" · ")}</p>}
              <p className="text-sm">
                {project.github && <a className="text-cyan-300 underline" href={project.github}>Source</a>}
                {project.github && project.demo && " · "}
                {project.demo && <a className="text-cyan-300 underline" href={project.demo}>Live demo</a>}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {skillCategories.map((c) => (
            <li key={c.id}>
              <strong className="text-white">{c.title}:</strong> {c.skills.map((s) => s.name).join(", ")}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-white">Education</h2>
        {education.map((e) => (
          <p key={e.institution} className="mt-2 text-sm">
            {e.programme} — {e.institution} ({e.period})
          </p>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p className="mt-2 text-sm">
          <a className="text-cyan-300 underline" href={`mailto:${profile.email}`}>{profile.email}</a> ·{" "}
          <a className="text-cyan-300 underline" href={getSocial("github").href}>GitHub</a> ·{" "}
          <a className="text-cyan-300 underline" href={getSocial("linkedin").href}>LinkedIn</a>
        </p>
      </section>
    </div>
  );
}
