define(['jq', 'methods', 'URLs', 'mustache'], function ($jq, methods, URLs, Mustache) {'use strict'; var
	loadCurrentProductFromTree = function (node) {
		var productId = node.productId;
		if (productId) {
			$.ajax({
				url: URLs.getProductInfo,
				method: 'GET',
				data: {productId: productId}
			}).then(function (response){
				var appliedFormula = '';
				$('#completedProduct').html($(Mustache.render($jq.completedProductTemplate.html(), response)));
				$('#formulasList').html(
					$.map(response.productModel.formulas, function (tr) {
						tr.beautyFormula = methods.beautifyFormula(tr.formula);
						if (tr.applied) { appliedFormula = tr.formula }
						return Mustache.render($jq.formulaInCompletedProductTemplate.html(), tr);
					})
				);
				$('#formulasList').find(`input[data-formula="${appliedFormula}"]`).click();
			});
		}
	},
	applyFormula = function () {
		var $this = $(this),
			formula = $this.attr('data-formula'),
			isChecked = $this.prop('checked'),
			S1 = $('#alwaysInTable').find('[data-cell="S1"]');
		if (!isChecked) {
			formula = '';
			S1.val('');
			$this.removeClass('appliedFormula');
		} else {
			$('.applyFormula').removeClass('appliedFormula');
			$this.addClass('appliedFormula');
			$('#formulasList .applyFormula').not('.appliedFormula').prop('checked', false);
		}
		S1.attr('data-formula', formula);
		if (!methods.excel('#hiddenCompletedProductTable')) {
			$this.prop('checked', false);
			S1.attr('data-formula', '');
		}
		bindValues();
	},
	bindValues = function () {
		$.map($('#completedProduct #alwaysInTable input[data-cell]'), function (input) {
			var $this = $(input);
			$('#completedProduct .alwaysInTable').find(`td[data-cell=${$this.attr('data-cell')}]`).text($this.val());
		} );
	},
	changeMetallHistory = function () {
		var selected = $('#metallHistorySelect option:selected');
		$('#completedProduct #alwaysInTable input[data-cell="PR1"]').val(selected.attr('data-price'));
		$('#completedProduct #alwaysInTable input[data-cell="PR2"]').val(selected.attr('data-outprice'));
		methods.excel('#hiddenCompletedProductTable');
		bindValues();
	},
	addToOrder = function () {
		var map,
			productId = $(this).attr('data-product-id'),
			alwaysInTable = JSON.stringify(methods.getTableContent('#completedProduct #alwaysInTable li')),
			obj = {};
		if (!MAIN.orderId) {
			methods.MESSAGES.error('Выберите Ордер', 3000);
			return false;
		}
		$.ajax({
			url: URLs.addProductToOrder,
			method: 'POST',
			data: {
				orderId: 	   MAIN.orderId,
				productId: 	   productId,
				alwaysInTable: alwaysInTable
			}
		}).then(function (data)
		{
			if ('ok' === data.status) {
				map = methods.getOrderMap();
				obj[productId] = 1;
				map.out.push(obj);
				saveOrderMap(JSON.stringify(map), true);
			}
		});
	},
	saveOrderMap = function (map, refresh) {
		$.ajax( {
			url   : URLs.saveOrderMap,
			method: 'POST',
			data: {map: map, orderId: MAIN.orderId}
		} ).then( function ( data ) {
			if (data && refresh) {
				
				var elem = '#orderTableWrapper';
				if ($('#fileManagerOrdersTab').hasClass('active')) {
					elem = '#orderTableWrapperFromTree';
				}
				//TABS.getRightTabContentTable(MAIN.orderId, elem);
			}
		} );
	},
	PRODUCTS_TREE = {
		getProductsTree: function () {
			$.ajax( {
				url   : URLs.getOrProductsTree,
				method: 'GET'
			} ).then( function ( data )
			{
				var tree = $('#productsTree');
				tree.tree({
					data: data,
					autoOpen: true,
					dragAndDrop: false,
					saveState: 'products-Tree',
					openedIcon: $('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>'),
					closedIcon: $('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>')
				});
				tree.bind(
					'tree.select',
					function (event) {
						if (event.node) {
							loadCurrentProductFromTree(event.node);
						}
					}
				);
				loadCurrentProductFromTree(tree.tree('getSelectedNode'));
				$("#productsTreeWrapper").mCustomScrollbar({theme:"3d-dark", autoHideScrollbar:true, axis: "yx"});
			});
		},
		handler: function () {
			$('#hideShowProductsTree').click(function() {
				methods.toggleTreeDisplay('#productsTreeWrapper', '#hideShowProductsTree');
			});
			$('#completedProduct')
					.on('click', '.applyFormula', applyFormula)
					.on('change', '#metallHistorySelect', changeMetallHistory)
					.on('click', '#addToOrder', addToOrder);
		}
	};
	
	return PRODUCTS_TREE;
});