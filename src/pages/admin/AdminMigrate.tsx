import { useState } from "react";
import { Link } from "react-router-dom";
import { projects as staticProjects } from "@/data/projects";
import { uploadProjectImage, upsertProject } from "@/lib/projectsApi";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

const AdminMigrate = () => {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (line: string) => setLog((prev) => [...prev, line]);

  const handleMigrate = async () => {
    setRunning(true);
    setLog([]);
    try {
      for (const [index, project] of staticProjects.entries()) {
        appendLog(`Migrando "${project.title}"...`);

        const galleryUrls: string[] = [];
        for (let i = 0; i < project.images.gallery.length; i++) {
          const assetUrl = project.images.gallery[i];
          const file = await urlToFile(assetUrl, `${project.id}-${i}.jpg`);
          const uploadedUrl = await uploadProjectImage(project.id, file);
          galleryUrls.push(uploadedUrl);
          appendLog(`  imagem ${i + 1}/${project.images.gallery.length} enviada`);
        }

        await upsertProject({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          fullDescription: project.fullDescription,
          concept: project.concept,
          year: project.year,
          client: project.client,
          services: project.services,
          tags: project.tags,
          coverImage: galleryUrls[0],
          galleryImages: galleryUrls,
          brandHistory: project.brandStory?.history,
          brandVoiceTone: project.brandStory?.voiceTone,
          brandValues: project.brandStory?.values,
          sortOrder: index,
        });

        appendLog(`✓ "${project.title}" migrado`);
      }

      setDone(true);
      toast({ title: "Migração concluída com sucesso" });
    } catch (err) {
      toast({
        title: "Erro durante a migração",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
      appendLog(`Erro: ${err instanceof Error ? err.message : "desconhecido"}`);
    } finally {
      setRunning(false);
    }
  };

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

        <h1 className="text-2xl font-light text-foreground mb-3">Migração inicial</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Essa página sobe os {staticProjects.length} projetos que já existem no site para o banco de
          dados, na qualidade em que estão hoje no repositório. Rode isso apenas uma vez.
        </p>

        <Button onClick={handleMigrate} disabled={running || done}>
          {running && <Loader2 className="size-4 animate-spin" />}
          {done && <CheckCircle2 className="size-4" />}
          {done ? "Migração concluída" : running ? "Migrando..." : "Rodar migração"}
        </Button>

        {log.length > 0 && (
          <div className="mt-8 bg-secondary/30 rounded-lg p-4 text-xs font-mono text-muted-foreground space-y-1 max-h-96 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {done && (
          <div className="mt-6">
            <Link to="/admin">
              <Button variant="outline">Ir para o painel</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMigrate;
