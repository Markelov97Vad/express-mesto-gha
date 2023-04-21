const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необхадима авторизация' });
  }
  // извлечение токена
  const token = authorization.replace('Bearer', '');
  // верификация токена(расшифровка)
  // const payload = jwt.verify(token, 'some-secret-key');
  let payload;

  try {
    // верификация токена
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необхадима авторизация' });
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;
  console.log('token: ', token);
  console.log('payload: ', payload);
  return next();
};
