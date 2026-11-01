/**
 * Canonical writing entries for the 2D rich portfolio.
 *
 * Shape: `Post` from `./schema`. Only the published inline essays live
 * here — the coming-soon stubs from the first 2D pass were removed once
 * the real blog shipped at suri.world/blog.
 */

import type { Post } from './schema';

export type { Post } from './schema';

export const posts: Post[] = [
  {
    slug: 'why-i-build-things',
    title: 'Why I Build Things',
    excerpt:
      'Building is how I think. A short note on why I ship small, rough, real things instead of polished essays about them.',
    kind: 'inline',
    body: [
      'I don\'t build things because I want to launch a company. I build them because I don\'t understand an idea until I\'ve tried to make it real.',
      '',
      'Writing an essay about an idea lets you skip the hard parts. Code won\'t. The compiler catches every hand-wave, and the user catches every one the compiler missed.',
      '',
      'So: ship small, ship rough, ship real. The polish comes after the idea survives contact with reality.',
    ].join('\n'),
    tags: ['meta', 'building', 'philosophy'],
    date: '2026-04',
    status: 'published',
  },
  {
    slug: 'learning-by-shipping',
    title: 'Learning by Shipping',
    excerpt:
      'School teaches you to optimize for grades. Shipping teaches you to optimize for whether the thing actually works.',
    kind: 'inline',
    body: [
      'In school, the feedback loop is a grade at the end of a semester. By the time you get it, you\'ve already forgotten what you did wrong.',
      '',
      'Shipping has a different loop. You put something in front of a real user and within minutes you know where it breaks. The failure mode is specific, the fix is specific, and the next version is better because of it.',
      '',
      'Every project I\'ve shipped has taught me something no class ever did. Not because classes are bad — because the feedback is too slow to be memorable.',
    ].join('\n'),
    tags: ['learning', 'building', 'education'],
    date: '2026-03',
    status: 'published',
  },
];
