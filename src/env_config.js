const prod = process.env.NODE_ENV === 'production';

module.exports = {
  API_URL: prod ? 'https://phone-top.herokuapp.com/api' : 'http://localhost:5000/api',
};
