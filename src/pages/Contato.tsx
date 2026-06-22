import Header from "@/components/Header";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { useSearchParams } from "react-router-dom";

const Contato = () => {
  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get("service") || "";
  const selectedIndustry = searchParams.get("industry") || "";

  const hasContext = selectedService || selectedIndustry;
  const contextMessage = hasContext
    ? `Olá! Tenho interesse em ${selectedService || "seus serviços"}${selectedIndustry ? ` para o setor de ${selectedIndustry}` : ""}. Gostaria de saber mais.`
    : "";
  const whatsappMessage = hasContext
    ? encodeURIComponent(contextMessage)
    : "";
  const mailSubject = hasContext
    ? encodeURIComponent(`Interesse em ${selectedService || "serviços"}${selectedIndustry ? ` — ${selectedIndustry}` : ""}`)
    : "";
  const mailBody = hasContext ? encodeURIComponent(contextMessage) : "";
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

          {/* Contact Section */}
          <section className="flex-1 flex items-center py-24 md:py-32">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-12">
                {/* Left Column */}
                <div>
                  <RevealOnScroll>
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                      Entre em contato
                    </span>
                  </RevealOnScroll>
                  <AnimatedText
                    as="h1"
                    className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-16 text-foreground"
                    splitBy="words"
                    delay={0.1}
                  >
                    {"Vamos\ncriar algo\nextraordinário"}
                  </AnimatedText>

                  {hasContext && (
                    <RevealOnScroll delay={0.2}>
                      <div className="mb-10 p-4 rounded-xl border border-border bg-muted/30">
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                          Seu interesse
                        </span>
                        <p className="text-sm text-foreground">
                          {selectedService && <span className="inline-block px-3 py-1 mr-2 mb-1 rounded-full border border-border bg-background text-xs font-medium">{selectedService}</span>}
                          {selectedIndustry && <span className="inline-block px-3 py-1 mr-2 mb-1 rounded-full border border-border bg-background text-xs font-medium">{selectedIndustry}</span>}
                        </p>
                      </div>
                    </RevealOnScroll>
                  )}

                  <div className="space-y-10">
                    <RevealOnScroll delay={0.3}>
                      <a href={`mailto:kronicastudio@gmail.com${mailSubject ? `?subject=${mailSubject}&body=${mailBody}` : ""}`} className="group block">
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                          Email
                        </span>
                        <span className="text-lg md:text-xl text-foreground flex items-center gap-2 group-hover:opacity-70 transition-opacity">
                          kronicastudio@gmail.com
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    </RevealOnScroll>

                    <RevealOnScroll delay={0.4}>
                      <a
                        href={`https://wa.me/5528999161275${whatsappMessage ? `?text=${whatsappMessage}` : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                          WhatsApp
                        </span>
                        <span className="text-lg md:text-xl text-foreground flex items-center gap-2 group-hover:opacity-70 transition-opacity">
                          +55 (28) 99916-1275
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    </RevealOnScroll>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col justify-between">
                  <div>
                    <RevealOnScroll direction="up">
                      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                        Siga-nos
                      </span>
                    </RevealOnScroll>
                    <ul className="space-y-3">
                      {[
                        { label: "Instagram", href: "https://instagram.com/kronicastudio" },
                        { label: "LinkedIn", href: "https://www.linkedin.com/in/kronica-studio-4553ab3a4/" },
                      ].map((link, i) => (
                        <RevealOnScroll key={link.label} delay={0.15 * i} direction="up">
                          <li>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 text-lg md:text-xl text-foreground hover:opacity-70 transition-opacity"
                            >
                              {link.label}
                              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          </li>
                        </RevealOnScroll>
                      ))}
                    </ul>
                  </div>

                  <RevealOnScroll delay={0.5}>
                    <div className="mt-16 md:mt-0">
                      <div className="border-t border-border pt-6">
                        <p className="text-sm text-muted-foreground max-w-md">
                          Estúdio de Branding e design estratégico. Nosso processo começa pela escuta, compreendendo sua visão e traduzindo em história.
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default Contato;
