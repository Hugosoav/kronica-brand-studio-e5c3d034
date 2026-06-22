import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import RevealOnScroll from "@/components/RevealOnScroll";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RevealOnScroll>
            <h1 className="mb-4 text-4xl font-bold">404</h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p className="mb-6 text-xl text-muted-foreground">Oops! Página não encontrada</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <a href="/" className="text-primary underline hover:text-primary/90">
              Voltar para Home
            </a>
          </RevealOnScroll>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
