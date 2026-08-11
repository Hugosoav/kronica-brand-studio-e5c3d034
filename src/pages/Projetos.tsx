import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchProjects } from "@/lib/projectsApi";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Projetos = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <PageTransition>
      <Layout>
        <title>Projetos — Kronica</title>
        <meta name="description" content="Portfólio da Kronica — marcas construídas ao longo do tempo, com estratégia, identidade e sistemas visuais que evoluem com os negócios." />
        <link rel="canonical" href="https://kronica.com.br/projetos" />
        <meta property="og:title" content="Projetos — Kronica" />
        <meta property="og:description" content="Portfólio de projetos de branding e design da Kronica." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kronica.com.br/projetos" />

        {/* Projects – aligned grid layout */}
        <section className="pt-24 pb-16 md:pb-20">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                  }}
                  className="flex flex-col"
                >
                  <Link
                    to={`/projetos/${project.id}`}
                    className="group cursor-pointer block"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-secondary/30">
                      <motion.img
                        src={project.images.cover}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                      />
                      {/* Overlay sempre visível na parte inferior */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Info dentro do card */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
                            {project.category}
                          </p>
                          <h3 className="text-base md:text-lg font-medium text-white leading-tight">
                            {project.title}
                          </h3>
                        </div>
                        <span className="text-xs text-white/50 shrink-0 ml-3">{project.year}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Projetos;
