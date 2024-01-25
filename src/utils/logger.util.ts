import * as fs from 'fs';

export const log = (message: string) => {
  console.log('Something went wrong. See logs for more details.');

  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const log = `${time} ${message}`;

  if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
  fs.promises.appendFile('./logs/log.txt', `${log}\n`);
}