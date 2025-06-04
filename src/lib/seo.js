import slugify from 'slugify';
import { getByField } from './db.js';

// Generate SEO-friendly slug
export function generateSlug(title, existingSlugs = []) {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });
  
  // Check if slug already exists in the provided list
  if (existingSlugs.includes(slug)) {
    // Add a unique suffix
    const timestamp = Date.now().toString().slice(-5);
    slug = `${slug}-${timestamp}`;
  }
  
  return slug;
}

// Generate meta description from content
export function generateMetaDescription(content, maxLength = 160) {
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Truncate to specified length
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last space before maxLength
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Return truncated text at word boundary with ellipsis
  return truncated.substring(0, lastSpace) + '...';
}

// Generate schema markup for a blog post
export function generateArticleSchema(post, author, siteUrl) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.meta_description || generateMetaDescription(post.content),
    'image': post.featured_image ? `${siteUrl}${post.featured_image}` : undefined,
    'author': {
      '@type': 'Person',
      'name': author.name
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'OpportunityCenter',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/images/logo.png`
      }
    },
    'datePublished': post.published_at,
    'dateModified': post.updated_at,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`
    }
  };
  
  return JSON.stringify(articleSchema);
}

// Generate schema markup for the website
export function generateWebsiteSchema(siteUrl, siteName, siteDescription) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'name': siteName,
    'description': siteDescription,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
  
  return JSON.stringify(websiteSchema);
}

// Generate canonical URL
export function generateCanonicalUrl(slug, siteUrl) {
  return `${siteUrl}/blog/${slug}`;
}

// Get site settings
export async function getSiteSettings() {
  try {
    const settings = {};
    const rows = await getByField('settings', 'id', 'id > 0');
    
    if (rows && rows.length) {
      for (const row of rows) {
        settings[row.key_name] = row.value;
      }
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      site_title: 'OpportunityCenter',
      site_description: 'Your gateway to scholarships, jobs, internships, and funding opportunities'
    };
  }
}

export default {
  generateSlug,
  generateMetaDescription,
  generateArticleSchema,
  generateWebsiteSchema,
  generateCanonicalUrl,
  getSiteSettings
};