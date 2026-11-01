/**
 * Canonical product catalogue for the 2D rich portfolio.
 *
 * Shape: `Product` from `./schema`. Vercel URLs are authoritative (they are
 * the current live URLs per the 3D ProductRoom). The legacy GitHub Pages
 * URLs are kept in `repo`-adjacent notes only where useful.
 */

import type { Product } from './schema';

// Re-export the canonical type so existing importers that did
// `import { Product } from '../../data/products'` keep compiling.
export type { Product } from './schema';

export const products: Product[] = [
  {
    slug: 'problem-solver',
    title: 'AnonCafe',
    subtitle: 'Anonymous worry-sharing with access codes',
    excerpt:
      'Write down what is bothering you without making an account, then come back with your access code to read the replies.',
    body: [
      '## Why I built it',
      '',
      'I first met the idea of a worry box in Keigo Higashino\'s novel *The Miraculous Kiosk of Lost Time* (解忧杂货铺): write your worry in, and someone writes back. I wanted an online version people could actually use — without signing up for yet another account.',
      '',
      '## What it does',
      '',
      'You write down whatever is on your mind and get an access code. Come back later with the code and the replies are waiting. No account, no email, no profile — the whole exchange stays anonymous.',
      '',
      '## Stack',
      '',
      'React + Supabase (Postgres + Row Level Security) + access-code authentication, with a bilingual English / Chinese UI.',
    ].join('\n'),
    tags: ['React', 'Supabase', 'Anonymity', 'Education'],
    date: '2025-11',
    status: 'shipped',
    href: 'https://anoncafe.life',
    repo: 'https://github.com/surixing/ProblemSolver',
    metrics: [
      { label: 'users', value: '120+' },
      { label: 'sessions', value: '400+' },
    ],
  },
  {
    slug: 'mentor-table',
    title: 'Mentor Table',
    subtitle: 'Chat with history\'s greatest minds',
    excerpt:
      'Practice thinking with AI versions of historical figures. Ask Feynman about physics, Marcus Aurelius about fear, Ada Lovelace about first code.',
    body: [
      '## Why I built it',
      '',
      'Books are one-way. You can\'t ask a dead author a follow-up question. Mentor Table is my attempt to fix that — not to *replace* reading, but to turn it into a conversation.',
      '',
      '## What it does',
      '',
      'Pick a mentor. Ask a question. Get a response grounded in that person\'s actual writing, style, and worldview. The prompt engineering keeps the personas from sliding into generic assistant-speak.',
      '',
      '## Stack',
      '',
      'React + a small cast of carefully tuned persona prompts. No database — the whole thing is intentionally ephemeral, like a real conversation.',
    ].join('\n'),
    tags: ['React', 'AI', 'Personas', 'Education'],
    date: '2026-01',
    status: 'shipped',
    href: 'https://mentor-table.vercel.app',
    repo: 'https://github.com/surixing/MentorTable',
    metrics: [
      { label: 'mentors', value: '8' },
      { label: 'users', value: '500+' },
    ],
  },
];
