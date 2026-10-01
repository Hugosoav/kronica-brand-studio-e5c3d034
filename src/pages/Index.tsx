import Layout from "@/components/Layout";
import InfiniteHero from "@/components/ui/infinite-hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLocale } from "@/hooks/use-locale";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Index = () => {
  const { t } = useLocale();
  const m = t.metodo;

  return (
    <PageTransition>
      <Layout>
        <title>Kronica — Marcas no Tempo</title>
        <meta name="description" content="Construímos marcas. Porque marcas são moldadas pelo tempo. A Kronica une estratégia e design para criar identidades que evoluem com os negócios." />
        <InfiniteHero title={t.hero.title} subtitle={t.hero.subtitle} />
        <ProjectShowcase />

        {/* Seção Método */}
        <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll direction="up">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">{m.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-16 md:mb-20">{m.title}</h2>
            </RevealOnScroll>

            <div className="space-y-0 divide-y divide-border/30">
              {m.steps.map((step, i) => (
                <RevealOnScroll key={step.numero} direction="up" delay={i * 0.07}>
                  <div className="grid grid-cols-[auto_1fr] md:grid-cols-[3rem_1fr_2fr] gap-x-8 gap-y-2 py-10 md:py-12 group">
                    <span className="text-xs text-muted-foreground/50 font-mono pt-1">{step.numero}</span>
                    <div>
                      <p className="text-base md:text-lg font-light text-foreground mb-0.5">{step.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">{step.subtitle}</p>
                    </div>
                    <p className="col-start-2 md:col-start-3 text-sm text-muted-foreground leading-relaxed mt-3 md:mt-0">{step.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll direction="up" className="mt-16 md:mt-20 text-center">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-sm text-foreground px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
              >
                {m.ctaLabel}
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
