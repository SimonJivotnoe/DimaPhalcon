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
		if (productsId.length) {
			$.post(URLs.addProductDbTab, {productsId: productsId}, function () {
				$('#dbProductsListTab, #dbProductsListList').nextAll().remove();
				TABS.getTabs();
				$jq.backDBTreeIcon.click();
			});
		}
	},
	familyName = [],
	productsAddInFamily = [],
	productsRemoveFromFamily = [],
	prepareFamilyAction = function () {
		var selectedMetalls = [];
		familyName = [];
		productsAddInFamily = [];
		productsRemoveFromFamily = [];
		$.map($('.productsTreeDB').jstree('get_selected'), function (id) {
			if ('product' === id.split('_')[0]) {
				var productId = id.split('_')[2];
				if (productId) {
					if ('inFamily' === id.split('_')[3]) {
						productsRemoveFromFamily.push(productId);
					} else {
						productsAddInFamily.push(productId);
					}
				}
				selectedMetalls.push($('#' + id).closest('[data-section="metall"]').attr('data-metallid'));
			}
			if ('family' === id.split('_')[0]) {
				familyName.push(id.split('_')[2]);
			}
		});
		if (1 !== _.compact(_.uniq(selectedMetalls)).length && !productsRemoveFromFamily.length) {
			methods.MESSAGES.error('Для создания Семейства нужно выбрать изделия только в рамках ОДНОГО Металла из ОДНОЙ Категории', 4000);
			return false;
		}
		if (1 !== _.uniq(familyName).length && _.uniq(familyName).length) {
			methods.MESSAGES.error('Для добавления в Семейство или удаления из Семейства нужно выбрать только ОДНО Семейство', 7000);
			return false;
		}
		// Create Family
		if (!familyName.length && productsAddInFamily.length) {
			$jq.createFamilyModal.modal('show');
			return true;
		}
		// Add to Family
		if (productsAddInFamily.length && familyName.length) {
			addToFamily();
		}
		// Remove from Family
		if (productsRemoveFromFamily.length && !productsAddInFamily.length) {
			removeFromFamily();
		}
	},
	creteFamily = function () {
		var familyName = $jq.newFamilyName.val();
		if (familyName) {
			addToFamily(familyName);
		}
	},
	addToFamily = function (_familyName = familyName[0]) {
		$.post(URLs.addToFamily, {familyName: _familyName, productsId: productsAddInFamily}, function (response) {
			if (methods.checkResponseOnSuccess(response)) {
				TREE.getDBTree();
				productsAddInFamily = [];
				familyName = [];
				$jq.createFamilyModal.modal('hide');
			}
		});
	},
	removeFromFamily = function () {
		$.ajax({
			url   : URLs.removeFromFamily + '/' + JSON.stringify(productsRemoveFromFamily),
			method: 'DELETE'
		}).then(function () {
			TREE.getDBTree();
			productsRemoveFromFamily = [];
		});
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
			$jq.familyActions.click(prepareFamilyAction);
				$jq.createFamilyBtn.click(creteFamily);

			$jq.backDBTreeIcon.click(exitFromTreeDB);

			$('#dbProductsListList .productsTreeDB').on('changed.jstree', function(){
				return false;
			});
			$('#dbProductsListList .innerBackLayout').click(treeLayoutClick);
		}
    };

    return TREE;
});