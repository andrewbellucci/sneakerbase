export function transformProductImageUrl(urlString: string): string {
  const url = new URL(urlString);
  const urlParams = new URLSearchParams(url.search);

  urlParams.delete('fit');
  urlParams.set('fit', 'fit');
  urlParams.delete('fm');
  urlParams.set('fm', 'jpg');

  return 'https://' + url.host + url.pathname + '?' + urlParams.toString();
}
