define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	loadCurrentProductFromTree = function (node) {
		var productId = node.productId;
		if (productId) {
			$.ajax({
				url: URLs.getProductInfo,
				method: 'GET',
				data: {productId: productId}
			}).then(function (response){
				$('#completedProduct').html($(Mustache.render($jq.completedProductTemplate.html(), response)));
				$('#formulasList').html(
					$.map(response.productModel.formulas, function (tr) {
						tr.beautyFormula = methods.beautifyFormula(tr.formula);
						if (tr.applied) { appliedFormula = tr.formula }
						return Mustache.render($jq.formulaInCompletedProductTemplate.html(), tr);
					})
				);
				$('#formulasList').find(`input[data-formula="${appliedFormula}"]`).click();
				/*MAIN.productId = node.productId;
				$('#completedProduct').html(addLeftTabContentHandler($(data.html)));
				$('.rowValueInput').removeClass('rowValueInput');
				$('.cellBind').removeClass('cellBind');
				$('.glyphicon-retweet').removeClass('glyphicon-retweet');
				$('.removeFormula, .editFormula').remove();
				$('#metallHistorySelect option:last-child').prop('selected', true);*/
			});
		}
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
			});
		},
		handler: function () {
			$('#hideShowProductsTree').click(function() {
				methods.toggleTreeDisplay('#productsTreeWrapper', '#hideShowProductsTree');
			})
		}
	};
	
	return PRODUCTS_TREE;
});