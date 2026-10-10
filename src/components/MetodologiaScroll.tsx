import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale } from "@/hooks/use-locale";

type Step = { numero: string; name: string; subtitle: string; desc: string };

const EASE = [0.16, 1, 0.3, 1] as const;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Acompanha uma media query (ex.: tamanho da tela) e atualiza ao redimensionar. */
const useMedia = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

const pad = (n: string | number) => String(n).padStart(2, "0");

/*
 * Medidas da linha do tempo:
 * --label: altura da linha "01 · Subtítulo"
 * --title: altura da linha do nome da etapa
 * O ponto e a linha ficam centralizados no nome da etapa.
 */
const ROW_VARS = "[--label:1.25rem] [--title:2rem] md:[--title:2.75rem]";
const DOT_CENTER = "calc(var(--label) + var(--title) / 2)";

interface StepRowProps {
  step: Step;
  index: number;
  isLast: boolean;
  lit: boolean;
  showDesc: boolean;
  progress: MotionValue<number>;
  range: [number, number] | null;
}

const StepRow = ({ step, index, isLast, lit, showDesc, progress, range }: StepRowProps) => {
  // Preenchimento do trecho de linha entre esta etapa e a próxima, guiado pela rolagem
  const fill = useTransform(progress, range ?? [0, 1], [0, 1]);

  return (
    <div className={`relative pl-9 md:pl-12 ${isLast ? "" : "pb-4 md:pb-7"} ${ROW_VARS}`}>
      {!isLast && (
        <div
          aria-hidden
          className="absolute left-[5px] w-px bg-foreground/15"
          style={{ top: DOT_CENTER, bottom: `calc(-1 * ${DOT_CENTER})` }}
        >
          {range && (
            <motion.div
              className="absolute inset-0 origin-top bg-foreground"
              style={{ scaleY: fill }}
            />
          )}
        </div>
      )}

      <motion.span
        aria-hidden
        className="absolute left-0 h-[11px] w-[11px] -translate-y-1/2 rounded-full border"
        style={{ top: DOT_CENTER }}
        initial={false}
        animate={{
          backgroundColor: lit ? "hsl(var(--foreground))" : "hsl(var(--background))",
          borderColor: lit ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.3)",
          scale: lit ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <div className="flex h-[var(--label)] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px]">
        <span className={`transition-colors duration-500 ${lit ? "text-foreground" : "text-muted-foreground/40"}`}>
          {pad(step.numero)}
        </span>
        <span className={`transition-colors duration-500 ${lit ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
          {step.subtitle}
        </span>
      </div>

      <p
        className={`flex h-[var(--title)] items-center text-2xl font-light leading-none transition-colors duration-500 md:text-4xl ${
          lit ? "text-foreground" : "text-foreground/25"
        }`}
      >
        {step.name}
      </p>

      <AnimatePresence initial={false}>
        {showDesc && (
          <motion.div
            key="desc"
            initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
            animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
            exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/* Linha do tempo horizontal (desktop): o ponto fica no topo de cada coluna e a linha corre para a direita. */
const H_GAP = "2.5rem";

interface HStepProps {
  step: Step;
  isLast: boolean;
  lit: boolean;
  current: boolean;
  progress: MotionValue<number>;
  range: [number, number] | null;
}

const HStep = ({ step, isLast, lit, current, progress, range }: HStepProps) => {
  const fill = useTransform(progress, range ?? [0, 1], [0, 1]);

  return (
    <div className="relative pt-10">
      {!isLast && (
        <div
          aria-hidden
          className="absolute left-[5px] top-[5px] h-px bg-foreground/15"
          style={{ width: `calc(100% + ${H_GAP})` }}
        >
          {range && (
            <motion.div className="absolute inset-0 origin-left bg-foreground" style={{ scaleX: fill }} />
          )}
        </div>
      )}

      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-[11px] w-[11px] rounded-full border"
        initial={false}
        animate={{
          backgroundColor: lit ? "hsl(var(--foreground))" : "hsl(var(--background))",
          borderColor: lit ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.3)",
          scale: current ? 1.25 : lit ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <motion.div
        initial={false}
        animate={{ y: lit ? 0 : 12 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className={`transition-colors duration-500 ${lit ? "text-foreground" : "text-muted-foreground/40"}`}>
            {pad(step.numero)}
          </span>
        </div>
        <p
          className={`text-2xl font-light leading-tight transition-colors duration-500 xl:text-3xl ${
            lit ? "text-foreground" : "text-foreground/25"
          }`}
        >
          {step.name}
        </p>
        <p
          className={`mt-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
            lit ? "text-muted-foreground" : "text-muted-foreground/30"
          }`}
        >
          {step.subtitle}
        </p>

        {/* Descrição sempre ocupa o espaço, para nada pular quando acende */}
        <motion.p
          initial={false}
          animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 8, filter: lit ? "blur(0px)" : "blur(4px)" }}
          transition={{ duration: 0.5, ease: EASE, delay: lit ? 0.1 : 0 }}
          className="mt-5 text-sm leading-relaxed text-muted-foreground"
        >
          {step.desc}
        </motion.p>
      </motion.div>
    </div>
  );
};

const Counter = ({ active, n }: { active: number; n: number }) => (
  <div className="flex items-baseline gap-3 font-light" aria-hidden>
    <span
      className={`relative inline-block h-[1em] overflow-hidden text-6xl leading-none tabular-nums transition-opacity duration-500 lg:text-7xl ${
        active < 0 ? "opacity-25" : ""
      }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={active}
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {pad(Math.max(active + 1, 1))}
        </motion.span>
      </AnimatePresence>
    </span>
    <span className="font-mono text-sm text-muted-foreground">/ {pad(n)}</span>
  </div>
);

const Header = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <>
    <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</span>
    <h2 className="overflow-hidden text-3xl font-light text-foreground md:text-4xl lg:text-5xl">
      <motion.span
        className="block"
        initial={prefersReducedMotion ? false : { y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: EASE }}
      >
        {title}
      </motion.span>
    </h2>
  </>
);

/** Versão estática para quem prefere menos movimento: todas as etapas acesas, sem fixar a seção. */
const StaticTimeline = ({ steps, eyebrow, title }: { steps: readonly Step[]; eyebrow: string; title: string }) => {
  const progress = useScroll().scrollYProgress;
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Header eyebrow={eyebrow} title={title} />
        </div>
        <div className="md:col-span-7">
          {steps.map((step, i) => (
            <StepRow
              key={step.numero}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
              lit
              showDesc
              progress={progress}
              range={null}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const MetodologiaScroll = () => {
  const { t } = useLocale();
  const m = t.metodo;
  const steps: readonly Step[] = m.steps;
  const n = steps.length;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Ponto da rolagem (0 a 1, enquanto a seção está fixa) em que cada etapa acende
  const thresholds = steps.map((_, i) => 0.06 + i * (0.82 / Math.max(1, n - 1)));

  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let a = -1;
    thresholds.forEach((th, i) => {
      if (p >= th) a = i;
    });
    setActive((prev) => (prev === a ? prev : a));
  });

  // Celular e tablet: linha do tempo vertical. Notebook e desktop (1024px+): horizontal.
  const wide = useMedia("(min-width: 1024px)");
  const roomy = useMedia("(min-width: 768px) and (min-height: 880px)");

  if (prefersReducedMotion) {
    return <StaticTimeline steps={steps} eyebrow={m.eyebrow} title={m.title} />;
  }

  const ranges = steps.map((_, i) =>
    i < n - 1 ? ([thresholds[i], thresholds[i + 1]] as [number, number]) : null,
  );

  if (wide) {
    return (
      <section ref={ref} className="relative" style={{ height: `${100 + n * 55}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center pt-20">
          <div className="container mx-auto w-full">
            <div className="mb-16 flex items-end justify-between gap-10 xl:mb-20">
              <div>
                <Header eyebrow={m.eyebrow} title={m.title} />
              </div>
              <Counter active={active} n={n} />
            </div>

            <div className="grid grid-cols-5" style={{ columnGap: H_GAP }}>
              {steps.map((step, i) => (
                <HStep
                  key={step.numero}
                  step={step}
                  isLast={i === n - 1}
                  lit={i <= active}
                  current={i === active}
                  progress={scrollYProgress}
                  range={ranges[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${100 + n * 55}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-start pt-[max(5.5rem,12svh)] md:pt-[max(7rem,14svh)]">
        <div className="container mx-auto grid w-full grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:flex md:flex-col md:justify-between md:pb-2">
            <div>
              <Header eyebrow={m.eyebrow} title={m.title} />
            </div>

            {/* Contador da etapa atual (tablet) */}
            <div className="hidden md:block">
              <Counter active={active} n={n} />
            </div>
          </div>

          <div className="md:col-span-7">
            {steps.map((step, i) => (
              <StepRow
                key={step.numero}
                step={step}
                index={i}
                isLast={i === n - 1}
                lit={i <= active}
                showDesc={i === active || (roomy && i < active)}
                progress={scrollYProgress}
                range={ranges[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetodologiaScroll;
