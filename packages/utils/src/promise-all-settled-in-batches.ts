type Task<I> = (item: I) => unknown;

export const promiseAllInBatches = async <I, R>(
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
      ...((await Promise.all(itemsForBatch.map((item) => task(item)))) as R[]),
    ];
    position += batchSize;
  }

  return results;
};
