javascript:(function () {
  var style = document.body.appendChild(document.createElement('link'));
  style.href = 'http://localhost:3001/client.css';
  style.rel = 'stylesheet';
  document.body.appendChild(document.createElement('script')).src = 'http://localhost:3001/client.js'
})();