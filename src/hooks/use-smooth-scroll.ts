import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * Inicializa o Lenis (smooth scroll com inércia) na montagem do componente
 * e destrói ao desmontar. Deve ser usado uma única vez no topo da árvore (App).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,       // duração da inércia em segundos
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease out expo
      smoothWheel: true,
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
