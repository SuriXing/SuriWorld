import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "Suri's Blog",
    description: 'Coding journey, math, and small things I build, by Suri.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
      description: firstParagraph(post.body ?? ''),
    })),
    customData: '<language>en-us</language>',
  });
}

function firstParagraph(body) {
  const paragraph = body
    .split('\n\n')
    .map((p) => p.trim())
    .find(Boolean);
  if (!paragraph) return '';
  return paragraph
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#*`>]/g, '')
    .trim();
}
