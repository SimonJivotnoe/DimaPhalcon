define(['jq', 'methods', 'URLs', 'mustache'], function (
	$jq,
	methods,
	URLs,
	Mustache
) {var
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
			$liWrapper = $jq.productTabsLiWrapper(),
			numberOfLis = $liWrapper.find('ul li').length,
			currentLiNumber = $li.prevAll().length + 1,
			nextLiNumber = (currentLiNumber === numberOfLis) ? (numberOfLis - 2) : currentLiNumber;

		$.ajax({
			url: URLs.closeTab + '/' + $this.attr('data-tab-id'),
			method: 'DELETE'
		});
		if ($li.hasClass('active')) {
			$liWrapper.find(`ul li:eq(${nextLiNumber}) [role=tab]`).click();
		}
		$li.find('a').hide('highlight');
		$li.remove();
		$($this.closest('a').attr('href')).remove();
	},
	TABS = {
		getTabs: function () {
			$.ajax({
				url: URLs.getTabs,
				method: 'GET'
			}).then(function (response) {
				if (!response.activeTab) {
					$('#dbProductsListTab, #dbProductsListList').addClass('active');
					$('#dbProductsListTab').click();
				}
				if (response.data.length) {
					$(Mustache.render($jq.leftTabsTemplate.html(), response)).insertAfter('#dbProductsListTab');
					$('#leftTabsContent').append($(Mustache.render($jq.tabsContentTemplate.html(), response)));
				}
				if (response.productModel) {
					MAIN.productModel = response.productModel;
				}
			});
		},
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