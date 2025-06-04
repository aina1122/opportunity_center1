import type { BlogPosting } from 'schema-dts';
import { format } from 'date-fns';

interface ArticleSchemaInput {
  title: string;
  description: string;
  image: string;
  publishedDate: Date;
  modifiedDate: Date;
  authorName: string;
  authorUrl?: string;
  categoryName?: string;
  tags?: string[];
  url: string;
  siteName: string;
}

export function generateArticleSchema(input: ArticleSchemaInput): BlogPosting {
  const {
    title,
    description,
    image,
    publishedDate,
    modifiedDate,
    authorName,
    authorUrl,
    categoryName,
    tags,
    url,
    siteName
  } = input;

  const formattedPublishDate = format(publishedDate, 'yyyy-MM-dd');
  const formattedModifiedDate = format(modifiedDate, 'yyyy-MM-dd');

  const schema: BlogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': image,
    'datePublished': formattedPublishDate,
    'dateModified': formattedModifiedDate,
    'author': {
      '@type': 'Person',
      'name': authorName,
      'url': authorUrl
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteName,
      'logo': {
        '@type': 'ImageObject',
        'url': `${new URL(url).origin}/images/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    },
    'inLanguage': 'en-US'
  };

  // Add category if available
  if (categoryName) {
    schema.articleSection = categoryName;
  }

  // Add keywords if available
  if (tags && tags.length > 0) {
    schema.keywords = tags.join(', ');
  }

  return schema;
}

export function generateArticleSchemaScript(input: ArticleSchemaInput): string {
  const schema = generateArticleSchema(input);
  return JSON.stringify(schema);
}