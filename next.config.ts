import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Proxy de la API en producción: el navegador llama a /graphql en el
  // dominio de la tienda y Vercel lo reenvía al backend. Así la cookie de
  // sesión no es "de terceros" (ver src/lib/graphql-endpoint.ts). Solo se
  // activa si hay BACKEND_URL (en local se llama al backend directamente)
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    return backendUrl
      ? [{ source: "/graphql", destination: `${backendUrl}/graphql` }]
      : [];
  },
  images: {
    // Las fotos las optimiza Cloudinary (tamaño, formato y calidad), no el
    // servidor de Next: el loader construye la URL con esas transformaciones
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
