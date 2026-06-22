import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchProjectById, upsertProject } from "@/lib/projectsApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyForm = {
  id: "",
  title: "",
  category: "",
  description: "",
  fullDescription: "",
  concept: "",
  year: new Date().getFullYear().toString(),
  client: "",
  servicesText: "",
  tagsText: "",
  galleryImages: [] as string[],
  brandHistory: "",
  brandVoiceTone: "",
  brandValuesText: "",
};

const AdminProjectForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [idLocked, setIdLocked] = useState(isEditing);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProjectById(id).then((project) => {
      if (!project) {
        toast({ title: "Projeto não encontrado", variant: "destructive" });
        navigate("/admin");
        return;
      }
      setForm({
        id: project.id,
        title: project.title,
        category: project.category,
        description: project.description,
        fullDescription: project.fullDescription,
        concept: project.concept,
        year: project.year,
        client: project.client ?? "",
        servicesText: project.services.join(", "),
        tagsText: project.tags.join(", "),
        galleryImages: project.images.gallery,
        brandHistory: project.brandStory?.history ?? "",
        brandVoiceTone: project.brandStory?.voiceTone ?? "",
        brandValuesText: project.brandStory?.values?.join(", ") ?? "",
      });
      setLoading(false);
    });
  }, [id, navigate, toast]);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      id: idLocked ? prev.id : slugify(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.id) {
      toast({ title: "Defina um identificador para o projeto", variant: "destructive" });
      return;
    }
    if (form.galleryImages.length === 0) {
      toast({ title: "Envie ao menos uma imagem", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await upsertProject({
        id: form.id,
        title: form.title,
        category: form.category,
        description: form.description,
        fullDescription: form.fullDescription,
        concept: form.concept,
        year: form.year,
        client: form.client || undefined,
        services: form.servicesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        coverImage: form.galleryImages[0],
        galleryImages: form.galleryImages,
        brandHistory: form.brandHistory || undefined,
        brandVoiceTone: form.brandVoiceTone || undefined,
        brandValues: form.brandValuesText
          ? form.brandValuesText.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      });
      toast({ title: isEditing ? "Projeto atualizado" : "Projeto criado" });
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Erro ao salvar projeto",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <h1 className="text-2xl font-light text-foreground mb-8">
          {isEditing ? "Editar projeto" : "Novo projeto"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Título do projeto
            </Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Identificador (URL) — ex: {"kronica.com.br/projetos/"}
              {form.id || "..."}
            </Label>
            <Input
              id="id"
              required
              disabled={isEditing}
              value={form.id}
              onChange={(e) => {
                setIdLocked(true);
                setForm((prev) => ({ ...prev, id: slugify(e.target.value) }));
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Categoria
              </Label>
              <Input
                id="category"
                required
                placeholder="Identidade Visual"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Ano
              </Label>
              <Input
                id="year"
                required
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Cliente (opcional)
            </Label>
            <Input
              id="client"
              value={form.client}
              onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Descrição curta (aparece na listagem)
            </Label>
            <Textarea
              id="description"
              required
              className="min-h-[80px]"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Descrição completa (página do projeto)
            </Label>
            <Textarea
              id="fullDescription"
              required
              className="min-h-[120px]"
              value={form.fullDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Conceito criativo
            </Label>
            <Textarea
              id="concept"
              required
              className="min-h-[120px]"
              value={form.concept}
              onChange={(e) => setForm((prev) => ({ ...prev, concept: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="services" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Serviços (separados por vírgula)
            </Label>
            <Input
              id="services"
              placeholder="Identidade Visual, Design de Logo, Social Media"
              value={form.servicesText}
              onChange={(e) => setForm((prev) => ({ ...prev, servicesText: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tags (separadas por vírgula)
            </Label>
            <Input
              id="tags"
              placeholder="Tecnologia, SaaS, Identidade Visual"
              value={form.tagsText}
              onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
            />
          </div>

          <div className="border-t border-border pt-6 space-y-2">
            <p className="text-sm text-foreground font-medium mb-1">Brand story (opcional)</p>
            <Label htmlFor="brandHistory" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              História da marca
            </Label>
            <Textarea
              id="brandHistory"
              className="min-h-[80px]"
              value={form.brandHistory}
              onChange={(e) => setForm((prev) => ({ ...prev, brandHistory: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandVoiceTone" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tom de voz da marca
            </Label>
            <Textarea
              id="brandVoiceTone"
              className="min-h-[80px]"
              value={form.brandVoiceTone}
              onChange={(e) => setForm((prev) => ({ ...prev, brandVoiceTone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandValues" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Valores da marca (separados por vírgula)
            </Label>
            <Input
              id="brandValues"
              value={form.brandValuesText}
              onChange={(e) => setForm((prev) => ({ ...prev, brandValuesText: e.target.value }))}
            />
          </div>

          <div className="border-t border-border pt-6">
            <ImageUploader
              projectId={form.id}
              images={form.galleryImages}
              onChange={(images) => setForm((prev) => ({ ...prev, galleryImages: images }))}
              label="Galeria de imagens (a primeira é usada como capa)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Salvar alterações" : "Criar projeto"}
            </Button>
            <Link to="/admin">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProjectForm;
