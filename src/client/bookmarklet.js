javascript:(function () {
  var style = document.body.appendChild(document.createElement('link'));
  style.href = 'http://anisync.adl.cafe/client.css';
  style.rel = 'stylesheet';
  document.body.appendChild(document.createElement('script')).src = 'http://anisync.adl.cafe/client.js'
})();