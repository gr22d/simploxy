const browserAppData = this.browser || this.chrome;
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

browserAppData.commands.onCommand.addListener(function(command){
	if (command == 'toggle-proxy') {
	chrome.proxy.settings.get(
		  {'incognito': false},
		  function(config) {
			var proxy_type = JSON.stringify(config.value.mode);
			if(proxy_type == '"fixed_servers"'){
			browserAppData.browserAction.setIcon({path: { 19: 'icons/' + defaultIcon } });
			browserAppData.storage.local.get({popup_flag: false}, function(items) {
				var pf = items.popup_flag;
				if(pf == true){
					window.alert(' ++ PROXY OFF ++ ');}
				stopProxy();
			});

				
			}
			else
			{	
				browserAppData.browserAction.setIcon({path: { 19: 'icons/' + activeIcon } });
			
				browserAppData.storage.local.get({
						proxy_server: '127.0.0.1',
						proxy_port: 8080,
						popup_flag: false
					  }, function(items) {
					var pserver = items.proxy_server;
					var pp = items.proxy_port;
					var pf = items.popup_flag;
					
					pp = Number(pp);
					startProxy(pserver,pp);
					if(pf == true){
						window.alert(' ++ PROXY ON ++ \n\n-HOST : '+pserver+' -PORT : '+pp+'\n\n[!!] If you don\'t want pop-up, Set options');
						}
				});
				
				
			}

			
			
			
		  }
		);
	}
});

