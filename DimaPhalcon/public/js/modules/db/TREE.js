define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'knockout'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, ko) {var
    treeLayoutClick = function () {
		var $productsTreeDB = $jq.productsTreeDB();
			$(this).hide();
			MAIN.productsTreeDB.plugins.push('checkbox');
			MAIN.productsTreeDB.plugins = _.uniq(MAIN.productsTreeDB.plugins);
			$productsTreeDB.jstree('destroy');
			$productsTreeDB.jstree(MAIN.productsTreeDB);
			methods.toggleMainButtons($jq.mainIcons, $jq.productsTreeDBButtons);
			methods.showLayout($('#settingsMetallsWrapper'));
			methods.blur($('#settingsMetallsWrapper'));
			methods.showLayout($jq.productTabsLiWrapper(), $('#tabsLiLayout'));
			methods.blur($('#productTabsLiWrapper'));
	},
	TREE = {
		handler: function () {
			$('#dbProductsListList .productsTreeDB').on('changed.jstree', function(){
				return false;
			});
			$('#dbProductsListList .innerBackLayout').click(treeLayoutClick);
		}
    };

    return TREE;
});
