import type { LucideIconNode } from '@infra/shared/ui/lucide-icon';

const plus: LucideIconNode = [
  ['path', { d: 'M5 12h14' }],
  ['path', { d: 'M12 5v14' }],
];

const ellipsisVertical: LucideIconNode = [
  ['circle', { cx: '12', cy: '12', r: '1' }],
  ['circle', { cx: '12', cy: '5', r: '1' }],
  ['circle', { cx: '12', cy: '19', r: '1' }],
];

const trash2: LucideIconNode = [
  ['path', { d: 'M10 11v6' }],
  ['path', { d: 'M14 11v6' }],
  ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
  ['path', { d: 'M3 6h18' }],
  ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
];

const pencil: LucideIconNode = [
  [
    'path',
    {
      d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    },
  ],
  ['path', { d: 'm15 5 4 4' }],
];

const circle: LucideIconNode = [['circle', { cx: '12', cy: '12', r: '10' }]];

const circleCheck: LucideIconNode = [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'm9 12 2 2 4-4' }],
];

const chevronLeft: LucideIconNode = [['path', { d: 'm15 18-6-6 6-6' }]];

const user: LucideIconNode = [
  ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }],
  ['circle', { cx: '12', cy: '7', r: '4' }],
];

const link: LucideIconNode = [
  ['path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }],
  ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }],
];

const eye: LucideIconNode = [
  [
    'path',
    {
      d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
    },
  ],
  ['circle', { cx: '12', cy: '12', r: '3' }],
];

const eyeOff: LucideIconNode = [
  [
    'path',
    {
      d: 'M10.733 5.076A10.744 10.744 0 0 1 12 5c4.596 0 8.512 2.934 9.938 7a10.736 10.736 0 0 1-1.447 2.697',
    },
  ],
  ['path', { d: 'M6.61 6.609A10.717 10.717 0 0 0 2.062 12a10.734 10.734 0 0 0 13.793 6.938' }],
  ['line', { x1: '2', y1: '2', x2: '22', y2: '22' }],
  ['path', { d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24' }],
];

const x: LucideIconNode = [
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
];

export const lucideIconNodes = {
  plus,
  ellipsisVertical,
  trash2,
  pencil,
  circle,
  circleCheck,
  chevronLeft,
  user,
  link,
  eye,
  eyeOff,
  x,
} as const;
