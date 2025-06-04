import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '../utils/sitemap';

export const GET: APIRoute = async () => {
  const robotsTxt = generateRobotsTxt();
  
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};