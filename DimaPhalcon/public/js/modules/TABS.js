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
		},
		changeActiveTabBack: function (id, tabId, action) {
			$.ajax({
				url: URLs.TABS + action,
				method: 'POST',
				data: {
					id: id,
					tabId: tabId
				}
			})
		},
		// change active tab method
		changeActiveTab: function (obj) {
			var scope = obj.scope,
				selectedTabId = $(scope ).attr('aria-controls'),
				curTabId = obj.curTabId,
				tabsList = obj.tabsList,
				tabId, prodId, orderId, res = false;

			if ('' !== MAIN[curTabId]) {
				MAIN[tabsList][MAIN[curTabId]].active = '0';
			}

			if (MAIN[curTabId] !== selectedTabId && undefined !== selectedTabId){
				tabId = $(scope ).find('.glyphicon-remove').attr('name' );
				prodId = $(scope ).attr('name');
				MAIN[tabsList][selectedTabId].active = '1';
				res = {
					prodId: prodId,
					selectedTabId: selectedTabId,
					tabId: tabId
				};
				/*if (obj.hasOwnProperty('order')) {
					orderId = $(scope ).attr('data-order');
					TABS.getRightTabContentOrderDetails(orderId, selectedTabId);
					TABS.getRightTabContentTable(orderId, '#orderTableWrapper');
				} else {
					TABS[obj.getTabContent](prodId, selectedTabId);
				}

				TABS[obj.changeActiveTab](tabId, selectedTabId, obj.action);*/

			}

			return res;
		},
		
		setActiveDefaultTab: function (tabsList, id, curTabId) {
			$.each(MAIN[tabsList], function (tabId, obj) {
				obj.active = '0';
			});
			MAIN[tabsList][id].active = '1';
			MAIN[curTabId] = id;
		},
	};
	
	return TABS;
});	