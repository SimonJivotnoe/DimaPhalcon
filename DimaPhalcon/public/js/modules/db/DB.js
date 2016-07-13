define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'knockout'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, ko) {var
    changeActiveTab = function () {
        $.ajax({
            url: URLs.changeActiveTab,
            method: 'POST',
            data: {
                id: $(this).attr('data-tab-id')
            }
        })
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
	
    DB = {
		handler: function () {
			$('#db-left-component').css('width', localStorage['db-split']);
			$('#db-divider, #db-right-component').css('left', localStorage['db-split']);
			$('#db-divider').on('mousemove', function(){
				localStorage['db-split'] = $('#db-divider').css('left');
			});
			$jq.databaseWrapper().splitPane();
			$jq.sectionContent
				.on('click', '#productTabsLiWrapper .closeTab', closeTab)
				.on('shown.bs.tab', '#productTabsLiWrapper ul li', changeActiveTab);
		}
    };

    return DB;
});
