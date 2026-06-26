import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { fetchPublishedPosts } from "@/lib/postsApi";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", "published"],
    queryFn: fetchPublishedPosts,
  });

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col relative">
        <div className="fixed inset-0 -z-10 bg-background" />
        <Header />
        <main className="flex-1 pt-16">
          <title>Blog — Kronica</title>
          <meta
            name="description"
            content="Reflexões, processos e referências sobre branding e design — direto da equipe Kronica."
          />
          <link rel="canonical" href="https://kronica.com.br/blog" />
          <meta property="og:title" content="Blog — Kronica" />
          <meta
            property="og:description"
            content="Reflexões, processos e referências sobre branding e design — direto da equipe Kronica."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://kronica.com.br/blog" />

          <section className="py-24 md:py-32">
            <div className="container mx-auto">
              <div className="max-w-3xl mb-16">
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                    Blog Kronica
                  </span>
                </RevealOnScroll>
                <AnimatedText
                  as="h1"
                  className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 text-foreground"
                  splitBy="words"
                  delay={0.1}
                >
                  {"O mundo das\nmarcas e do design"}
                </AnimatedText>
                <RevealOnScroll delay={0.2}>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                    Reflexões, processos e referências sobre branding e design
                  </p>
                </RevealOnScroll>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </div>
              ) : posts.length === 0 ? (
                <p className="text-muted-foreground">Em breve, novos artigos por aqui.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link to={`/blog/${post.slug}`} className="group block">
                        {post.coverImage && (
                          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary/30 mb-4">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                        <h2 className="text-lg font-medium text-foreground mt-2 group-hover:opacity-70 transition-opacity">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Blog;
