import axios from 'axios';
import boom from 'express-boom';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const { log } = console;

app.use(boom());

app.get('/', (req, res) => {
  axios.get(`https://restcountries.eu/rest/v2/name/${req.query.q}`)
    .then((data) => res.json(data.data))
    .catch(() => res.boom.badRequest('something ain\'t right'));
});

app.get('*', (_, res) => {
  res.boom.notFound('what???');
});

app.listen(process.env.APP_PORT, () => log(`${process.env.APP_NAME} started on port ${process.env.APP_PORT} @ ${Date.now()}`));
