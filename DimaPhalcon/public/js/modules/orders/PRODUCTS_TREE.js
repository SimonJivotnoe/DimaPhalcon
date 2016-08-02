define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {'use strict'; var
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
		$.map($('#completedProduct #alwaysInTable input[data-cell]'), function (input) {
			var cell = $(input).attr('data-cell'),
			    text = $(input).val();
					console.log(cell);
					console.log(text);
				$('#completedProduct .alwaysInTable').find(`tr td[data-cell=${cell}]`).text(text);
		} );
		if (!methods.excel('#hiddenCompletedProductTable')) {
			$this.prop('checked', false);
			S1.attr('data-formula', '');
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
				$("#productsTreeWrapper").mCustomScrollbar({theme:"3d-dark", autoHideScrollbar:true, axis: "yx"});
			});
		},
		handler: function () {
			$('#hideShowProductsTree').click(function() {
				methods.toggleTreeDisplay('#productsTreeWrapper', '#hideShowProductsTree');
			});
			$('#completedProduct').on('click', '.applyFormula', applyFormula);
		}
	};
	
	return PRODUCTS_TREE;
});