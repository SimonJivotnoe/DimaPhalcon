define(['jq', 'methods', 'URLs', 'TABS'], function ($jq, methods, URLs, TABS) {var
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
	openProductFormTree = function () {
		var productsId = [];
		$.map($('.productsTreeDB').jstree('get_selected'), function (id) {
			var productId = id.split('_')[2];
			if (productId) {
				productsId.push(productId);
			}
		});
		$.post(URLs.addProductDbTab, {productsId: productsId}, function () {
			$('#dbProductsListTab, #dbProductsListList').nextAll().remove();
			TABS.getTabs();
			$jq.backDBTreeIcon.click();
		});
	},
	addToFamily = function () {
		var productsId = [],
			selectedMetalls = 0;
		$.map($('.productsTreeDB').jstree('get_selected'), function (id) {
			var productId = id.split('_')[2];
			if (productId) {
				productsId.push(productId);
			}
			if ('metall' === id.split('_')[0]) {
				selectedMetalls++;
			}
		});
		if (1 !== selectedMetalls) {
			methods.MESSAGES.error('Для создания Семейства нужно выбрать изделия только в рамках ОДНОГО Металла из ОДНОЙ Категории', 4000);
			return false;
		}
		$jq.addFamilyModal.modal('show');
	},
	exitFromTreeDB = function () {
		var $productsTreeDB = $jq.productsTreeDB();
		$('#dbProductsListList .innerBackLayout').show();
		MAIN.productsTreeDB.plugins = _.difference(MAIN.productsTreeDB.plugins, ['checkbox']);
		$productsTreeDB.jstree('destroy');
		$productsTreeDB.jstree(MAIN.productsTreeDB);
		methods.toggleMainButtons($jq.productsTreeDBButtons, $jq.mainIcons);
		methods.blur($('#settingsMetallsWrapper'), true);
		methods.hideLayout();
		methods.blur($('#productTabsLiWrapper'), true);
		methods.hideLayout($('#tabsLiLayout'));
	},
	TREE = {
		getDBTree: function () {
			$.ajax( {
				url   : URLs.getProductsTree,
				method: 'GET',
				data: {param: 'PR'}
			} ).then( function ( response )
			{
				MAIN.productsTreeDB.core.data = response.tree;
				$jq.productsTreeDB().jstree('destroy').jstree(MAIN.productsTreeDB);
				$jq.productsTreeDB().on('ready.jstree', function () {
					var $productsList = $jq.dbProductsListList();
					$('#databaseWrapper .innerBackLayout')
						.width($productsList.width())
						.height('100vh');
				});
			});
		},
		handler: function () {
			$jq.addNewProductIcon.click(prepareNewProductModal);
			$jq.showItemFromTreeDB.click(openProductFormTree);
			$jq.addToFamily.click(addToFamily);

			$jq.backDBTreeIcon.click(exitFromTreeDB);

			$('#dbProductsListList .productsTreeDB').on('changed.jstree', function(){
				return false;
			});
			$('#dbProductsListList .innerBackLayout').click(treeLayoutClick);
		}
    };

    return TREE;
});
