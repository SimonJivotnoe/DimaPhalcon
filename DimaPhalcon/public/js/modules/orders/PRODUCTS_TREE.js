define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	loadCurrentProductFromTree = function () {
		
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
							var node = event.node;
										console.log(node);
							//loadCurrentProductFromTree(node);
						}
					}
				);
				var selectedNode = tree.tree('getSelectedNode');
				loadCurrentProductFromTree(selectedNode);
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