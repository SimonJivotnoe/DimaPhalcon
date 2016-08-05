
define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION', 'PDF'], function ($jq, methods, URLs, Mustache, VALIDATION, PDF) {'use strict'; var
	findInClietsTree = function () {
		var tree = JSON.parse($('#clientsTree').tree('toJson')),
			text = $(this).val().toLowerCase();
		if (!text) {
			$('#clientsTree > ul > li').show();
		} else {
			$('#clientsTree > ul > li').hide();
			searchInTree(tree, text);
		}
	},
	searchInTree = function(node, text) {
		var res = false;
		$.map(node, function (obj) {
			if (!res) {
				$.map(obj.info, function (val) {
					if (-1 !== val.toLowerCase().search(text) && !res) {
						res = true;
					} else if (obj.children && obj.children.length) {
						res = searchInTree(obj.children, text);
					}
					if (res) {
						$('#clientsTree li .jqtree-title:contains("' + obj.name + '")').closest('.clientInTree').show();
					}
				});
			}
		});
	},
	currentClietsTreeSectionAction = function (node) {
		switch (node.sector) {
			case 'client':
				clients.fillFormOfClientsInfo(node.info);
				MAIN.orderId = false;
				break;
			case 'project':
				projects.fillFormOfProjectInfo(node.info);
				MAIN.orderId = false;
				break;
			case 'order':
				$('#addNewClientForm, #addNewProjectForm' ).hide();
				$('#orderWrapperFromTree').show();
				MAIN.orderId = node.orderId;
				orders.getOrderDetailsFromTree(node.orderId);
				//TABS.getRightTabContentTable(node.orderId, '#orderTableWrapperFromTree');
				break;
		}
	},
	clients = {
		checkInputsInClientsDetails: function (scope) {
			var check = 0;
			$.map($(scope), function (input) {
				var $input = $(input);
				if ($input.val()) {
					check++;
				}
			});
			return check;
		},
		fillFormOfClientsInfo: function (info) {
			$('#addNewProjectForm, .addNewClientBtnsWrapper, #orderWrapperFromTree').hide();
			if (info) {
				$.map($('#addNewClientForm input'), function (input) {
					var $input = $(input);
					$input.val(info[$input.attr('name')]);
				});
				$('#h3NewClientInfo').hide();
				$('#h3ClientInfo').show();
				$('#addNewClientBtn').hide();
				$('.addNewClientBtnsWrapper').show();
			} else {
				$('#addNewClientForm input').val('');
				$('#h3NewClientInfo').show();
				$('#h3ClientInfo').hide();
				$('#addNewClientBtn').show();
				$('.addNewClientBtnsWrapper').hide();
			}
			$('#addNewClientForm').show();
		},
		addNewClient: function () {
			var check = 0;
			$('#clientsTree').tree('selectNode');
			if ($('#h3NewClientInfo').is(':visible')) {
				check = clients.checkInputsInClientsDetails('#addNewClientForm input');
			}
			if (0 === check) {
				clients.fillFormOfClientsInfo();
			}
		},
		addNewClientBtn: function () {
			var check = 0, data = {};
			$.map($('#addNewClientForm input'), function (input) {
				var $input = $(input);
				data[$input.attr('name')] = $input.val();
				if (!VALIDATION.validateInputVal(
					{
						val: $input.val(),
						id: '#' + $input.attr('id')
					}
				)) { check++; }
			});
			if (!check) {
				$.post(URLs.addNewClient, data, function (response) {
					if (response) {
						$('#addNewClientForm input').val('');
						CLIENTS_TREE.getClientsTree(true);
					}
				});
			}
		},
	},
	projects = {
		fillFormOfProjectInfo: function (info) {
			$('#addNewClientForm, .addNewProjectBtnsWrapper, #orderWrapperFromTree' ).hide();
			if (info) {
				$.map($('#addNewProjectForm input'), function (input) {
					var $input = $(input);
					$input.val(info[$input.attr('name')]);
				});
				$('#h3NewProjectInfo').hide();
				$('#h3ProjectInfo').show();
				$('#addNewProjectBtn').hide();
				$('.addNewProjectBtnsWrapper').show();
			} else {
				$('#addNewProjectForm input').val('');
				$('#h3NewProjectInfo').show();
				$('#h3ProjectInfo').hide();
				$('#addNewProjectBtn').show();
				$('.addNewProjectBtnsWrapper').hide();
			}
			$('#addNewProjectForm').show();
		}
	},
	orders = {
		getOrderDetailsFromTree: function (orderId) {
			$.ajax( {
				url   : URLs.getOrderDetails,
				method: 'GET',
				data: {orderId: orderId}
			} ).then( function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					//$('#orderDetailsWrapperFromTree').html(addRightTabContentOrderHandler($(response.html)));
					$('#orderWrapperFromTree #orderDetailsWrapperFromTree').html(Mustache.render($jq.orderDetailsTemplate.html(), response));
					$('#orderWrapperFromTree #orderTableWrapperFromTree').html(response.orderTableContent);
					if ('TRUE' === response.consolidate) {
						//store.set('consOrder', 'consAverageTr');
						localStorage.consOrder = 'consAverageTr';
					} else {
						//store.remove('consOrder');
						delete localStorage.consOrder;
					}
					orders.setOrderSum();
					$(function () {
						$('[data-toggle="tooltip"]').tooltip({ my: "left+15 center", at: "right center" });
						setTimeout(function(){ $('#orderTable').resizableColumns({
							store: window.store
						}); }, 1);
					});
				}
			});
		},
		checkAllInOrderDetails: function (param = true, id = '#orderDetailsWrapperFromTree input') {
			$.map($(`#orderWrapperFromTree ${id}`), function (input) {
				$(input).prop('checked', param);
			});
		},
		changeDiscount: function () {
			$.post(URLs.changeDiscount, {discount: $(this).val(), orderId: MAIN.orderId});
			orders.setOrderSum();
		},
		setOrderSum: function () {
			var orderSum = 0,
				currency = $('#orderWrapperFromTree .activeCurrency' ).attr('data-currency');
			$.map($('#orderWrapperFromTree .outputSumInOrder'), function(obj) {
				orderSum += parseInt($(obj).text());
			});
			$('#orderWrapperFromTree #orderSum').text(orderSum + currency);
			$('#orderWrapperFromTree #orderSumWithDiscount').text(orderSum - orderSum * parseInt($('#orderWrapperFromTree #changeDiscount').val())/100 + currency);
		},
		changeCurrency: function () {
			var $this = $(this),
				dataArea = $this.attr('data-area');
			$('#orderWrapperFromTree #orderCurrenciesWrapper .activeCurrency' ).removeClass('activeCurrency');
			$this.addClass('activeCurrency');
			$.map($('[data-uah]'), function (td) {
				$(td).text((parseInt($(td).attr('data-uah')) / parseFloat($('[data-set="' + dataArea + '"]').val())).toFixed(2));
			});
			orders.setOrderSum();
		},
	},
    CLIENTS_TREE = {
		getClientsTree: function (refresh) {
			$.ajax({
				url: URLs.getClientsTree,
				method: 'GET'
			}).then(function (data)
			{
				MAIN.currentClietsTree = data.tree;
				var tree = $('#clientsTree');
				if (refresh) {
					tree.tree('loadData', data.tree);
				} else {
					tree.tree({
						data: data.tree,
						autoOpen: true,
						dragAndDrop: false,
						saveState: 'clients-Tree',
						openedIcon: $('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>'),
						closedIcon: $('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'),
						onCreateLi: function (node, $li) {
							if ('order' === node.sector) {
								if (!node.inTab) {
									$li.find('.jqtree-element').append(
										`<span>&nbsp;</span>
										 <span class="glyphicon glyphicon-eye-open openProductTab" data-id="${node.orderId}" data-type="order" aria-hidden="true" data-selected=""></span>`
									);
								} else {
									$li.find('.jqtree-element').append(
										'<span>&nbsp;</span><span class="glyphicon glyphicon-none" aria-hidden="true"></span>'
									);
								}
								$li.find('.jqtree-element').append(
										`<span>&nbsp;</span>
										 <span class="glyphicon glyphicon-list-alt consolidateOrder" data-id="${node.orderId}" data-type="order" aria-hidden="true" data-selected=""></span>`
									);
							}
							if ('project' === node.sector) {
								$li.find('.jqtree-title').html('<span class="glyphicon glyphicon-folder-close" aria-hidden="true">&nbsp;</span>' + $li.find('.jqtree-title').text());
							}
							if ('client' === node.sector) {
								$li.find('.jqtree-title').closest('li').addClass('clientInTree');
								$li.find('.jqtree-title').html('<span class="glyphicon glyphicon-user" aria-hidden="true">&nbsp;</span>' + $li.find('.jqtree-title').text());
							}
						}
					});
					tree.bind(
						'tree.click',
						function (event) {
							$('#clientsTree').tree('selectNode');
							currentClietsTreeSectionAction(event.node);
						}
					);
				}
				currentClietsTreeSectionAction(tree.tree('getSelectedNode'));
			});
		},
		
        handler: function () {
            $('#hideShowClietsTree').click(function() {
                methods.toggleTreeDisplay('.totalClientsTreeWrapper', '#hideShowClietsTree');
            });
			
			$('#findInClietsTree').keyup(findInClietsTree);
			
			$('#addNewClient').click(clients.addNewClient);
			
			$('#addNewClientBtn').click(clients.addNewClientBtn);
			$('#orderWrapperFromTree')
					.on('click', '#checkAllInOrder', orders.checkAllInOrderDetails)
					.on('click', '#uncheckAllInOrder', function () {
						orders.checkAllInOrderDetails(false);
					})
					.on('change', '#changeDiscount', orders.changeDiscount)
					.on('click', '#createPDF', PDF.saveOrderToPDF)
					.on('click', '#orderCurrenciesWrapper button', orders.changeCurrency)
					.on('click', '#checkAllInMainOrder', function () {
						orders.checkAllInOrderDetails(true, '#orderHeadChecks input');
					})
					.on('click', '#uncheckAllInMainOrder', function () {
						orders.checkAllInOrderDetails(false, '#orderHeadChecks input');
					});
        }
    };

    return CLIENTS_TREE;
});