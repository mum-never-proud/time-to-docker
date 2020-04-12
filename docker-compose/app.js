import boom from 'express-boom';
import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';
import ElasticSearchClient from './utils/ElasticSearchClient';

dotenv.config();

const app = express();
const elasticSearchClient = new ElasticSearchClient('cities', 'cities_list');
const { log } = console;

app.use(boom());

function pingAndRetry(retries = 6) {
  if (!retries) {
    process.exit(-1);
  }

  elasticSearchClient.ping()
    .then(() => elasticSearchClient.bootstrap(process.env.APP_DATA_FILE_PATH))
    .catch((err) => {
      log(chalk.redBright(new Error(`failed to ping elasticsearch > ${err}`)));
      setTimeout(() => pingAndRetry(retries - 1), 10000);
    });
}

pingAndRetry();

app.get('/', (req, res) => {
  elasticSearchClient.search(req.query.q)
    .then((data) => res.json({ data: data.hits.hits }))
    .catch(() => res.boom.badRequest('Something ain\'t right with the request >:V'));
});

app.get('*', (_, res) => {
  res.boom.notFound('what???');
});

app.listen(process.env.APP_PORT, () => log(chalk.blue(`${process.env.APP_NAME} started on port ${process.env.APP_PORT} @ ${Date.now()}`)));
