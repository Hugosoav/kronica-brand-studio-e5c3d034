import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { useLocale } from "@/hooks/use-locale";
import SolucoesSection from "@/components/SolucoesSection";

const Sobre = () => {
  const { t } = useLocale();
  const s = t.sobre;

  return (
    <PageTransition>
      <Layout>
        <title>{s.pageTitle}</title>
        <meta name="description" content={s.bio1} />
        <link rel="canonical" href="https://kronica.com.br/sobre" />
        <meta property="og:title" content={s.pageTitle} />
        <meta property="og:description" content={s.bio1} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kronica.com.br/sobre" />

        <section className="pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">

              <RevealOnScroll direction="up">
                <div className="w-full overflow-hidden rounded-lg bg-secondary/30 mb-6">
                  <img src="/hugo-soave.jpg" alt="Hugo Soave" loading="eager" decoding="async" className="w-full h-full object-cover object-top" style={{ aspectRatio: "4/5" }} />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1 block">{s.ceoFounder}</span>
                <h2 className="text-2xl font-light text-foreground mb-4">Hugo Soave</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.hugoBio}</p>
              </RevealOnScroll>

              <div className="md:sticky md:top-24">
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">{s.eyebrow}</span>
                </RevealOnScroll>
                <AnimatedText as="h1" className="text-4xl lg:text-5xl font-light leading-tight mb-10" splitBy="words">
                  {s.title}
                </AnimatedText>

                <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed mb-14">
                  <RevealOnScroll delay={0.15}><p>{s.bio1}</p></RevealOnScroll>
                  <RevealOnScroll delay={0.22}><p>{s.bio2}</p></RevealOnScroll>
                  <RevealOnScroll delay={0.30}><p>{s.bio3}</p></RevealOnScroll>
                </div>

                <RevealOnScroll direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">{s.approach}</span>
                </RevealOnScroll>

                <div className="space-y-0 mb-14">
                  {[
                    { title: s.strategy, desc: s.strategyDesc },
                    { title: s.collaboration, desc: s.collaborationDesc },
                    { title: s.refinement, desc: s.refinementDesc },
                  ].map((item, i) => (
                    <RevealOnScroll key={item.title} delay={0.15 * i} direction="up">
                      <div className="border-l-2 border-foreground pl-5 py-4">
                        <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>

                <RevealOnScroll delay={0.3}>
                  <div className="border-t border-border pt-6">
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
              </div>
            </div>
          </div>
        </section>

        <SolucoesSection />
      </Layout>
    </PageTransition>
  );
};

export default Sobre;
