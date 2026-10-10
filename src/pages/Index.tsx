import Layout from "@/components/Layout";
import InfiniteHero from "@/components/ui/infinite-hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import SolucoesSection from "@/components/SolucoesSection";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { useLocale } from "@/hooks/use-locale";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import MetodologiaScroll from "@/components/MetodologiaScroll";

const Index = () => {
  const { t } = useLocale();
  const m = t.metodo;
  const s = t.sobre;
  const h = t.home;

  return (
    <PageTransition>
      <Layout>
        <title>Kronica — Marcas no Tempo</title>
        <meta name="description" content="Construímos marcas. Porque marcas são moldadas pelo tempo. A Kronica une estratégia e design para criar identidades que evoluem com os negócios." />
        <InfiniteHero title={t.hero.title} subtitle={t.hero.subtitle} />
        <ProjectShowcase />

        {/* Seção Soluções (mesma da página Sobre) */}
        <SolucoesSection withTopBorder={false} />

        {/* Seção Fundador + números (resumo da página Sobre) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
              <RevealOnScroll direction="up">
                <div className="w-full overflow-hidden rounded-lg bg-secondary/30">
                  <img src="/hugo-soave.jpg" alt="Hugo Soave" loading="lazy" decoding="async" className="w-full h-full object-cover object-top" style={{ aspectRatio: "4/5" }} />
                </div>
              </RevealOnScroll>

              <div>
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1 block">{s.ceoFounder}</span>
                </RevealOnScroll>
                <AnimatedText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6" splitBy="words">
                  Hugo Soave
                </AnimatedText>
                <RevealOnScroll delay={0.15}>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-10">{s.hugoBio}</p>
                </RevealOnScroll>

                <RevealOnScroll delay={0.25}>
                  <div className="border-t border-border pt-6 mb-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">{s.founded}</span>
                        <span className="text-3xl md:text-4xl font-light">2026</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">{s.experience}</span>
                        <span className="text-3xl md:text-4xl font-light">{s.years}</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.3}>
                  <Link
                    to="/sobre"
                    className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-base text-foreground px-10 py-4 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
                  >
                    {m.ctaLabel}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Metodologia: linha do tempo guiada pela rolagem */}
        <MetodologiaScroll />

        {/* Chamada final */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto text-center max-w-3xl">
            <AnimatedText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6" splitBy="words">
              {h.ctaTitle}
            </AnimatedText>
            <RevealOnScroll delay={0.15}>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-10">{h.ctaText}</p>
            </RevealOnScroll>
            <RevealOnScroll direction="up" delay={0.25}>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-base text-foreground px-10 py-4 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
              >
                {t.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Index;
