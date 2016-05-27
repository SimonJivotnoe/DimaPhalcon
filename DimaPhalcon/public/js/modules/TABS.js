define(function (require) {
	var $jq = require('jq');
	var methods = require('methods');
	var URLs = require('URLs');
	var TABS = {
		showPreferences: function (){
			$('#dbProductsListTab, #dbProductsListList').addClass('active');
			TABS.loadPreferences();
			methods.showBody();
		},
		
		loadPreferences: function () {
			$.each(MAIN.tabsList, function (tabId, obj) {
				obj.active = '0';
			});
			MAIN.tabsList.dbProductsListTab.active = '1';
			MAIN.curTabId = 'dbProductsListTab';
		}
	};
	
	return TABS;
});	