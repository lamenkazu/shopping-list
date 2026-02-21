import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

export type LucideIconNode = ReadonlyArray<readonly [string, Record<string, unknown>]>;

export interface UILucideIconProps {
  iconNode: LucideIconNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ImageStyle>;
}

const escapeAttribute = (value: unknown) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
};

const buildSvg = (iconNode: LucideIconNode, color: string, strokeWidth: number) => {
  const nodes = iconNode
    .map(([tagName, attrs]) => {
      const attributes = Object.entries(attrs)
        .filter(([key]) => key !== 'key')
        .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
        .join(' ');

      return `<${tagName} ${attributes} />`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${escapeAttribute(
    color
  )}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${nodes}</svg>`;
};

const utf8ToBase64 = (value: string) => {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(unescape(encodeURIComponent(value)));
  }

  const maybeBuffer = (globalThis as { Buffer?: { from: (input: string, encoding?: string) => { toString: (encoding: string) => string } } }).Buffer;

  if (maybeBuffer) {
    return maybeBuffer.from(value, 'utf-8').toString('base64');
  }

  return '';
};

export const UILucideIcon = ({
  iconNode,
  size = 20,
  color = '#111827',
  strokeWidth = 2,
  style,
}: UILucideIconProps) => {
  const svg = buildSvg(iconNode, color, strokeWidth);
  const base64 = utf8ToBase64(svg);

  const source = base64
    ? { uri: `data:image/svg+xml;base64,${base64}` }
    : { uri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` };

  return <Image source={source} style={[{ width: size, height: size }, style]} contentFit="contain" />;
};
