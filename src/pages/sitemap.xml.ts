import type { APIRoute } from 'astro';
import { generateSitemap } from '../utils/sitemap';

export const GET: APIRoute = async () => {
  try {
    const sitemap = await generateSitemap();
    
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', {
      status: 500
    });
  }
};