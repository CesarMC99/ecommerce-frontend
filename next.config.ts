import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Las fotos las optimiza Cloudinary (tamaño, formato y calidad), no el
    // servidor de Next: el loader construye la URL con esas transformaciones
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
