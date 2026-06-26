import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface Suggestion {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const AdminPostSuggestions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/suggest-topics", { method: "POST" });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Erro ao gerar sugestões");
      }
      setSuggestions(data.suggestions || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Tente novamente.";
      setError(message);
      toast({ title: "Erro ao gerar sugestões", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion: Suggestion) => {
    navigate("/admin/posts/novo", {
      state: {
        id: slugify(suggestion.title),
        title: suggestion.title,
        slug: slugify(suggestion.title),
        excerpt: suggestion.excerpt,
        content: suggestion.content,
        tagsText: suggestion.tags.join(", "),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <h1 className="text-2xl font-light text-foreground mb-3">Sugestão de pauta com IA</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-xl">
          Busca tendências e notícias atuais sobre branding e design, e gera rascunhos prontos pra
          você revisar, dar sua voz e publicar. Nada é publicado automaticamente.
        </p>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "Buscando tendências..." : "Gerar sugestões"}
        </Button>

        {error && <p className="text-sm text-destructive mt-4">{error}</p>}

        {suggestions.length > 0 && (
          <div className="mt-10 space-y-4">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="border border-border rounded-lg p-5 bg-secondary/20">
                <h3 className="text-base font-medium text-foreground mb-2">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.excerpt}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {suggestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-secondary/60 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => handleUseSuggestion(suggestion)}>
                  Usar esse rascunho
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostSuggestions;
