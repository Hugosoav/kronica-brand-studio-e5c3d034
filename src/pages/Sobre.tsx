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
    title: "Branding",
    desc: "Construção completa da marca do zero. Começamos pelo posicionamento estratégico — quem é a marca, para quem ela fala, e como quer ser lembrada — e traduzimos isso em um sistema visual coeso, com identidade, tom de voz e presença consistente em todos os pontos de contato.",
    tags: ["Posicionamento", "Naming", "Identidade Visual", "Sistema de Marca", "Brandbook"],
  },
  {
    numero: "02",
    title: "Rebranding",
    desc: "Atualização e reposicionamento de marcas existentes para novos momentos de negócio. Seja uma expansão, mudança de público ou simplesmente uma marca que ficou para trás no tempo — revisamos o que precisa ser preservado e o que precisa evoluir, sem perder a essência.",
    tags: ["Diagnóstico", "Evolução de Marca", "Redesign", "Transição Visual", "Consistência"],
  },
  {
    numero: "03",
    title: "Consultoria de Marca",
    desc: "Para empresas que já têm uma marca estabelecida mas sentem que algo não está funcionando. Fazemos um diagnóstico estratégico profundo — analisamos percepção, consistência, concorrência e oportunidades — e entregamos um plano claro de direção.",
    tags: ["Diagnóstico", "Auditoria de Marca", "Direção Estratégica", "Posicionamento", "Plano de Ação"],
  },
  {
    numero: "04",
    title: "Identidade Visual",
    desc: "Criação de sistemas visuais coerentes e duradouros. Desenvolvemos símbolo, tipografia, paleta de cores, padrões e aplicações que funcionam juntos — do cartão de visitas ao Instagram, da embalagem ao ambiente físico. Design que comunica antes mesmo de ser lido.",
    tags: ["Logo", "Símbolo", "Tipografia", "Paleta de Cores", "Aplicações", "Social Media"],
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
              className={`text-2xl md:text-4xl lg:text-5xl font-light transition-colors duration-300 ${
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
              <div className="pl-12 md:pl-20 pb-8 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
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
                      A Kronica é um estúdio de branding movido pela convicção de que grandes marcas
                      não surgem prontas. Elas são construídas ao longo do tempo, capítulo após
                      capítulo. Trabalhamos para transformar estratégia em identidade, identidade em
                      percepção e percepção em reconhecimento, desenvolvendo marcas que permanecem
                      coerentes à medida que evoluem.
                    </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={0.25}>
                    <p>
                      Toda empresa conta uma história, queira ou não. Algumas são esquecidas logo no
                      primeiro capítulo. Outras conquistam espaço porque existe intenção por trás da
                      forma como se apresentam, se comunicam e são lembradas. A Kronica existe para
                      escrever narrativas que resistem ao tempo. Unimos estratégia e design para que
                      a história de uma marca não seja apenas contada, mas reconhecida.
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
