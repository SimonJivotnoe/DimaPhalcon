
define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION', 'PDF', 'CONSOLIDATE'], function ($jq, methods, URLs, Mustache, VALIDATION, PDF, CONSOLIDATE) {'use strict'; var
	findInClientsTree = function () {
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
					if (methods.checkResponseOnSuccess(response)) {
						$('#addNewClientForm input').val('');
						CLIENTS_TREE.getClientsTree(true);
					}
				});
			}
		},
		updateClientBtn: function () {
			var $tree = $('#clientsTree');
			if ($tree.tree('getSelectedNode').clientId) {
				var check = 0, data = {id: $tree.tree('getSelectedNode').clientId};
				$.map($('#addNewClientForm input'), function (input) {
					var $input = $(input);
					data[$input.attr('name')] = $input.val();
					if (!VALIDATION.validateInputVal(
						{
							val: $input.val(),
							id: '#' + $input.attr('id')
						}
					)) {
						check++;
					}
				});
				if (!check) {
					$.post(URLs.updateClient, data, function (response) {
						if (methods.checkResponseOnSuccess(response)) {
							CLIENTS_TREE.getClientsTree(true);
						}
					});
				}
			}
		},
		deleteClientBtn: function () {
			$.ajax({
				url: URLs.deleteClient + '/' + $('#clientsTree').tree('getSelectedNode').clientId,
				method: 'DELETE'
			}).then(function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					CLIENTS_TREE.getClientsTree(true);
					$('#deleteClientModal').modal('hide');
				}
				/*if (data.orders && data.orders.length) {
					for (var i = 0; i<=data.orders.length; i++) {
						$('.closeTabRight[data-order="' + data.orders[i] + '"]' ).click();
					}
				}*/
			});
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
		},
		addNewProject: function () {
			var check = 0,
				selectedNode = $('#clientsTree').tree('getSelectedNode');
			if ($('#h3NewProjectInfo').is(':visible')) {
				check = checkInputsInClientsDetails('#addNewProjectForm input');
			}
			if (0 === check && selectedNode) {
				projects.fillFormOfProjectInfo();
			} else {
				methods.MESSAGES.error('Р’С‹Р±РµСЂРёС‚Рµ РљР»РёРµРЅС‚Р°', 900);
			}
		},
		addNewProjectBtn: function () {
			var selectedNode = $('#clientsTree').tree('getSelectedNode');
			if (selectedNode && selectedNode.clientId) {
				var check = 0, data = {client: selectedNode.clientId};
				$.map($('#addNewProjectForm input'), function (input) {
					var $input = $(input);
					data[$input.attr('name')] = $input.val();
					if (!VALIDATION.validateInputVal({
							val: $input.val(),
							id: '#' + $input.attr('id')
						}
					)) {
						check++;
					}
				});
				if (!check) {
					$.post(URLs.addNewProject, data, function (response) {
						if (methods.checkResponseOnSuccess(response)) {
							$('#addNewProjectForm input').val('');
							CLIENTS_TREE.getClientsTree(true);
						}
					});
					var $tree = $('#clientsTree');
					setTimeout(function () {$tree.tree('openNode', $tree.tree('getSelectedNode'));}, 100);
				}
			}
		},
		updateProjectBtn: function () {
			var $tree = $('#clientsTree');
			if ($tree.tree('getSelectedNode').projectId) {
				var check = 0, data = {id: $tree.tree('getSelectedNode').projectId};
				$.map($('#addNewProjectForm input'), function (input) {
					var $input = $(input);
					data[$input.attr('name')] = $input.val();
					if (!VALIDATION.validateInputVal({
							val: $input.val(),
							id: '#' + $input.attr('id')
						}
					)) {
						check++;
					}
				});
				if (!check) {
					$.post(URLs.updateProject, data, function (response) {
						if (methods.checkResponseOnSuccess(response)) {
							CLIENTS_TREE.getClientsTree(true);
							CLIENTS_TREE.getClientsDetails();
						}
					});
				}
			}
		},
		deleteProjectBtn: function () {
			var $tree = $('#clientsTree'),
				parentNodeId = $tree.tree('getSelectedNode').parent.id;	
			$.ajax({
				url: URLs.deleteProject + '/' + $('#clientsTree').tree('getSelectedNode').projectId,
				method: 'DELETE'
			}).then(function (response){
				if (methods.checkResponseOnSuccess(response)) {
					$tree.tree('selectNode', $tree.tree('getNodeById', parentNodeId));
					CLIENTS_TREE.getClientsTree(true);
					$('#deleteProjectModal').modal('hide');
				}
			});
		},
	},
	orders = {
		currentTr: false,
		addOrder: function (data) {
			return $.post(URLs.createNewOrder, data, function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					var $tree = $('#clientsTree');
					CLIENTS_TREE.getClientsTree(true);
					setTimeout(function () {$tree.tree('openNode', $tree.tree('getSelectedNode'));}, 100);
				}
			});
		},
		addNewOrder: function () {
			var $tree = $('#clientsTree');
			if ($tree.tree('getSelectedNode').projectId) {
				orders.addOrder({project: $tree.tree('getSelectedNode').projectId});
			} else {
				methods.MESSAGES.error('Р’С‹Р±РµСЂРёС‚Рµ РџСЂРѕСЌРєС‚', 900);
			}
		},
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
					
					if (response.consolidateData) {
						localStorage.consOrder = 'consAverageTr';
						$('#orderWrapperFromTree #consOrderButtonsWrapper').show();
						CONSOLIDATE.buildConsolidateOrder(response.consolidateData);
					} else {
						delete localStorage.consOrder;
					}
					
					orders.setOrderSum();
					/*$(function () {
						setTimeout(function(){ $('#orderTable').resizableColumns({
							store: window.store
						}); }, 1);
					});*/
					methods.resizeGrip();
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
		deleteOrderBtn: function () {
			var $tree = $('#clientsTree'),
				parentNodeId = $tree.tree('getSelectedNode').parent.id;
			$.ajax({
				url: URLs.deleteOrder + '/' + MAIN.orderId,
				method: 'DELETE'
			}).then(function (response){
				if (methods.checkResponseOnSuccess(response)) {
					$tree.tree('selectNode', $tree.tree('getNodeById', parentNodeId));
					CLIENTS_TREE.getClientsTree(true);
					$('#deleteOrderModal').modal('hide');
				}
			});
		},
		changeQuantityInOrder: function () {
			var $this = $(this),
				quantity = parseInt($this.val()),
				row = $this.parents('.orderRow'),
				inPrice, outPrice, inSum, outSum, map;
			if (0 > quantity) {
				quantity = 1;
				$this.val(quantity);
			}
			inPrice = parseFloat(row.find('.inputPriceInOrder').text());
			outPrice = parseFloat(row.find('.outputPriceInOrder').text());
			inSum = quantity * inPrice;
			outSum = quantity * outPrice;
			row
				.find('.inputSumInOrder' ).attr('data-uah', inSum.toFixed(2)).html(inSum.toFixed(2)).end()
				.find('.outputSumInOrder').attr('data-uah', outSum.toFixed(2)).html(outSum.toFixed(2));
			map = JSON.stringify(methods.getOrderMap());
			CLIENTS_TREE.saveOrderMap(map, false);
			orders.setOrderSum();
		},
		
		addNewSection: function () {
			var sectionsNames = [], sectionsNamesNumbers = [], biggestNumber = 1;
			$.map($('#orderWrapperFromTree  .orderTableSectionName'), function (obj) {
				sectionsNames.push($(obj).attr('name').split(' '));
			});
			$.map(sectionsNames, function (arr) {
				if (parseInt(arr[1])) {
					sectionsNamesNumbers.push(parseInt(arr[1]));
				}
			});
			if (sectionsNamesNumbers.length) {
				biggestNumber = Math.max.apply(Math, sectionsNamesNumbers) + 1;
			}
			$('#orderWrapperFromTree .withoutSectionInOrderTable' ).before(`
				<tr class="orderTableSectionName" name="Раздел ${biggestNumber}">
					<th colspan="9"><span class="orderSectionName" contenteditable="true">Раздел ${biggestNumber}</span></th>
				</tr>`
			);
			CLIENTS_TREE.saveOrderMap(JSON.stringify(methods.getOrderMap()), true);
		},
		removeRowSection: function () {
			var map = methods.getOrderMap();
			delete map[$(this).attr('name')];
			CLIENTS_TREE.saveOrderMap(JSON.stringify(map), true);
		},
		changeSectionName: function () {
			var $this = $(this), currentSection = $this.text(), sectionsNames = [];
			$.map($('#orderWrapperFromTree .orderTableSectionName'), function (obj) {
				sectionsNames.push($(obj).attr('name'));
			});
			if (-1 === sectionsNames.indexOf($this.text())) {
				$this.closest('tr').attr('name', currentSection);
			}
			CLIENTS_TREE.saveOrderMap(JSON.stringify(methods.getOrderMap()), true);
			methods.resizeGrip();
		},
		moveToCopyTo: function () {
			var $this = $(this),
				action = $this.closest('ul').attr('data-action'),
				path = $this.attr('data-to-section'),
				productId = $this.attr('data-product-id'),
				map = methods.getOrderMap(),
				data = {},
				quantity = 1,
				currentPath = $this.attr('data-section');
			if (!currentPath) {
				currentPath = 'out';
			}
			if ('move' === action) {
				quantity = $this.attr('data-quantity');
				$.each(map[currentPath], function (num, obj) {
					if (productId === _.keys(obj)[0]) {
						map[currentPath].splice(num, 1);
					}
				});
			}
			data[productId] = quantity;
			map[path].push(data);
			CLIENTS_TREE.saveOrderMap(JSON.stringify(map), true);
		},
		removeOrderRow: function () {
			var $this = $(this),
				productId = $this.attr('data-product-id');
			if (1 >= orders.countProductInOrder(productId)) {
				orders.removeFromOrder(productId);
			}
			$(orders.currentTr).closest('tr').remove();
			CLIENTS_TREE.saveOrderMap(JSON.stringify(methods.getOrderMap()), true);
		},
		removeFromOrder: function (productId) {
			$.post(URLs.removeFromOrder, {orderId: MAIN.orderId, productId: productId});
		},
		countProductInOrder: function (productId) {
			var count = 0;
			$.map(methods.getOrderMap(), function (obj) {
				$.map(obj, function (object) {
					if (productId === _.keys(object)[0]) {
						count++;
					}
				});
			});
			return count;
		},
		swapRows: function () {
			var $this = $(this),
				section = $this.attr('data-section');
			var map = methods.getOrderMap(),
				currentIndex = 	parseInt($this.attr('data-number')),
				swapIndex;
			switch ($this.attr('data-move-action')) {
				case 'up':
					swapIndex = currentIndex - 1;
					if (0 === currentIndex) {
						swapIndex = _.size(map[section]) - 1;
					}
					break;
				case 'down':
					swapIndex = currentIndex + 1;
					if ((_.size(map[section]) - 1) === currentIndex) {
						swapIndex = 0;
					}
					break;
			}
			var temp = map[section][currentIndex];
			map[section][currentIndex] = map[section][swapIndex];
			map[section][swapIndex] = temp;
			CLIENTS_TREE.saveOrderMap(JSON.stringify(map), true);
		},
		buildDropdown: function (e) {
			e.stopPropagation();
			e.preventDefault();
			orders.currentTr = this;
			var $this = $(this),
				offset = $this.offset(),
				$rowActionsUl = $('#rowActionsUl'),
				productId = $this.attr('data-product-id'),
				section = $this.attr('data-section'),
				toSectionArr = $this.attr('data-to-section').split(','),
				toSection = '';
			if (!$this.hasClass('currentRow')) {
				$('.rowActionsDropdownClass').removeClass('currentRow');
				$this.addClass('currentRow');
				if (_.compact(toSectionArr).length) {
					$.map(toSectionArr, function (dataToSection) {
						toSection += `<li class="list-group-item moveToCopyTo"
						 data-product-id="${productId}"
						 data-section="${section}"
						 data-quantity="${$this.attr('data-quantity')}"
						 data-to-section="${dataToSection}">${dataToSection}
					 </li>`;
					});
					$rowActionsUl.find('.copyRowAction, .moveRowAction').show();
				} else {
					$rowActionsUl.find('.copyRowAction, .moveRowAction').hide();
				}
				$rowActionsUl
					.find('.moveOrderUp, .moveOrderDown').attr({
						'data-section': section,
						'data-number': $this.attr('data-number')
					}).end()
					.find('.copyRowAction, .moveRowAction').html(toSection).end()
					.find('.removeOrderRow').attr('data-product-id', productId).end()
					.css({width: '150px', top: (offset.top + 15), left: (offset.left - $rowActionsUl.width() + $this.width() + 10)})
					.attr('data-product-id', productId)
					.show();
			} else {
				$this.removeClass('currentRow');
				$rowActionsUl.hide();
			}
		},
		/*
		 '<li class="list-group-item moveToCopyTo" name="' . $productId . '" data-section="' . $section . '" data-to-section="' . $key . '">' . $key . '</li>'
		$(document).click(function () {
			if (!$(this).hasClass('currentRow')) {
				$('#usersTableDropdown, #databasesTableDropdown').hide();
			}
		});*/
	},
	consolidateOrder = {
		consolidateOrderCheck: function () {
			var $this = $(this);
			if ('' === $this.attr('data-selected')) {
				$this.addClass('consolidateOrderSelected').attr('data-selected', 'selected');
			} else if ('selected' === $this.attr('data-selected')) {
				$this.removeClass('consolidateOrderSelected').attr('data-selected', '');
			}
			methods.enableDisableButton($('.consolidateOrderSelected'), $('#FMconsolidatedOrdersBtn'));
			$('#FMconsolidatedOrdersBtn').attr('projectId', $('#clientsTree').tree('getSelectedNode').projectId);
		},
		createConsolidateOrder: function () {
			var ordersId = [];
			$.map($('#clientsTreeWrapper .consolidateOrderSelected'), function (obj) {
				ordersId.push($(obj).attr('data-id'));
			});
			$.when(orders.addOrder({
				project: $('#FMconsolidatedOrdersBtn').attr('projectId'),
				consolidate: true
			})).then(function(response){
				if (methods.checkResponseOnSuccess(response, false)) {
					consolidateOrder.addToConsolidateOrder(response.orderId, ordersId);
				}
			});
		},
		addToConsolidateOrder: function (orderId, arr) {
			$.post(URLs.addToConsolidateOrder, {orderId: orderId, arr: arr}, function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					CLIENTS_TREE.getClientsTree(true);
				}	
			});
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
									/*$li.find('.jqtree-element').append(
										`<span>&nbsp;</span>
										 <span class="glyphicon glyphicon-eye-open openProductTab" data-id="${node.orderId}" data-type="order" aria-hidden="true" data-selected=""></span>`
									);*/
								} else {
									$li.find('.jqtree-element').append(
										'<span>&nbsp;</span><span class="glyphicon glyphicon-none" aria-hidden="true"></span>'
									);
								}
								if ('TRUE' !== node.consolidate) {
									$li.find('.jqtree-element').append(
										`<span>&nbsp;</span>
										 <span class="glyphicon glyphicon-list-alt consolidateOrder" data-id="${node.orderId}" data-type="order" aria-hidden="true" data-selected=""></span>`
									);
								}
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
		getClientsDetails: function () {
			$.get(URLs.getClientsDescriptionObj, function (response) {
				if (response) {
					$(function () {
						$.each(response, function(name, arr) {
							$('#addNewClientForm input, #addNewProjectForm input').filter('[name="' + name + '"]').autocomplete({
								source: arr,
								select: function (event, ui) {
									$('#addNewClientForm input, #addNewProjectForm input').filter('[name="' + name + '"]').attr('value', ui.item.value ).val(ui.item.value);
								}
							});
						});
					});
				}
			});
		},
		saveOrderMap: function (map, refresh) {
			$.ajax( {
				url   : URLs.saveOrderMap,
				method: 'POST',
				data: {map: map, orderId: MAIN.orderId}
			} ).then( function ( response ) {
				if (methods.checkResponseOnSuccess(response) && refresh) {
					CLIENTS_TREE.getClientsTree(true);
					$('#rowActionsUl').hide();
				}
			} );
		},
        handler: function () {
			$('[data-toggle="tooltip"]').tooltip({ my: "left+15 center", at: "right center" });

			$('body').click(function () {
				if (!$(this).hasClass('currentRow')) {
					$('#rowActionsUl').hide();
				}
			});

            $('#hideShowClietsTree').click(function() {
                methods.toggleTreeDisplay('.totalClientsTreeWrapper', '#hideShowClietsTree');
				if ($('#fileManagerOrdersWrapper .totalClientsTreeWrapper').hasClass('hiddenTree')) {
					$('#fileManagerOrdersWrapper #orderFromTree').removeClass('col-md-8').addClass('col-md-12');
				} else {
					$('#fileManagerOrdersWrapper #orderFromTree').removeClass('col-md-12').addClass('col-md-8');
				}
				methods.resizeGrip();
            });

			$('#FMconsolidatedOrdersBtn').click(consolidateOrder.createConsolidateOrder);

			$('#findInClietsTree').keyup(findInClientsTree);
			$('#addNewClient').click(clients.addNewClient);
			$('#addNewClientBtn').click(clients.addNewClientBtn);
			$('#updateClientBtn').click(clients.updateClientBtn);

			$('#deleteClientBtn').click(clients.deleteClientBtn);
			$('#addNewProject').click(projects.addNewProject);
			$('#addNewProjectBtn').click(projects.addNewProjectBtn);
			$('#updateProjectBtn').click(projects.updateProjectBtn);

			$('#deleteProjectBtn').click(projects.deleteProjectBtn);
			$('#addNewOrder').click(orders.addNewOrder);

			$('#deleteOrderBtn').click(orders.deleteOrderBtn);

			$('#clientsTreeWrapper').on('click', '.consolidateOrder', consolidateOrder.consolidateOrderCheck);

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
				})
				.on('click', '.quantityInOrder', orders.changeQuantityInOrder)
				.on('click', '#addNewSection', orders.addNewSection)
				.on('click', '.removeRowSection', orders.removeRowSection)
				.on('blur', '.orderSectionName', orders.changeSectionName)
				.on('click', '#consAveragePrices', CONSOLIDATE.consAveragePrices)
				.on('click', '#consRemoveSections', CONSOLIDATE.consRemoveSections)
				.on('click', '.rowActionsDropdownClass', orders.buildDropdown)
				.on('show.bs.collapse', '#orderDetailsCollapse', function () {
					$('.grip').hide();
				})
				.on('hide.bs.collapse', '#orderDetailsCollapse', function () {
					$('.grip').show();
				});

			$('#rowActionsUl')
				.click(function () {$(this).toggle()})
				.on('click', '.moveToCopyTo', orders.moveToCopyTo)
				.on('click', '.removeOrderRow', orders.removeOrderRow)
				.on('click', '.moveOrderUp, .moveOrderDown', orders.swapRows);
        }
    };

    return CLIENTS_TREE;
});