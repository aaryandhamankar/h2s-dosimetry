import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MRPL H₂S Dosimeter Portal',
    short_name: 'H2S Portal',
    description: 'Mangalore Refinery and Petrochemicals Limited — Occupational Health & Safety Dosimeter Verification System',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAF6EE',
    theme_color: '#35551F',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
