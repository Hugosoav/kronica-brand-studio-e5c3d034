import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import { fetchPublishedPostBySlug } from "@/lib/postsApi";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", "slug", slug],
    queryFn: () => fetchPublishedPostBySlug(slug || ""),
    enabled: Boolean(slug),
  });

  const canonicalUrl = `https://kronica.com.br/blog/${slug ?? ""}`;

  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage ?? undefined,
        datePublished: post.publishedAt ?? undefined,
        author: { "@type": "Organization", name: "Kronica" },
        publisher: { "@type": "Organization", name: "Kronica" },
        mainEntityOfPage: canonicalUrl,
      }
    : null;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col relative">
        <div className="fixed inset-0 -z-10 bg-background" />
        <Header />
        <main className="flex-1 pt-16">
          {post && (
            <>
              <title>{post.title} — Blog Kronica</title>
              <meta name="description" content={post.excerpt} />
              <link rel="canonical" href={canonicalUrl} />
              <meta property="og:title" content={`${post.title} — Blog Kronica`} />
              <meta property="og:description" content={post.excerpt} />
              <meta property="og:type" content="article" />
              <meta property="og:url" content={canonicalUrl} />
              {post.coverImage && <meta property="og:image" content={post.coverImage} />}
              {articleSchema && (
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
              )}
            </>
          )}

          {isLoading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : !post ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Artigo não encontrado</h1>
                <Button asChild>
                  <Link to="/blog">Voltar para o blog</Link>
                </Button>
              </div>
            </div>
          ) : (
            <section className="py-20 md:py-28">
              <div className="container mx-auto">
                <div className="max-w-2xl mx-auto">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
                  >
                    <ArrowLeft className="size-4" />
                    Voltar
                  </Link>

                  <RevealOnScroll>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                      {formatDate(post.publishedAt)}
                    </span>
                  </RevealOnScroll>

                  <RevealOnScroll delay={0.05}>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] mb-8 text-foreground">
                      {post.title}
                    </h1>
                  </RevealOnScroll>

                  {post.coverImage && (
                    <RevealOnScroll delay={0.1}>
                      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-secondary/30 mb-10">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </RevealOnScroll>
                  )}

                  <RevealOnScroll delay={0.15}>
                    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-light prose-p:text-muted-foreground prose-li:text-muted-foreground">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>
                  </RevealOnScroll>
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPost;
