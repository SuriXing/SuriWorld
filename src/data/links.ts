// External project links shown in the <ProjectsDock /> on the landing page.
// Edit these when URLs change.

interface ProjectLink {
  id: string;
  label: string;
  description: string;
  href: string;
  // Accent hue for the dock card.
  hue: string;
}

export const PROJECT_LINKS: readonly ProjectLink[] = [
  {
    id: 'blog',
    label: 'Blog',
    description: 'Things I am writing',
    // Astro blog served from the same Vercel project (merged build, see
    // blog/README.md). Internal path -> opens in the same tab.
    href: '/blog',
    hue: '#4ade80',
  },
  {
    id: 'anoncafe',
    label: 'AnonCafe',
    description: 'Anonymous conversations',
    href: 'https://anoncafe.life/',
    hue: '#f4a8b8',
  },
  {
    id: 'mentor-table',
    label: 'Mentor Table',
    description: 'Chat with great minds',
    href: 'https://mentor-table.vercel.app',
    hue: '#fbbf24',
  },
] as const;
