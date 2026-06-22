import { supabase } from "@/lib/supabase";
import type { Project } from "@/data/projects";

interface ProjectRow {
  id: string;
  title: string;
  category: string;
  description: string;
  full_description: string;
  concept: string;
  year: string;
  client: string | null;
  services: string[];
  tags: string[];
  cover_image: string;
  gallery_images: string[];
  brand_history: string | null;
  brand_voice_tone: string | null;
  brand_values: string[] | null;
  sort_order: number;
}

export type ProjectInput = {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  concept: string;
  year: string;
  client?: string;
  services: string[];
  tags: string[];
  coverImage: string;
  galleryImages: string[];
  brandHistory?: string;
  brandVoiceTone?: string;
  brandValues?: string[];
  sortOrder?: number;
};

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    fullDescription: row.full_description,
    concept: row.concept,
    year: row.year,
    client: row.client ?? undefined,
    services: row.services ?? [],
    tags: row.tags ?? [],
    images: {
      cover: row.cover_image,
      gallery: row.gallery_images ?? [],
    },
    brandStory:
      row.brand_history || row.brand_voice_tone
        ? {
            history: row.brand_history ?? "",
            voiceTone: row.brand_voice_tone ?? "",
            values: row.brand_values ?? undefined,
          }
        : undefined,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProjectRow[]).map(rowToProject);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToProject(data as ProjectRow);
}

export async function upsertProject(input: ProjectInput) {
  const { error } = await supabase.from("projects").upsert({
    id: input.id,
    title: input.title,
    category: input.category,
    description: input.description,
    full_description: input.fullDescription,
    concept: input.concept,
    year: input.year,
    client: input.client ?? null,
    services: input.services,
    tags: input.tags,
    cover_image: input.coverImage,
    gallery_images: input.galleryImages,
    brand_history: input.brandHistory ?? null,
    brand_voice_tone: input.brandVoiceTone ?? null,
    brand_values: input.brandValues ?? null,
    sort_order: input.sortOrder ?? 0,
  });

  if (error) throw error;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Faz upload de uma imagem em qualidade original (sem nenhuma compressão
 * ou redimensionamento) para o bucket "project-images" do Supabase Storage.
 * Retorna a URL pública da imagem.
 */
export async function uploadProjectImage(
  projectId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = `${crypto.randomUUID()}.${extension}`;
  const path = `${projectId}/${safeName}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProjectImage(publicUrl: string) {
  // Extrai o caminho do arquivo a partir da URL pública
  const marker = "/object/public/project-images/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.substring(idx + marker.length);

  const { error } = await supabase.storage
    .from("project-images")
    .remove([path]);

  if (error) throw error;
}
