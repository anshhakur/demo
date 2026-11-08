"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ImagePlus, Trash2, Video, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const MEDIA_BUCKET = "media";
const MAX_VIDEO_MB = 50;

interface AdminDashboardProps {
  initialProducts: Product[];
  configured: boolean;
  setupError: string | null;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface PickedImage {
  id: string;
  file: File;
  preview: string;
}

const emptyForm = {
  name: "",
  price: "",
  category: "shirts",
  collection: "",
  colour: "",
  description: "",
  details: "",
  fabric: "",
  sizes: "S, M, L, XL",
  isNew: true,
  isBestseller: false,
};

const fieldClass = "mt-2 h-12 w-full border border-beige bg-white px-4 text-base";
const labelClass = "block text-sm font-medium";

/** Shrinks big phone photos before upload so they send quickly on mobile data. */
async function prepareImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function AdminDashboard({
  initialProducts,
  configured,
  setupError,
  supabaseUrl,
  supabaseAnonKey,
}: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const update = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const pickImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setImages((current) =>
      [
        ...current,
        ...files.map((file) => ({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          preview: URL.createObjectURL(file),
        })),
      ].slice(0, 8),
    );
    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((image) => image.id !== id);
    });
  };

  const pickVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`That video is larger than ${MAX_VIDEO_MB} MB. Shorten or compress it, then try again.`);
      return;
    }
    setError(null);
    setVideo(file);
  };

  const uploadFile = async (file: File, supabase: SupabaseClient): Promise<string> => {
    const response = await fetch("/api/admin/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      path?: string;
      token?: string;
      publicUrl?: string;
      error?: string;
    };
    if (!response.ok || !data.path || !data.token || !data.publicUrl) {
      throw new Error(data.error ?? "Could not start the upload.");
    }
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .uploadToSignedUrl(data.path, data.token, file, { contentType: file.type });
    if (uploadError) throw new Error(uploadError.message);
    return data.publicUrl;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (images.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const uploaded: Array<{ src: string; alt: string }> = [];
      for (let index = 0; index < images.length; index += 1) {
        setStatus(`Uploading photo ${index + 1} of ${images.length}...`);
        const prepared = await prepareImage(images[index].file);
        const src = await uploadFile(prepared, supabase);
        uploaded.push({ src, alt: `${form.name}, photo ${index + 1}` });
      }

      let videoUrl = "";
      if (video) {
        setStatus("Uploading video. This can take a minute...");
        videoUrl = await uploadFile(video, supabase);
      }

      setStatus("Saving product...");
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          collection: form.collection,
          colour: form.colour,
          description: form.description,
          details: form.details.split("\n"),
          fabric: form.fabric,
          sizes: form.sizes.split(",").map((size) => size.trim()),
          isNew: form.isNew,
          isBestseller: form.isBestseller,
          images: uploaded,
          video: videoUrl,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { product?: Product; error?: string };
      if (!response.ok || !data.product) throw new Error(data.error ?? "Could not save the product.");

      setProducts((current) => [data.product as Product, ...current]);
      images.forEach((image) => URL.revokeObjectURL(image.preview));
      setImages([]);
      setVideo(null);
      setForm(emptyForm);
      setStatus(`Added "${data.product.name}". It is now live on the store.`);
    } catch (caught) {
      setStatus(null);
      setError(caught instanceof Error ? caught.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Remove "${product.name}" from the store? This cannot be undone.`)) return;
    setError(null);
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Could not remove the product.");
      return;
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setStatus(`Removed "${product.name}".`);
  };

  const loadSamples = async () => {
    setBusy(true);
    setError(null);
    const response = await fetch("/api/admin/seed", { method: "POST" });
    const data = (await response.json().catch(() => ({}))) as { products?: Product[]; error?: string };
    setBusy(false);
    if (!response.ok || !data.products) {
      setError(data.error ?? "Could not load the sample products.");
      return;
    }
    setProducts(data.products);
    setStatus("Sample products loaded. Remove any you don't need.");
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="min-h-[100dvh] bg-ivory">
      <header className="sticky top-0 z-20 border-b border-beige bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <p className="font-serif text-2xl">Store admin</p>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" target="_blank" className="underline underline-offset-4">
              View store
            </Link>
            <button type="button" onClick={signOut} className="underline underline-offset-4">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 pb-24">
        {!configured ? (
          <div className="border border-charcoal bg-white p-5">
            <h2 className="font-serif text-2xl">Connect Supabase first</h2>
            <p className="mt-2 text-charcoal/80">
              Products and media are saved in Supabase. Add NEXT_PUBLIC_SUPABASE_URL,
              NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to your environment
              variables and redeploy. The README explains each step.
            </p>
          </div>
        ) : null}

        {setupError ? (
          <div role="alert" className="border border-charcoal bg-white p-5">
            <h2 className="font-serif text-2xl">The products table is not ready</h2>
            <p className="mt-2 text-charcoal/80">
              Run supabase/schema.sql in the Supabase SQL editor, then reload this page. Details:{" "}
              {setupError}
            </p>
          </div>
        ) : null}

        <div aria-live="polite">
          {status ? <p className="mb-4 bg-beige px-4 py-3 text-sm font-medium">{status}</p> : null}
          {error ? (
            <p role="alert" className="mb-4 border border-charcoal bg-white px-4 py-3 text-sm font-medium">
              {error}
            </p>
          ) : null}
        </div>

        {configured && !setupError ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section aria-labelledby="add-title">
              <h2 id="add-title" className="font-serif text-3xl">
                Add a product
              </h2>
              <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className={labelClass}>
                      Price (rupees)
                    </label>
                    <input
                      id="price"
                      required
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={form.price}
                      onChange={(event) => update("price", event.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="colour" className={labelClass}>
                      Colour
                    </label>
                    <input
                      id="colour"
                      value={form.colour}
                      onChange={(event) => update("colour", event.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className={labelClass}>
                      Category
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(event) => update("category", event.target.value)}
                      className={fieldClass}
                    >
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="collection" className={labelClass}>
                      Collection
                    </label>
                    <select
                      id="collection"
                      value={form.collection}
                      onChange={(event) => update("collection", event.target.value)}
                      className={fieldClass}
                    >
                      <option value="">None</option>
                      {collections.map((collection) => (
                        <option key={collection.slug} value={collection.slug}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sizes" className={labelClass}>
                    Sizes (separate with commas)
                  </label>
                  <input
                    id="sizes"
                    required
                    value={form.sizes}
                    onChange={(event) => update("sizes", event.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(event) => update("description", event.target.value)}
                    className={cn(fieldClass, "h-auto py-3")}
                  />
                </div>

                <div>
                  <label htmlFor="details" className={labelClass}>
                    Details (one per line)
                  </label>
                  <textarea
                    id="details"
                    rows={3}
                    value={form.details}
                    onChange={(event) => update("details", event.target.value)}
                    className={cn(fieldClass, "h-auto py-3")}
                  />
                </div>

                <div>
                  <label htmlFor="fabric" className={labelClass}>
                    Fabric and care
                  </label>
                  <input
                    id="fabric"
                    value={form.fabric}
                    onChange={(event) => update("fabric", event.target.value)}
                    className={fieldClass}
                  />
                </div>

                <fieldset>
                  <legend className={labelClass}>Photos (up to 8, the first is the main photo)</legend>
                  <input
                    ref={imageInput}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={pickImages}
                    className="sr-only"
                    aria-label="Choose photos"
                  />
                  <ul className="mt-3 grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <li key={image.id} className="relative aspect-[4/5] bg-beige">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.preview} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          aria-label={`Remove photo ${index + 1}`}
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-charcoal text-ivory"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                    {images.length < 8 ? (
                      <li>
                        <button
                          type="button"
                          onClick={() => imageInput.current?.click()}
                          className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1 border border-dashed border-charcoal text-xs"
                        >
                          <ImagePlus className="h-6 w-6" aria-hidden="true" />
                          Add photo
                        </button>
                      </li>
                    ) : null}
                  </ul>
                </fieldset>

                <fieldset>
                  <legend className={labelClass}>Video (optional, up to {MAX_VIDEO_MB} MB)</legend>
                  <input
                    ref={videoInput}
                    type="file"
                    accept="video/*"
                    onChange={pickVideo}
                    className="sr-only"
                    aria-label="Choose a video"
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => videoInput.current?.click()}
                      className={buttonStyles("outline", "gap-2 px-4 py-2.5")}
                    >
                      <Video className="h-5 w-5" aria-hidden="true" />
                      {video ? "Change video" : "Add video"}
                    </button>
                    {video ? (
                      <span className="flex min-w-0 items-center gap-2 text-sm">
                        <span className="truncate">{video.name}</span>
                        <button
                          type="button"
                          onClick={() => setVideo(null)}
                          aria-label="Remove video"
                          className="shrink-0 p-1"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </span>
                    ) : null}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3">
                  <label className="flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(event) => update("isNew", event.target.checked)}
                      className="h-5 w-5 accent-charcoal"
                    />
                    Show in New arrivals
                  </label>
                  <label className="flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isBestseller}
                      onChange={(event) => update("isBestseller", event.target.checked)}
                      className="h-5 w-5 accent-charcoal"
                    />
                    Show in Bestsellers
                  </label>
                </div>

                <button type="submit" disabled={busy} className={buttonStyles("primary", "w-full")}>
                  {busy ? "Working..." : "Add product to store"}
                </button>
              </form>
            </section>

            <section aria-labelledby="list-title">
              <h2 id="list-title" className="font-serif text-3xl">
                Products ({products.length})
              </h2>

              {products.length === 0 ? (
                <div className="mt-6 border border-beige bg-white p-5">
                  <p className="font-medium">No products yet.</p>
                  <p className="mt-2 text-sm text-grey">
                    Add your first product, or load the sample products to see how the store looks and
                    remove them later.
                  </p>
                  <button
                    type="button"
                    onClick={loadSamples}
                    disabled={busy}
                    className={buttonStyles("outline", "mt-4")}
                  >
                    Load sample products
                  </button>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-beige border-y border-beige">
                  {products.map((product) => (
                    <li key={product.id} className="flex items-center gap-4 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]?.src}
                        alt=""
                        loading="lazy"
                        className="h-20 w-16 shrink-0 bg-beige object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-sm text-grey">
                          {formatPrice(product.price)}, {product.category}
                          {product.video ? ", has video" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product)}
                        aria-label={`Remove ${product.name}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-beige hover:border-charcoal"
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
