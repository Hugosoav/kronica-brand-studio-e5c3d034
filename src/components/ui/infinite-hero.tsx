"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import ShaderHeroBackground from "./shader-hero-background";

interface InfiniteHeroProps {
  title?: string;
  subtitle?: string;
}

export default function InfiniteHero({
  title = "MARCAS NO TEMPO",
  subtitle = "Kronica Studio"
}: InfiniteHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useGSAP(
    () => {
      gsap.set(h1Ref.current, {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
        scale: 0.95
      });
      gsap.set(pRef.current, {
        opacity: 0,
        y: 16,
        filter: "blur(6px)"
      });

      const ctas = ctaRef.current ? Array.from(ctaRef.current.children) : [];
      if (ctas.length) gsap.set(ctas, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(
        h1Ref.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.2,
          ease: "power4.out"
        },
        0.3
      ).
      to(
        pRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6
        },
        "-=0.5"
      ).
      to(ctas, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.2");

      // Continuous shimmer animation on title
      gsap.to(h1Ref.current, {
        backgroundPosition: "200% center",
        duration: 3,
        ease: "none",
        repeat: -1,
        delay: 1.5
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden">

      {/* Video background */}
      <ShaderHeroBackground />

      <div className="relative z-10 w-full px-7 md:px-9 text-center">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <h1
            ref={h1Ref}
            className="tracking-[-0.02em] text-[clamp(2.2rem,12vw,8rem)] py-2 font-light"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              backgroundImage: isDark ?
              "linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 50%, #ffffff 65%, #ffffff 100%)" :
              "linear-gradient(90deg, #111111 0%, #111111 35%, #999999 50%, #111111 65%, #111111 100%)",
              backgroundSize: "200% auto",
              backgroundPosition: "0% center",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.15
            }}>

            {title.includes(" ") ? (
              <>
                {title.split(" ")[0]}<br />{title.split(" ").slice(1).join(" ")}
              </>
            ) : title}
          </h1>

          <p
            ref={pRef}
            className={`max-w-2xl text-sm sm:text-base md:text-lg px-2 font-light tracking-wide ${isDark ? "text-white/60" : "text-black/50"}`}>

            {subtitle}
          </p>

          <div ref={ctaRef} className="mt-2 sm:mt-4 flex flex-col items-center gap-6 w-full max-w-3xl">
            {/* CTA Button */}
            <button
              onClick={() => navigate("/contato")}
              className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md rounded-full cursor-pointer transition-colors flex-wrap justify-center text-sm sm:text-base font-medium tracking-wide ${
              isDark ?
              "bg-white/10 hover:bg-white/20 border border-white/10 text-white" :
              "bg-black/10 hover:bg-black/15 border border-black/10 text-black"}`
              }>

              SOLICITE UMA PROPOSTA
            </button>
          </div>
        </div>
      </div>
    </div>);

}