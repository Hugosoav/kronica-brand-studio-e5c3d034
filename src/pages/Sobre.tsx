import { useState } from "react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const solucoes = [
  {
    numero: "01",
    title: "Gestão de Marca (Branding)",
    desc: "Um modelo de gestão que cria valor para sua marca e potencializa os resultados do seu negócio. Estruturamos estratégia, posicionamento, comunicação e identidade para transformar a marca em um ativo estratégico do negócio, fortalecendo sua percepção, diferenciação e capacidade de gerar valor no mercado.",
    tags: ["Posicionamento", "Identidade Visual", "Sistema de Marca", "Brandbook", "Estratégia de Comunicação"],
  },
  {
    numero: "02",
    title: "Rebranding",
    desc: "Uma evolução estratégica para marcas que precisam acompanhar o crescimento do negócio. Analisamos o momento atual da empresa, identificamos o que precisa mudar e reconstruímos os principais pontos da marca para aumentar sua relevância, percepção de valor e competitividade.",
    tags: ["Diagnóstico", "Evolução de Marca", "Redesign", "Transição Visual", "Competitividade"],
  },
  {
    numero: "03",
    title: "Consultoria de Marca",
    desc: "Direcionamento estratégico para transformar uma marca em uma vantagem competitiva. Diagnosticamos o cenário atual, identificamos oportunidades e definimos caminhos claros para posicionamento, comunicação e gestão, apoiando decisões que fortalecem a marca e contribuem para os objetivos do negócio.",
    tags: ["Diagnóstico", "Auditoria de Marca", "Direção Estratégica", "Posicionamento", "Plano de Ação"],
  },
  {
    numero: "04",
    title: "Identidade Visual & Verbal",
    desc: "A expressão que transforma o posicionamento da sua empresa em percepção de valor. Desenvolvemos os sistemas visual e verbal da marca para garantir consistência em todos os pontos de contato, criando uma presença reconhecível, profissional e alinhada ao nível de negócio que a empresa deseja alcançar.",
    tags: ["Logo", "Símbolo", "Tipografia", "Paleta de Cores", "Tom de Voz", "Aplicações"],
  },
];

const SolucaoItem = ({ item, index }: { item: typeof solucoes[0]; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <RevealOnScroll delay={index * 0.08}>
      <div className="border-t border-border last:border-b">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
        >
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-xs text-muted-foreground font-light tabular-nums w-6 shrink-0">
              {item.numero}
            </span>
            <span
              className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light transition-colors duration-300 ${
                open ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
              }`}
            >
              {item.title}
            </span>
          </div>

          {/* Ícone animado */}
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 ml-6"
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                open
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground group-hover:border-foreground/40"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pl-8 sm:pl-12 md:pl-20 pb-8 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 block">
                    Entregas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealOnScroll>
  );
};

const Sobre = () => {
  return (
    <PageTransition>
      <Layout>
        {/* SEO */}
        <title>Sobre a Kronica</title>
        <meta
          name="description"
          content="A Kronica constrói marcas moldadas pelo tempo. Fundada por Hugo Soave, o estúdio une estratégia e design para criar sistemas de identidade que evoluem com os negócios." />
        <link rel="canonical" href="https://kronica.com.br/sobre" />
        <meta property="og:title" content="Sobre a Kronica" />
        <meta
          property="og:description"
          content="A Kronica constrói marcas moldadas pelo tempo. Fundada por Hugo Soave, o estúdio une estratégia e design para criar sistemas de identidade que evoluem com os negócios." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kronica.com.br/sobre" />

        {/* Founder Section */}
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">

              {/* Left — Foto + Nome */}
              <RevealOnScroll direction="up">
                <div className="w-full overflow-hidden rounded-lg bg-secondary/30 mb-6">
                  <img
                    src="/hugo-soave.jpg"
                    alt="Hugo Soave — CEO Founder da Kronica Studio"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    style={{ aspectRatio: "4/5" }}
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                  CEO Founder
                </span>
                <h2 className="text-2xl font-light text-foreground">Hugo Soave</h2>
              </RevealOnScroll>

              {/* Right — Bio + Abordagem */}
              <div className="md:sticky md:top-24">
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
                      A Kronica é um estúdio de design multidisciplinar independente. Nosso trabalho
                      abrange branding, consultoria de marca, estratégia, posicionamento e identidades
                      visuais. Atuamos na construção e evolução de marcas, conectando design e
                      estratégia aos objetivos de cada negócio.
                    </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.22}>
                    <p>
                      Grandes negócios são construídos sobre grandes marcas. Por isso, desenvolvemos
                      soluções que ajudam empresas a comunicar seu valor e fortalecer seu
                      posicionamento para criar uma presença consistente no mercado.
                    </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.30}>
                    <p>
                      Trabalhamos ao lado de empreendedores e empresas em diferentes momentos de
                      crescimento. Da criação de uma nova marca ao reposicionamento de negócios já
                      estabelecidos, transformamos desafios e oportunidades em marcas relevantes e
                      preparadas para se destacarem no mercado.
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

        {/* Soluções — largura total, estilo accordion criativo */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto">
            <div className="flex items-end justify-between mb-12 md:mb-16">
              <div>
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                    O que fazemos
                  </span>
                </RevealOnScroll>
                <AnimatedText
                  as="h2"
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight"
                  splitBy="words"
                  delay={0.05}
                >
                  Nossas soluções
                </AnimatedText>
              </div>
              <RevealOnScroll direction="right" delay={0.1}>
                <Link
                  to="/contato"
                  className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  Solicitar proposta
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </RevealOnScroll>
            </div>

            <div>
              {solucoes.map((item, i) => (
                <SolucaoItem key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Sobre;
