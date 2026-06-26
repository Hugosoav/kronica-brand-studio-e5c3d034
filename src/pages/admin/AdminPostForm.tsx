import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { fetchPostById, upsertPost, uploadPostImage } from "@/lib/postsApi";
import type { PostStatus } from "@/lib/postsApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface FormState {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagsText: string;
}

const emptyForm: FormState = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tagsText: "",
};

const AdminPostForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Permite pré-preencher o formulário a partir da página de sugestão de pauta
  useEffect(() => {
    const draft = location.state as Partial<FormState> | null;
    if (draft && !isEditing) {
      setForm((prev) => ({ ...prev, ...draft }));
    }
  }, [location.state, isEditing]);

  useEffect(() => {
    if (!id) return;
    fetchPostById(id).then((post) => {
      if (!post) {
        toast({ title: "Artigo não encontrado", variant: "destructive" });
        navigate("/admin/posts");
        return;
      }
      setForm({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage ?? "",
        tagsText: post.tags.join(", "),
      });
      setLoading(false);
    });
  }, [id, navigate, toast]);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugLocked ? prev.slug : slugify(value),
      id: prev.id || slugify(value),
    }));
  };

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    const postId = form.id || slugify(form.title) || crypto.randomUUID();
    setForm((prev) => ({ ...prev, id: prev.id || postId }));
    setUploadingCover(true);
    try {
      const url = await uploadPostImage(postId, file);
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      toast({
        title: "Erro ao enviar imagem",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async (status: PostStatus) => {
    if (!form.id || !form.title || !form.slug || !form.excerpt || !form.content) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(status);
    try {
      await upsertPost({
        id: form.id,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || null,
        status,
        tags: form.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      });
      toast({ title: status === "published" ? "Artigo publicado" : "Rascunho salvo" });
      navigate("/admin/posts");
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
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
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <h1 className="text-2xl font-light text-foreground mb-8">
          {isEditing ? "Editar artigo" : "Novo artigo"}
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Título
            </Label>
            <Input id="title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              URL — kronica.com.br/newsletter/{form.slug || "..."}
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugLocked(true);
                setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Resumo (aparece na listagem)
            </Label>
            <Textarea
              id="excerpt"
              className="min-h-[80px]"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Imagem de capa</Label>
            {form.coverImage ? (
              <div className="relative rounded-lg overflow-hidden border border-border aspect-[16/9] max-w-sm">
                <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 size-7"
                  onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload"
                  className="hidden"
                  onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingCover}
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  {uploadingCover ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  Enviar imagem
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Conteúdo (markdown — # título, **negrito**, - listas)
            </Label>
            <Textarea
              id="content"
              className="min-h-[400px] font-mono text-sm"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Tags (separadas por vírgula)
            </Label>
            <Input
              id="tags"
              placeholder="Branding, Tendências, Design"
              value={form.tagsText}
              onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => handleSave("published")} disabled={saving !== null}>
              {saving === "published" && <Loader2 className="size-4 animate-spin" />}
              Publicar
            </Button>
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving !== null}>
              {saving === "draft" && <Loader2 className="size-4 animate-spin" />}
              Salvar rascunho
            </Button>
            <Link to="/admin/posts">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPostForm;
