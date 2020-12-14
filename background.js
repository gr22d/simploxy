const browserAppData = this.browser || this.chrome;
const tabs = {};
const activeIcon = 'active-64.png';
const defaultIcon = 'default-64.png';

function startProxy(op_pr_server, op_pr_port) {
  var config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: "http",
        host: 	op_pr_server,	
        port: 	op_pr_port		
      },
      bypassList: ["localhost"]
    }
  };
  chrome.proxy.settings.set({value: config, scope: "regular"}, function() {});
}

function stopProxy() {
  var config = {mode: "direct"};
  chrome.proxy.settings.set({value: config, scope: "regular"}, function() {});
}
var keys = ["proxy_server","proxy_port","popup_flag"];

const inspect = {
  toggleActivate: (type) => {
	if(type == 'activate'){
		browserAppData.storage.local.get(keys, function(items) {
		var pserver = items.proxy_server;
		var pp = items.proxy_port;
		var pf = items.popup_flag;
		pp = Number(pp);
		startProxy(pserver,pp);
		if(pf == true){
		chrome.proxy.settings.get(
		  {'incognito': false},
		  function(config) {
			var host=JSON.stringify(config.value.rules.singleProxy.host);
			var port=JSON.stringify(config.value.rules.singleProxy.port);
			
			window.alert(' ++ PROXY ON ++ \n\nHOST : '+host+'\nPORT : '+port);
		  });
		}
		});

		
		browserAppData.browserAction.setIcon({path: { 19: 'icons/' + activeIcon } });
	}
	else
	{
		
		browserAppData.storage.local.get(keys, function(items) {
		var pf = items.popup_flag;
		if(pf == true){
			window.alert(' ++ PROXY OFF ++ ');}
		stopProxy();
		});
		
		browserAppData.browserAction.setIcon({path: { 19: 'icons/' + defaultIcon } });
	}

    
  }
};

function toggle(tab) {
	chrome.proxy.settings.get(
		  {'incognito': false},
		  function(config) {
			var proxy_type = JSON.stringify(config.value.mode);
			if(proxy_type == '"direct"'){
				inspect.toggleActivate('activate');
			}
			else
			{
				inspect.toggleActivate('deactivate');
			}
		  }
		);
}



browserAppData.commands.onCommand.addListener(command => {
  if (command === 'toggle-xpath') {
    browserAppData.tabs.query({ active: true, currentWindow: true }, tab => {
      toggle(tab[0]);
    });
  }
});

browserAppData.browserAction.onClicked.addListener(toggle);
