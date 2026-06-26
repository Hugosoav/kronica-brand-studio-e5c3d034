import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { fetchProjects, deleteProject } from "@/lib/projectsApi";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, LogOut, ExternalLink } from "lucide-react";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      toast({
        title: "Erro ao carregar projetos",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Excluir o projeto "${title}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProject(id);
      toast({ title: "Projeto excluído" });
      await loadProjects();
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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-light text-foreground">Painel Kronica</h1>
            <p className="text-sm text-muted-foreground">Gerenciar projetos do portfólio</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/blog" target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="size-4" />
                Ver site
              </Button>
            </Link>
            <Link to="/admin/posts">
              <Button variant="outline" size="sm">
                Blog
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Projetos ({projects.length})
          </h2>
          <Link to="/admin/projetos/novo">
            <Button size="sm">
              <Plus className="size-4" />
              Novo projeto
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
            <p className="mb-4">Nenhum projeto cadastrado ainda.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/admin/migrar">
                <Button size="sm" variant="outline">
                  Migrar projetos existentes do site
                </Button>
              </Link>
              <Link to="/admin/projetos/novo">
                <Button size="sm">
                  <Plus className="size-4" />
                  Criar projeto novo
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-border rounded-lg overflow-hidden bg-secondary/20"
              >
                <div className="aspect-[4/3] bg-secondary/40 overflow-hidden">
                  <img
                    src={project.images.cover}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground text-sm">{project.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {project.category} · {project.year}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/admin/projetos/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="size-3.5" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.title)}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
