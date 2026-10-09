import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { fetchProjects } from "@/lib/projectsApi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLocale } from "@/hooks/use-locale";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLocale();
  return (
    <RevealOnScroll delay={index * 0.1} direction="up">
      <Link to={`/projetos/${project.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
          <motion.img
            src={project.images.cover}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-500" />

          {/* Blur hover overlay */}
          <div className="absolute inset-0 backdrop-blur-[3px] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
            <div className="flex items-center gap-2 text-white text-sm uppercase tracking-[0.2em] translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              <span>{t.projetos.viewProject ?? "Ver projeto"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-end p-5 md:p-6 pointer-events-none">
            <div className="w-full">
              <motion.span
                className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1 block"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                {project.category}
              </motion.span>
              <h3 className="text-lg md:text-xl font-light text-white">
                {project.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </RevealOnScroll>
  );
}

const ProjectShowcase = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const { t } = useLocale();
  const p = t.projetos;

  const showcaseProjects = projects.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto flex justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (showcaseProjects.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        {/* Cabeçalho da seção */}
        <RevealOnScroll>
          <div className="mb-10 pb-6 border-b border-border/30 flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                {p.portfolio}
              </span>
            </div>
            <Link
              to="/projetos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            >
              {p.seeAll}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Grade uniforme de 2 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {showcaseProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              to="/projetos"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
            >
              <span className="text-sm">{p.exploreAll}</span>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default ProjectShowcase;
