import { useRef, useState } from "react";
import { uploadProjectImage, deleteProjectImage } from "@/lib/projectsApi";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, GripVertical, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  projectId: string;
  images: string[];
  onChange: (images: string[]) => void;
  label: string;
  multiple?: boolean;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

const ImageUploader = ({ projectId, images, onChange, label, multiple = true }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!projectId) {
      toast({
        title: "Defina o ID do projeto primeiro",
        description: "Preencha o campo de identificador antes de enviar arquivos.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const isImg = file.type.startsWith("image/");
        const isVid = file.type.startsWith("video/");
        if (!isImg && !isVid) continue;
        const url = await uploadProjectImage(projectId, file);
        uploaded.push(url);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
      toast({ title: `${uploaded.length} arquivo(s) enviado(s) em qualidade original` });
    } catch (err) {
      toast({
        title: "Erro ao enviar arquivo",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async (url: string) => {
    onChange(images.filter((item) => item !== url));
    try {
      await deleteProjectImage(url);
    } catch {
      // falha silenciosa — não bloqueia o fluxo
    }
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-border aspect-[4/3] bg-secondary/30"
            >
              {isVideo(url) ? (
                <>
                  <video
                    src={url}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-background/60 rounded-full p-2">
                      <Play className="size-4 text-foreground fill-foreground" />
                    </div>
                  </div>
                </>
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}

              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {multiple && index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7"
                    onClick={() => moveItem(index, index - 1)}
                    title="Mover para a esquerda"
                  >
                    <GripVertical className="size-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  onClick={() => handleRemove(url)}
                  title="Remover"
                >
                  <X className="size-3.5" />
                </Button>
              </div>

              {index === 0 && multiple && (
                <span className="absolute top-1.5 left-1.5 text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded">
                  {isVideo(url) ? "Vídeo capa" : "Capa"}
                </span>
              )}
              {isVideo(url) && index > 0 && (
                <span className="absolute top-1.5 right-1.5 text-[10px] bg-foreground/80 text-background px-1.5 py-0.5 rounded">
                  Vídeo
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" />
          )}
          {uploading ? "Enviando..." : "Enviar fotos ou vídeos"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Aceita imagens e vídeos (.mp4, .webm, .mov). A primeira mídia é usada como capa.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
