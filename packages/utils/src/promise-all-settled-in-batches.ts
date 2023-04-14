type Task<I> = (item: I) => unknown;

// convert the above to all settled
export const promiseAllSettledInBatches = async <I, R>(
  task: Task<I>,
  items: I[],
  batchSize: number,
): Promise<R[]> => {
  let position = 0;
  let results: R[] = [];

  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize);
    results = [
      ...results,
      ...(await Promise.allSettled(
        itemsForBatch.map(
          (item) => task(item)
        )
      ))
        .filter(result => result.status === 'fulfilled')
        .map((result) => {
          const r = result as PromiseFulfilledResult<R>;
          return r.value;
        }),
    ];
    position += batchSize;
  }

  return results;
}
