import { useMemo } from 'react';

export function useRandomBadgeColor() {
  const badgeColorPalette = useMemo(() => [
    { bg: 'bg-rose-100 dark:bg-rose-100', text: 'text-rose-800 dark:text-black/80' },
    { bg: 'bg-sky-100 dark:bg-sky-200/90', text: 'text-sky-800 dark:text-black/80' },
    { bg: 'bg-emerald-100 dark:bg-emerald-100/90', text: 'text-emerald-800 dark:text-black/80' },
    { bg: 'bg-purple-100 dark:bg-purple-100/90', text: 'text-purple-800 dark:text-black/80' },
    { bg: 'bg-yellow-100 dark:bg-yellow-200', text: 'text-yellow-800 dark:text-black/80' },
  ], []);

  const getColor = (seed) => {
    const paletteLength = badgeColorPalette.length;

    if (seed !== undefined) {
      const index = typeof seed === 'number'
        ? seed
        : [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return badgeColorPalette[index % paletteLength];
    }

    const randomIndex = Math.floor(Math.random() * paletteLength);
    return badgeColorPalette[randomIndex];
  };

  return { getColor };
}
