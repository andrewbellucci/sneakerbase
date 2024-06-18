import TypeSense from 'typesense';

const client = new TypeSense.Client({
  'nodes': [{
    'host': 'kuyh91n4gpe03btwp-1.a1.typesense.net',
    'port': 443,
    'protocol': 'https'
  }],
  'apiKey': 'wxuKhi0Mj2f9iCe26msloyLlR0rgzNZn',
  'connectionTimeoutSeconds': 2
});

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  colorWay: string;
  make: string;
  previewImageUrl: string;
  isPlaceholder: boolean;
}

export async function searchSneakers(query: string) {
  return client.collections<SearchResult>('products')
    .documents()
    .search({ q: query, query_by: 'title' })
    .then(response => {
      if (!response.hits) return [] as SearchResult[];
      return response.hits.map(hit => hit.document);
    });
}
