export function generateUniqueId(): string {
  return `star-${Math.random().toString(36).substr(2, 9)}`;
}