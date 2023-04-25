const { PORT = 3000 } = process.env;
// const DATABASE_URL = 'mongodb://localhost:27017/mestodb';
const regexUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

module.exports = {
  PORT,
  regexUrl,
};
