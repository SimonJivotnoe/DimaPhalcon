define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'knockout'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, ko) {var
    prepareNewProductModal = function () {
		var kimVal = $jq.addNewProductModal.find('.kimList option:selected').attr('data-val'),
			metallList = $jq.addNewProductModal.find('.metallsList option:selected');
		$('#addNewProductModal [data-cell="KIM1"]').val(kimVal);
		$('#addNewProductModal [data-cell="PR1"]').val(metallList.attr('data-price'));
		$('#addNewProductModal [data-cell="PR2"]').val(metallList.attr('data-outprice'));
		methods.excel();
	},
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
			$jq.addNewProductIcon.click(prepareNewProductModal);
			$('#showItemFromFileManager').click(function() {
				var product = [];
				$(this).hide();
				$.each($('.productsTreeDB li[data-section=product][aria-selected=true]'), function (num, obj) {
					product.push($(obj).attr('data-productid'));
				});
				console.log(product);
				$.when(TABS.openSavedProduct(product, 'new', false, false)).done(function(){
					window.location.href = LOCATION;
				});
			});
			$('#dbProductsListList .productsTreeDB').on('changed.jstree', function(){
				return false;
			});
			$('#dbProductsListList .innerBackLayout').click(treeLayoutClick);
		}
    };

    return TREE;
});
