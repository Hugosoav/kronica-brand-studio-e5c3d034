import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { fetchProjects, deleteProject, saveProjectOrder } from "@/lib/projectsApi";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, LogOut, ExternalLink, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Quantos projetos aparecem na home (ProjectShowcase mostra os 4 primeiros)
const HOME_COUNT = 4;

// Card arrastável: só a alça (ícone de pontinhos) inicia o arraste,
// para não atrapalhar os botões Editar e Excluir
const SortableCard = ({
  project,
  position,
  children,
}: {
  project: Project;
  position: number;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative border rounded-lg overflow-hidden bg-secondary/20 ${
        isDragging ? "border-foreground z-10 shadow-2xl opacity-90" : "border-border"
      }`}
    >
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-[1] pointer-events-none">
        <span className="pointer-events-auto text-xs px-2 py-1 rounded bg-background/80 backdrop-blur text-foreground tabular-nums">
          {position}
          {position <= HOME_COUNT && <span className="text-muted-foreground"> · na home</span>}
        </span>
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={`Arrastar ${project.title}`}
          className="pointer-events-auto p-1.5 rounded bg-background/80 backdrop-blur text-foreground cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </div>
      {children}
    </div>
  );
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Ordem salva (para descartar) e se há mudança pendente
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const orderChanged = projects.map((p) => p.id).join("|") !== savedOrder.join("|");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProjects((items) => {
      const from = items.findIndex((p) => p.id === active.id);
      const to = items.findIndex((p) => p.id === over.id);
      return arrayMove(items, from, to);
    });
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const ids = projects.map((p) => p.id);
      await saveProjectOrder(ids);
      setSavedOrder(ids);
      toast({ title: "Ordem salva", description: "O portfólio do site já segue a nova ordem." });
    } catch (err) {
      toast({
        title: "Erro ao salvar a ordem",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDiscardOrder = () => {
    setProjects((items) => savedOrder.map((id) => items.find((p) => p.id === id)!).filter(Boolean));
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      setSavedOrder(data.map((p) => p.id));
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
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Projetos ({projects.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Arraste pelo ícone <GripVertical className="inline size-3.5 -mt-0.5" /> para mudar a ordem. Os {HOME_COUNT} primeiros aparecem na home.
            </p>
          </div>
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
          <>
          {orderChanged && (
            <div className="sticky top-4 z-20 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-foreground/30 bg-background/95 backdrop-blur px-4 py-3">
              <p className="text-sm text-foreground">A ordem foi alterada e ainda não foi salva.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDiscardOrder} disabled={savingOrder}>
                  Descartar
                </Button>
                <Button size="sm" onClick={handleSaveOrder} disabled={savingOrder}>
                  {savingOrder && <Loader2 className="size-3.5 animate-spin" />}
                  Salvar ordem
                </Button>
              </div>
            </div>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, index) => (
              <SortableCard key={project.id} project={project} position={index + 1}>
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
              </SortableCard>
            ))}
          </div>
          </SortableContext>
          </DndContext>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
