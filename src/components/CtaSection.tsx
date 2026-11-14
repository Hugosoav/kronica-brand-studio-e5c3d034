import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedText from "@/components/AnimatedText";
import { useLocale } from "@/hooks/use-locale";

// Chamada final "Vamos conversar sobre sua marca?" (Home, Sobre e Projetos)
const CtaSection = () => {
  const { t } = useLocale();
  const h = t.home;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto text-center max-w-3xl">
        <AnimatedText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6" splitBy="words">
          {h.ctaTitle}
        </AnimatedText>
        <RevealOnScroll delay={0.15}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-10">{h.ctaText}</p>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={0.25}>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 border border-foreground/30 hover:border-foreground text-base text-foreground px-10 py-4 rounded-full transition-all duration-300 hover:bg-foreground hover:text-background group"
          >
            {t.cta}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default CtaSection;
