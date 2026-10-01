import { useState } from "react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const SolucaoItem = ({
  item,
  index,
  deliveriesLabel,
}: {
  item: { numero: string; title: string; desc: string; tags: readonly string[] };
  index: number;
  deliveriesLabel: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <RevealOnScroll delay={index * 0.08}>
      <div className="border-t border-border last:border-b">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
        >
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-xs text-muted-foreground font-light tabular-nums w-6 shrink-0">{item.numero}</span>
            <span className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light transition-colors duration-300 ${open ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
              {item.title}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 ml-6"
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors duration-300 ${open ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground group-hover:border-foreground/40"}`}>
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
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 block">{deliveriesLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200">
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

        <section className="py-20 md:py-32 lg:py-40">
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

        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto">
            <div className="flex items-end justify-between mb-12 md:mb-16">
              <div>
                <RevealOnScroll>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">{s.whatWeDo}</span>
                </RevealOnScroll>
                <AnimatedText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight" splitBy="words" delay={0.05}>
                  {s.solutions}
                </AnimatedText>
              </div>
              <RevealOnScroll direction="right" delay={0.1}>
                <Link to="/contato" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  {s.requestProposal}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </RevealOnScroll>
            </div>

            <div>
              {s.solutionsList.map((item, i) => (
                <SolucaoItem key={item.title} item={item} index={i} deliveriesLabel={s.deliveries} />
              ))}
            </div>

            <RevealOnScroll direction="up" className="mt-16 md:mt-20 text-center">
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-sm text-foreground px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
              >
                {s.ctaLabel}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Sobre;
