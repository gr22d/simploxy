const browserAppData = this.browser || this.chrome;
function saveOptions(e) {
  browserAppData.storage.local.set({
	proxy_server: document.querySelector('#proxy_server').value,
	proxy_port: document.querySelector('#proxy_port').value,
	popup_flag: document.querySelector('#popup_flag').checked
  }, () => {
    const status = document.querySelector('.status');
    status.textContent = '저장되었습니다.';
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
	popup_flag: true
  }, items => {
    document.querySelector('#proxy_server').value = items.proxy_server;
    document.querySelector('#proxy_port').value = items.proxy_port;
    document.querySelector('#popup_flag').checked = items.popup_flag;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
