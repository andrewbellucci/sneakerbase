const SX_PLACEHOLDER = 'https://stockx-assets.imgix.net/media/Product-Placeholder-Default-20210415.jpg?fit=fill&bg=FFFFFF&w=300&h=214&fm=webp&auto=compress&trim=color&q=90&dpr=2&updated_at=0';

export function isPlaceholderImage(image: string) {
  return image === SX_PLACEHOLDER || image.includes('Product-Placeholder');
}
