const browserAppData = this.browser || this.chrome;
const defaultIcon = 'default-64.png';

function stopProxy() {
  var config = {mode: "direct"};
  chrome.proxy.settings.set({value: config, scope: "regular"}, function() {});
}

function saveOptions(e) {
  browserAppData.storage.local.set({
	proxy_server: document.querySelector('#proxy_server').value,
	proxy_port: document.querySelector('#proxy_port').value,
	popup_flag: document.querySelector('#popup_flag').checked
  }, () => {
    const status = document.querySelector('.status');
    status.textContent = 'Saved!!';
	stopProxy();
	browserAppData.browserAction.setIcon({path: { 19: 'icons/' + defaultIcon } });
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
  e && e.preventDefault();
}

function restoreOptions() {
  browserAppData.storage.local.get({
	proxy_server: '127.0.0.1',
	proxy_port: 8080,
	popup_flag: false
  }, items => {
    document.querySelector('#proxy_server').value = items.proxy_server;
    document.querySelector('#proxy_port').value = items.proxy_port;
    document.querySelector('#popup_flag').checked = items.popup_flag;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
