let base_url;

if(document.domain === 'localhost') base_url = 'http://localhost:5000';
else base_url = 'https://dashboard.heroku.com/'

export default base_url;