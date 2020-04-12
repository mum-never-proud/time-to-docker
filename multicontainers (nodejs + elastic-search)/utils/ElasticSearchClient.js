import chalk from 'chalk';
import { createBulkRecords, createSearchBody } from '../helpers/elastic-search';
import elasticSearch from 'elasticsearch';
import { parseJSON } from '../helpers/file-parser';

const log = console.log;

export default class ElasticSearchClient {
  constructor(index, type) {
    this.index = index;
    this.type = type;
    this.elasticSearchClient = new elasticSearch.Client({
      host: 'es:9200',
      log: 'trace'
    });
  }

  bootstrap(filepath, index = this.index, type = this.type) {
    this.indexExists(index)
      .then(exists => {
        if (exists) {
          log(chalk.blueBright('data already exists, skipping...'));
        } else {
          const { index, type } = this;

          parseJSON(filepath)
            .then(data => Promise.resolve(createBulkRecords(data, index, type)))
            .then(bulkRecords => this.elasticSearchClient.bulk({ body: bulkRecords }))
            .then(() => log(chalk.greenBright('records bootstrapped successfully')))
            .catch(err => log(chalk.redBright(err)));
        }
      });
  }

  ping() {
    return this.elasticSearchClient.ping({
      requestTimeout: 30000
    });
  }

  search(query) {
    const { index, type } = this;

    return this.elasticSearchClient.search({
      index,
      body: createSearchBody(query),
      type
    });
  }

  indexExists(index) {
    return this.elasticSearchClient.indices.exists({ index });
  }
}
