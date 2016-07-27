define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	toggleTreeDisplay = function (treeWrapper, button) {
		if ($(treeWrapper).hasClass('hiddenTree')) {
			$(treeWrapper).removeClass('hiddenTree');
			$(treeWrapper).show('highlight');
			$(button)
				.find('.hideClientsTree').show().end()
				.find('.showClientsTree').hide();
		} else {
			$(treeWrapper).addClass('hiddenTree');
			$(treeWrapper).hide('highlight');
			$(button)
				.find('.hideClientsTree').hide().end()
				.find('.showClientsTree').show();
		}
	},
	loadCurrentProductFromTree = function () {
		
	},
	OR_TREE = {
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
				toggleTreeDisplay('#productsTreeWrapper', '#hideShowProductsTree');
			})
		}
	};
	
	return OR_TREE;
});