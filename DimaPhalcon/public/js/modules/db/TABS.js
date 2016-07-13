define(['jq', 'methods', 'URLs'], function (
	$jq,
	methods,
	URLs
) {
	var 
	changeActiveTab = function () {
		$.ajax({
			url: URLs.changeActiveTab,
			method: 'POST',
			data: {
				id: $(this).attr('data-tab-id')
			}
		});
	},
	closeTab = function (e) {
		e.stopPropagation();
		e.preventDefault();
		var $this = $(this),
			$li = $this.closest('li'),
			isActive = $li.hasClass('active'),
			tabId = $this.attr('data-tab-id'),
			$liWrapper = $jq.productTabsLiWrapper(),
			numberOfLis = $liWrapper.find('ul li').length,
			currentLiNumber = $li.prevAll().length + 1,
			nextLiNumber = (currentLiNumber === numberOfLis) ? (numberOfLis - 2) : numberOfLis - 1;

		$.ajax({
			url: URLs.closeTab + '/' + tabId,
			method: 'DELETE'
		});

		if (isActive) {
			$liWrapper.find(`ul li:eq(${nextLiNumber}) [role=tab]`).click();
		}
		$li.find('a').hide('highlight');
		setTimeout(function () {
			$li.remove();
		}, 900);
	},
	TABS = {
		/*showPreferences: function (){
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
				tabId = $(scope ).find('.glyphicon-remove').attr('data-tab-id' );
				prodId = $(scope ).attr('name');
				MAIN[tabsList][selectedTabId].active = '1';
				res = {
					prodId: prodId,
					selectedTabId: selectedTabId,
					tabId: tabId
				};
				if (obj.hasOwnProperty('order')) {
					orderId = $(scope ).attr('data-order');
					TABS.getRightTabContentOrderDetails(orderId, selectedTabId);
					TABS.getRightTabContentTable(orderId, '#orderTableWrapper');
				} else {
					TABS[obj.getTabContent](prodId, selectedTabId);
				}

				TABS[obj.changeActiveTab](tabId, selectedTabId, obj.action);

			}

			return res;
		},
		
		setActiveDefaultTab: function (tabsList, id, curTabId) {
			$.each(MAIN[tabsList], function (tabId, obj) {
				obj.active = '0';
			});
			MAIN[tabsList][id].active = '1';
			MAIN[curTabId] = id;
		},*/
		handler: function () {
			$('#tabs').on('dblclick', '#myTab li', methods.expandDivider);
			$('#dbProductsListTab').click(function(){
				setTimeout(function () { $('#databaseWrapper .innerBackLayout').css({top: $('#dbProductsListList').offset().top}); }, 1);
			});
			$jq.sectionContent
				.on('click', '#productTabsLiWrapper .closeTab', closeTab)
				.on('shown.bs.tab', '#productTabsLiWrapper ul li', changeActiveTab);
		}
	};
	
	return TABS;
});	