import db from '../db/database';
import { format } from 'date-fns';

// Generate sitemap XML
export async function generateSitemap() {
  try {
    // Fetch all published posts
    const posts: any = await db.query(`
      SELECT slug, updated_at 
      FROM posts 
      WHERE status = 'published'
    `);
    
    // Fetch all categories
    const categories: any = await db.query(`
      SELECT slug 
      FROM categories
    `);
    
    // Fetch all tags
    const tags: any = await db.query(`
      SELECT slug 
      FROM tags
    `);
    
    // Fetch all published pages
    const pages: any = await db.query(`
      SELECT slug, updated_at 
      FROM pages 
      WHERE status = 'published'
    `);
    
    const baseUrl = 'https://opportunitycenter.site';
    
    // Start XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    
    // Add posts
    posts.forEach((post: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${format(new Date(post.updated_at), 'yyyy-MM-dd')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Add categories
    categories.forEach((category: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    // Add tags
    tags.forEach((tag: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/tag/${tag.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });
    
    // Add pages
    pages.forEach((page: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${format(new Date(page.updated_at), 'yyyy-MM-dd')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    // Close XML
    xml += `
</urlset>`;
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Generate robots.txt
export function generateRobotsTxt() {
  const baseUrl = 'https://opportunitycenter.site';
  
  return `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;
}