import { useState } from "react";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

// Seção "Nossas soluções", usada na home e na página Sobre (mesmo conteúdo nas duas)
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

// withTopBorder: linha acima da seção (mantida no Sobre, removida na home)
const SolucoesSection = ({ withTopBorder = true }: { withTopBorder?: boolean }) => {
  const { t } = useLocale();
  const s = t.sobre;

  return (
    <section className={`py-16 md:py-24 ${withTopBorder ? "border-t border-border" : ""}`}>
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
            className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-base text-foreground px-10 py-4 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
          >
            {s.ctaLabel}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default SolucoesSection;
