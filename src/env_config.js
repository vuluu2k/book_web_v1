const prod = process.env.NODE_ENV === 'production';

module.exports = {
  API_URL: prod ? 'https://bookapiv1.herokuapp.com/' : 'http://localhost:5000/api',
};
