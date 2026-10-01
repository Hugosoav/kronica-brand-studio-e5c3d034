import { useState } from "react";
import Layout from "@/components/Layout";
import InfiniteHero from "@/components/ui/infinite-hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLocale } from "@/hooks/use-locale";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = { numero: string; name: string; subtitle: string; desc: string };

const MetodoStep = ({ step, index }: { step: Step; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <RevealOnScroll direction="up" delay={index * 0.07}>
      <div className="border-t border-border/30 last:border-b last:border-border/30">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between py-7 md:py-9 text-left group"
        >
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-xs text-muted-foreground/50 font-mono w-5 shrink-0">{step.numero}</span>
            <div>
              <p className="text-xl md:text-3xl font-light text-foreground/70 group-hover:text-foreground transition-colors duration-300">{step.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mt-0.5">{step.subtitle}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pl-11 md:pl-[3.75rem] pb-8 md:pb-10">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{step.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealOnScroll>
  );
};

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

        {/* Seção Metodologia */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto">
            <RevealOnScroll direction="up">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">{m.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-16 md:mb-20">{m.title}</h2>
            </RevealOnScroll>

            <div>
              {m.steps.map((step, i) => (
                <MetodoStep key={step.numero} step={step} index={i} />
              ))}
            </div>

            <RevealOnScroll direction="up" className="mt-16 md:mt-20 text-center">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-base text-foreground px-10 py-4 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
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
