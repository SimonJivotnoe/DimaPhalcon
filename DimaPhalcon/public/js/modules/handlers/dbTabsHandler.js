define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION) {var
    closeLeftTab = function (idDb, currentID) {
        var nextActiveTab = MAIN.curTabId,
            productId = MAIN.productId,
            elemInObj = Object.keys(MAIN.tabsList),
            ifActive, index;
        if (2 === elemInObj.length) {
            nextActiveTab = 'dbProductsListTab';
        } else {
            ifActive = MAIN.tabsList[currentID].active;
            if ('1' === ifActive) {
                index = elemInObj.indexOf(currentID);
                if (index === elemInObj.length - 1) {
                    nextActiveTab = Object.keys(MAIN.tabsList)[elemInObj.length - 2];
                } else {
                    nextActiveTab = Object.keys(MAIN.tabsList)[index + 1];
                }
                productId = MAIN.tabsList[nextActiveTab].productId;
                MAIN.tabsList[nextActiveTab].active = '1';
            }
        }
        delete MAIN.tabsList[currentID];
        $('[aria-controls=' + currentID + ']').hide('highlight');
        setTimeout(function () {
            $('[aria-controls=' + currentID + ']').parent().remove();
        }, 900);
        if ('dbProductsListTab' === nextActiveTab || undefined === nextActiveTab) {
            $('.currentTab').removeClass('active');
            $('#dbProductsListTab, #dbProductsListList').addClass('active');
            TABS.loadPreferences();
            console.log(PRODUCT);
            PRODUCT.createFileManager('PR');
        } else {
            $('[aria-controls=' + nextActiveTab + ']').parent().addClass('active');
        }

        $.ajax({
            url: URL_TABS + 'closeTab',
            method: 'POST',
            data: {
                id: idDb,
                tabId: currentID,
                nextActiveTab: nextActiveTab
            }
        }).then(function (  )
        {
            if ('dbProductsListTab' !== nextActiveTab) {
                TABS.getLeftTabContent(productId, nextActiveTab);
            }
        });
    },
    deleteFromDb = function (tabId) {
        $.ajax({
            url: URLs.closeTab + '/' + tabId,
            method: 'DELETE'
        })
    },
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
            nextLiNumber = (currentLiNumber === numberOfLis) ? (numberOfLis - 2) : numberOfLis;
        //deleteFromDb(tabId);
        if (isActive) {
            $liWrapper.find(`ul li:eq(${nextLiNumber}) [role=tab]`).click();
        }
        $li.find('a').hide('highlight');
        setTimeout(function () {
            $li.remove();
        }, 900);
    },
    dbTabsHandler = function () {
        $jq.sectionContent
            .on('click', '#productTabsLiWrapper .closeTab', closeTab)
            .on('click', '#productTabsLiWrapper ul li', changeActiveTab);
    };

    return dbTabsHandler;
});
