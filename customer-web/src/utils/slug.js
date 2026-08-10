export const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const slugToId = (slug) => {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
};
