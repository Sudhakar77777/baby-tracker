// utils/kidUtils.ts

const fallbackIcons = [
  'account-child',
  'baby-face',
  'emoticon-happy',
  'face-man',
  'face-woman',
  'account',
  'account-heart',
  'emoticon-excited',
  'account-star',
  'emoticon-cool',
];

export function getFallbackIconForKid(kidId: string): string {
  const hash = [...kidId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackIcons[hash % fallbackIcons.length];
}
