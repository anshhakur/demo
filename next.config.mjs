/** Allow next/image to optimise photos uploaded to your Supabase Storage bucket. */
const remotePatterns = [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const { protocol, hostname } = new URL(supabaseUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", ""),
      hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // Ignore an invalid URL; the build will still work with local images.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
};

export default nextConfig;
