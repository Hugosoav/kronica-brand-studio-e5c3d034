import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { fetchProjects } from "@/lib/projectsApi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <RevealOnScroll delay={index * 0.12} direction="up">
      <Link to={`/projetos/${project.id}`} className="group block">
        <div
          className="relative overflow-hidden rounded-lg aspect-[4/3]"
        >
          <motion.img
            src={project.images.cover}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

          {/* Hover reveal effect */}
          <div className="absolute inset-0 flex items-end p-5">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div>
                  <motion.span
                    className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1 block"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {project.category}
                  </motion.span>
                  <h3 className="text-lg md:text-xl font-light text-white">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {project.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1, 5);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto flex justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (!featuredProject) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="mb-12 border-b border-border/30 pb-6 items-start justify-between rounded-none flex flex-row my-0 py-0">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                Portfólio
              </span>
              <h2 className="text-2xl md:text-3xl font-light" />
            </div>
            <Link
              to="/projetos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Featured Project - Large Card with parallax tilt */}
        <RevealOnScroll>
          <Link to={`/projetos/${featuredProject.id}`} className="group block mb-12">
            <div className="relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[21/9]">
              <motion.img
                src={featuredProject.images.cover}
                alt={featuredProject.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2 block">
                      {featuredProject.category}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-light text-white mb-2">
                      {featuredProject.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 max-w-xl hidden md:block">
                      {featuredProject.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </RevealOnScroll>

        {/* Other Projects - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {otherProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <RevealOnScroll delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              to="/projetos"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 group"
            >
              <span className="text-sm">Explorar portfólio completo</span>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default ProjectShowcase;
