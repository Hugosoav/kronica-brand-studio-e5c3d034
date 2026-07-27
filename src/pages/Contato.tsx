import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import QualificationForm from "@/components/QualificationForm";

const Contato = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col relative">
        <div className="fixed inset-0 -z-10 bg-background" />
        <Header />
        <main className="flex-1 pt-16 flex flex-col">
          {/* SEO */}
          <title>Contato — Fale com a Kronica</title>
          <meta
            name="description"
            content="A equipe responde com próximos passos, prazos e direcionamento. Entre em contato com a Kronica."
          />

          {/* Qualification Form Section */}
          <section className="py-24 md:py-32">
            <div className="container mx-auto">
              <div className="mb-12 md:mb-16">
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                    Conte sobre seu projeto
                  </span>
                </RevealOnScroll>
                <AnimatedText
                  as="h1"
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.1] mb-6 text-foreground whitespace-normal lg:whitespace-nowrap"
                  splitBy="words"
                  delay={0.1}
                >
                  Formulário para proposta
                </AnimatedText>
                <RevealOnScroll delay={0.2}>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                    Essas informações nos ajudam a entender a maturidade do seu negócio e o tipo de
                    projeto para um melhor direcionamento antes da primeira conversa.
                  </p>
                </RevealOnScroll>
              </div>

              <RevealOnScroll delay={0.15}>
                <QualificationForm />
              </RevealOnScroll>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contato;
