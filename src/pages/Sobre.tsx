import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";

const Sobre = () => {
  return (
    <PageTransition>
      <Layout>
        {/* SEO */}
        <title>Sobre a Kronica</title>
        <meta
          name="description"
          content="A Kronica é um estúdio de design especializado na criação e gestão de marcas, fundado por Hugo Soave em 2026." />
        <link rel="canonical" href="https://kronica.com.br/sobre" />
        <meta property="og:title" content="Sobre a Kronica" />
        <meta
          property="og:description"
          content="A Kronica é um estúdio de design especializado na criação e gestão de marcas, fundado por Hugo Soave em 2026." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kronica.com.br/sobre" />

        {/* Founder Section */}
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start">

              {/* Left — Foto + Nome */}
              <div>
                <RevealOnScroll direction="up">
                  <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-secondary/30 mb-8">
                    <img
                      src="/hugo-soave.jpg"
                      alt="Hugo Soave — CEO Founder da Kronica Studio"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </RevealOnScroll>
                <RevealOnScroll delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                    CEO Founder
                  </span>
                  <h2 className="text-2xl font-light text-foreground">Hugo Soave</h2>
                </RevealOnScroll>
              </div>

              {/* Right — Bio + Abordagem */}
              <div>
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                    Sobre o estúdio
                  </span>
                </RevealOnScroll>
                <AnimatedText
                  as="h1"
                  className="text-4xl lg:text-5xl font-light leading-tight mb-10"
                  splitBy="words"
                >
                  Kronica Studio
                </AnimatedText>

                <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed mb-14">
                  <RevealOnScroll delay={0.15}>
                    <p>
                      Me chamo Hugo e sou o CEO Founder da Kronica Studio. Tenho 23 anos,
                      bachareado em Design Gráfico pela FAESA, atuo há 5 anos no mercado de marcas.
                      Nesse período, passei por agências de comunicação e marketing até fundar o meu
                      próprio estúdio. Hoje, meu foco é na criação e gestão de marcas, unindo
                      estratégia e criatividade para gerar impacto real.
                    </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.25}>
                    <p>
                      A Kronica é um estúdio de design especializado na criação e gestão de marcas,
                      fundada por mim em 2026. O estúdio surgiu da premissa de que grandes marcas são
                      construídas e moldadas ao longo do tempo. A Kronica busca valorizar o branding
                      completo da empresa — da Identidade Visual à ativação e posicionamento da marca
                      no digital.
                    </p>
                  </RevealOnScroll>
                </div>

                {/* Abordagem */}
                <RevealOnScroll direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                    Abordagem
                  </span>
                </RevealOnScroll>

                <div className="space-y-0 mb-14">
                  {[
                    { title: "Estratégia", desc: "Diagnóstico aprofundado de contexto, mercado e posicionamento" },
                    { title: "Colaboração", desc: "Parceria próxima com clientes durante as etapas do processo" },
                    { title: "Refinamento", desc: "Soluções visuais contemporâneas com alto nível de acabamento" },
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
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                          Fundação
                        </span>
                        <span className="text-3xl md:text-4xl font-light">2026</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                          Experiência
                        </span>
                        <span className="text-3xl md:text-4xl font-light">5 anos</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

            </div>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Sobre;
