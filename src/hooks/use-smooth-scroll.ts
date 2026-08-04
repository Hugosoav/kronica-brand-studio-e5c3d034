import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * Inicializa o Lenis (smooth scroll com inércia) na montagem do componente
 * e destrói ao desmontar. Deve ser usado uma única vez no topo da árvore (App).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => 1 - Math.pow(1 - t, 2.5), // ease out quad suave — responsivo mas sem travamento
      smoothWheel: true,
      wheelMultiplier: 1.0,
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
