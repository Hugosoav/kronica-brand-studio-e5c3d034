import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import Index from "./pages/Index";

// Páginas carregadas sob demanda (code splitting), pra não pesar o
// carregamento inicial do site com código que só é usado em rotas
// específicas (admin, newsletter, páginas internas).
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const Projetos = lazy(() => import("./pages/Projetos"));
const ProjetoDetalhe = lazy(() => import("./pages/ProjetoDetalhe"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const NewsletterPost = lazy(() => import("./pages/NewsletterPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjectForm = lazy(() => import("./pages/admin/AdminProjectForm"));
const AdminMigrate = lazy(() => import("./pages/admin/AdminMigrate"));
const AdminPostsDashboard = lazy(() => import("./pages/admin/AdminPostsDashboard"));
const AdminPostForm = lazy(() => import("./pages/admin/AdminPostForm"));
const AdminPostSuggestions = lazy(() => import("./pages/admin/AdminPostSuggestions"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-muted-foreground" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/projetos/:id" element={<ProjetoDetalhe />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/newsletter/:slug" element={<NewsletterPost />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/projetos/novo"
            element={
              <RequireAuth>
                <AdminProjectForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/projetos/:id"
            element={
              <RequireAuth>
                <AdminProjectForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/migrar"
            element={
              <RequireAuth>
                <AdminMigrate />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <RequireAuth>
                <AdminPostsDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/posts/sugestao"
            element={
              <RequireAuth>
                <AdminPostSuggestions />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/posts/novo"
            element={
              <RequireAuth>
                <AdminPostForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/posts/:id"
            element={
              <RequireAuth>
                <AdminPostForm />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
