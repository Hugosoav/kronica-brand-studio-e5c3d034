import { supabase } from "@/lib/supabase";

export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: PostStatus;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
}

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: PostStatus;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

export interface PostInput {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  tags: string[];
}

function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    status: row.status,
    tags: row.tags ?? [],
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

/** Lista pública: só posts publicados, mais recentes primeiro */
export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as PostRow[]).map(rowToPost);
}

export async function fetchPublishedPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToPost(data as PostRow);
}

/** Painel admin: todos os posts, incluindo rascunhos */
export async function fetchAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PostRow[]).map(rowToPost);
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToPost(data as PostRow);
}

export async function upsertPost(input: PostInput) {
  const { error } = await supabase.from("posts").upsert({
    id: input.id,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.coverImage ?? null,
    status: input.status,
    tags: input.tags,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });

  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPostImage(postId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = `${crypto.randomUUID()}.${extension}`;
  const path = `${postId}/${safeName}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}
