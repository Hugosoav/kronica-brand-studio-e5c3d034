import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * Inicializa o Lenis (smooth scroll com inércia) na montagem do componente
 * e destrói ao desmontar. Deve ser usado uma única vez no topo da árvore (App).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -8 * t), // ease out expo suave, sem corte abrupto
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
