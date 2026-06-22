import { useTheme } from "@/hooks/use-theme";
import RevealOnScroll from "@/components/RevealOnScroll";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          {/* Left - CTA + Contact */}
          <div>
            <RevealOnScroll>
              <span className="text-xs uppercase tracking-[0.3em] text-background/50 mb-6 block">
                Entre em contato
              </span>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-12">
                Vamos criar algo<br />extraordinário
              </h2>
            </RevealOnScroll>

            <div className="space-y-8">
              <RevealOnScroll delay={0.2}>
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-background/50 mb-2 block">
                    Email
                  </span>
                  <a href="mailto:kronicastudio@gmail.com" className="text-base md:text-lg hover:opacity-70 transition-opacity">

                    kronicastudio@gmail.com
                  </a>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.3}>
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-background/50 mb-2 block">
                    WhatsApp
                  </span>
                  <a href="https://wa.me/5528999161275" target="_blank" rel="noopener noreferrer"
                  className="text-base md:text-lg hover:opacity-70 transition-opacity">

                    +55 (28) 99916-1275
                  </a>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Right - Social + Tagline */}
          <div className="flex flex-col justify-between">
            <div>
              <RevealOnScroll direction="right">
                <span className="text-xs uppercase tracking-[0.3em] text-background/50 mb-6 block">
                  Siga-nos
                </span>
              </RevealOnScroll>
              <ul className="space-y-3">
                <RevealOnScroll delay={0.1} direction="right">
                  <li>
                    <a
                      href="https://instagram.com/kronicastudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base md:text-lg hover:opacity-70 transition-opacity">

                      Instagram
                    </a>
                  </li>
                </RevealOnScroll>
                <RevealOnScroll delay={0.2} direction="right">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/kronica-studio-4553ab3a4/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base md:text-lg hover:opacity-70 transition-opacity">

                      LinkedIn
                    </a>
                  </li>
                </RevealOnScroll>
              </ul>
            </div>

            <RevealOnScroll delay={0.4} direction="up">
              <div className="mt-12 md:mt-0">
                <div className="border-t border-background/10 pt-6">
                  <p className="text-sm text-background/50 max-w-md">Estúdio de Branding e design estratégico. Nosso processo começa pela escuta, compreendendo sua visão e traduzindo em história.

                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Copyright */}
        <RevealOnScroll delay={0.5}>
          <div className="mt-16 pt-6 border-t border-background/10">
            <p className="text-xs text-background/40">
              © {new Date().getFullYear()} Kronica Studio. Todos os direitos reservados.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </footer>);

};

export default Footer;