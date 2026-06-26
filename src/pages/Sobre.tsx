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
          content="A Kronica é um estúdio de design que desenvolve soluções visuais do físico ao digital, com clareza estratégica e alto nível de refinamento." />
        <link rel="canonical" href="https://kronica.com.br/sobre" />
        <meta property="og:title" content="Sobre a Kronica" />
        <meta
          property="og:description"
          content="A Kronica é um estúdio de design que desenvolve soluções visuais do físico ao digital, com clareza estratégica e alto nível de refinamento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kronica.com.br/sobre" />
        

        {/* About Section */}
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
              {/* Left - Title + Text */}
              <div>
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                    Sobre o estúdio
                  </span>
                </RevealOnScroll>
                <AnimatedText
                  as="h1"
                  className="text-4xl lg:text-6xl font-light leading-tight mb-10 md:text-4xl"
                  splitBy="words">
                  
                  Filosofia de Design
                </AnimatedText>

                <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  <RevealOnScroll delay={0.2}>
                    <p>A Kronica é um estúdio de design especializado na criação de marcas e materiais gráficos para o físico e o digital. Atuando como um estúdio independente, cada projeto que construímos é tratado de forma exclusiva, com participação ativa do cliente integrada ao processo.</p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.35}>
                    <p>Nossa premissa surgiu da ideia de que marcas precisam ser lembradas não apenas pela estética, mas pelas histórias que carregam: como surgiram e como devem ser lembradas.</p>
                  </RevealOnScroll>
                </div>
              </div>

              {/* Right - Approach + Stats */}
              <div className="flex flex-col justify-between">
                <div>
                  <RevealOnScroll direction="up">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                      Abordagem
                    </span>
                  </RevealOnScroll>

                  <div className="space-y-0">
                    {[
                    { title: "Estratégia", desc: "Diagnóstico aprofundado de contexto, mercado e posicionamento" },
                    { title: "Colaboração", desc: "Parceria próxima com clientes durante as etapas do processo" },
                    { title: "Refinamento", desc: "Soluções visuais contemporâneas com alto nível de acabamento" }].
                    map((item, i) =>
                    <RevealOnScroll key={item.title} delay={0.15 * i} direction="up">
                        <div className="border-l-2 border-foreground pl-5 py-4">
                          <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </RevealOnScroll>
                    )}
                  </div>
                </div>

                <RevealOnScroll delay={0.4}>
                  <div className="mt-12 md:mt-0">
                    <div className="border-t border-border pt-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                            Fundação
                          </span>
                          <span className="text-3xl md:text-4xl font-light">2026</span>
                        </div>
                        




                        
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </PageTransition>);

};

export default Sobre;