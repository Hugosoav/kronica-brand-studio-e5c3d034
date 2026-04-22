import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { projects } from "@/data/projects";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

const Projetos = () => {

  return (
    <PageTransition>
      <Layout>
        <title>Projetos — Kronica</title>
        <meta name="description" content="Portfólio de projetos de branding e design da Kronica." />

        {/* Projects – organic masonry layout */}
        <section className="pt-24 pb-16 md:pb-20">
          <div className="container mx-auto">
            <div className="columns-1 sm:columns-2 gap-6 sm:gap-8">
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
                  className="break-inside-avoid mb-8 sm:mb-10"
                >
                  <Link
                    to={`/projetos/${project.id}`}
                    className="group cursor-pointer block"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      <motion.img
                        src={project.images.cover}
                        alt={project.title}
                        className="w-full object-contain"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4 px-1">
                      <div>
                        <h3 className="text-base font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{project.category}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Projetos;
