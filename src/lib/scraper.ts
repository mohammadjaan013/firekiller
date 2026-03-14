import { prisma } from "@/lib/db";

interface ScrapedArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

const FEED_QUERIES = [
  "fire+accident+India",
  "fire+safety+India",
  "fire+incident+news",
  "kitchen+fire+safety",
  "fire+extinguisher+news+India",
];

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
  return match ? match[1].trim() : "";
}

function extractSourceAttr(xml: string): string {
  const match = xml.match(/<source[^>]*url="[^"]*"[^>]*>([^<]*)<\/source>/);
  return match ? match[1].trim() : "Google News";
}

function parseRSSItems(xml: string): ScrapedArticle[] {
  const articles: ScrapedArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .substring(0, 500);
    const pubDate = extractTag(itemXml, "pubDate");
    const source = extractSourceAttr(itemXml);

    if (title && link) {
      articles.push({ title, link, description, pubDate, source });
    }
  }
  return articles;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

export async function scrapeFireNews(): Promise<{
  added: number;
  skipped: number;
  errors: string[];
}> {
  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const query of FEED_QUERIES) {
    try {
      const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
      const response = await fetch(url, {
        headers: { "User-Agent": "FireKiller-Blog-Aggregator/1.0" },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        errors.push(`Feed ${query}: HTTP ${response.status}`);
        continue;
      }

      const xml = await response.text();
      const articles = parseRSSItems(xml);

      for (const article of articles.slice(0, 5)) {
        const slug = slugify(article.title) + "-" + Date.now().toString(36).slice(-4);

        // Skip if we already have this article (by sourceUrl)
        const existing = await prisma.blogPost.findFirst({
          where: { sourceUrl: article.link },
        });

        if (existing) {
          skipped++;
          continue;
        }

        const category = query.includes("kitchen")
          ? "Kitchen Safety"
          : query.includes("safety")
          ? "Fire Safety"
          : "Fire News";

        await prisma.blogPost.create({
          data: {
            title: article.title,
            slug,
            excerpt: article.description || article.title,
            content: `<p>${article.description}</p>\n<p><a href="${article.link}" target="_blank" rel="noopener noreferrer">Read the full article on ${article.source} →</a></p>`,
            category,
            source: article.source,
            sourceUrl: article.link,
            isScraped: true,
            isPublished: true,
            readTime: "2 min read",
            publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
          },
        });
        added++;
      }
    } catch (err) {
      errors.push(`Feed ${query}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return { added, skipped, errors };
}
