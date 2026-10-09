import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/hooks/use-locale";
import { getConsent, onConsentChange, setConsent } from "@/lib/meta-pixel";

// Aviso de cookies: aparece até o visitante aceitar ou recusar.
// Os dois botões têm o mesmo peso visual (recusar é tão fácil quanto aceitar).
const CookieConsent = () => {
  const { t } = useLocale();
  const c = t.cookies;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
    return onConsentChange((value) => setVisible(value === null));
  }, []);

  const buttonClass =
    "flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-foreground/30 text-sm text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={c.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60] rounded-lg border border-border bg-background/95 backdrop-blur-md p-5 md:p-6 shadow-2xl"
        >
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {c.text}{" "}
            <Link to="/privacidade" className="underline underline-offset-4 text-foreground hover:opacity-70 transition-opacity">
              {c.policy}
            </Link>
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setConsent("denied")} className={buttonClass}>
              {c.reject}
            </button>
            <button type="button" onClick={() => setConsent("granted")} className={buttonClass}>
              {c.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
