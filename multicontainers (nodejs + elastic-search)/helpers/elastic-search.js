export function createBulkRecords(data, index, type) {
  const bulkRecords = [];

  if (data.constructor.name === 'Array') {
    data.forEach(record => {
      bulkRecords.push({ index: { _index: index, _type: type } });
      bulkRecords.push(record);
    });
  }

  return bulkRecords;
}

export function createSearchBody(query) {
  return {
    size: 200,
    from: 0,
    query: {
      match: {
        name: query
      }
    }
  };
}
