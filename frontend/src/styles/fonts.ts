import { Jost, Space_Grotesk } from 'next/font/google';

export const SpaceGroteskFont = Space_Grotesk({
  subsets: ['latin'],
  fallback: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Helvetica Neue',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ],
});

export const JostFont = Jost({
  subsets: ['latin'],
  weight: '500',
  fallback: ['Futura', 'Space Grotesk', 'sans-serif'],
});
