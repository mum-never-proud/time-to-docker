import fs from 'fs';

export function parseJSON(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        reject(new Error(`failed to parse ${filepath} > ${err}`))
      } else {
        resolve(JSON.parse(data));
      }
    });
  })
}
