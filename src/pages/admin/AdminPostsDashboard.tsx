import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllPosts, deletePost } from "@/lib/postsApi";
import type { Post } from "@/lib/postsApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Sparkles } from "lucide-react";

const AdminPostsDashboard = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      setPosts(await fetchAllPosts());
    } catch (err) {
      toast({
        title: "Erro ao carregar posts",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Excluir o post "${title}"? Essa ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      await deletePost(id);
      toast({ title: "Post excluído" });
      await loadPosts();
    } catch (err) {
      toast({
        title: "Erro ao excluir",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Voltar ao painel
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-light text-foreground">Blog</h1>
            <p className="text-sm text-muted-foreground">Gerenciar artigos publicados e rascunhos</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/posts/sugestao">
              <Button variant="outline" size="sm">
                <Sparkles className="size-4" />
                Sugestão de pauta
              </Button>
            </Link>
            <Link to="/admin/posts/novo">
              <Button size="sm">
                <Plus className="size-4" />
                Novo artigo
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
            <p className="mb-4">Nenhum artigo cadastrado ainda.</p>
            <Link to="/admin/posts/novo">
              <Button size="sm">
                <Plus className="size-4" />
                Criar primeiro artigo
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between border border-border rounded-lg p-4 bg-secondary/20"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded shrink-0 ${
                      post.status === "published"
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                  <span className="text-sm text-foreground truncate">{post.title}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to={`/admin/posts/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="size-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostsDashboard;
