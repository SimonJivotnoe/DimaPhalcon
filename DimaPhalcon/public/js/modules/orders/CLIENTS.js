
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
				methods.MESSAGES.error('Выберите Клиента', 900);
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
				methods.MESSAGES.error('Выберите Проэкт', 900);
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
						consolidateOrder.buildConsolidateOrder(response.consolidateData);
					} else {
						delete localStorage.consOrder;
					}
					
					orders.setOrderSum();
					$(function () {
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
		},
		moveToCopyTo: function () {
			var $this = $(this),
				action = $this.closest('div').find('.moveToAction option:selected').val(),
				path = $this.closest('div').find('.moveToPath option:selected').text(),
				productId = $this.attr('name'),
				map = methods.getOrderMap(),
				data = {},
				quantity = 1,
				currentPath = $this.attr('data-section');
			if (!currentPath) {
				currentPath = 'out';
			}
			if ('move' === action) {
				quantity = $this.closest('tr').find('.quantityInOrder').val();
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
				productId = $this.attr('name');
			if (1 >= orders.countProductInOrder(productId)) {
				orders.removeFromOrder(productId);
			}
			$this.closest('tr' ).remove();
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
		consolidateObj: {
			sections: {},
			withoutSection: {},
			productsDetails: {}
		},
		buildConsolidateOrder: function (consolidateData) {
			consolidateOrder.consolidateObj = {
				sections: {},
				withoutSection: {},
				productsDetails: {}
			};
			$.each(consolidateData, function (orderId, obj) {
				if ( _.size(obj.map)) {
					$.each(obj.map, function (section, secObj) {
						if (_.size(secObj)) {
							$.map(secObj, function (detSec) {
								$.each(detSec, function (prId, quantity) {
									if (!consolidateOrder.consolidateObj.sections[section]) {
										consolidateOrder.consolidateObj.sections[section] = {};
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId]) {
										consolidateOrder.consolidateObj.sections[section][prId] = {};
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId].quantity) {
										consolidateOrder.consolidateObj.sections[section][prId].quantity = 0;
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId].inPrices) {
										consolidateOrder.consolidateObj.sections[section][prId].inPrices = [];
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId].outPrices) {
										consolidateOrder.consolidateObj.sections[section][prId].outPrices = [];
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId].sum) {
										consolidateOrder.consolidateObj.sections[section][prId].sum = [];
									}
									if (!consolidateOrder.consolidateObj.sections[section][prId].inSum) {
										consolidateOrder.consolidateObj.sections[section][prId].inSum = [];
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId]) {
										consolidateOrder.consolidateObj.withoutSection[prId] = {};
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId].quantity) {
										consolidateOrder.consolidateObj.withoutSection[prId].quantity = 0;
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId].inPrices) {
										consolidateOrder.consolidateObj.withoutSection[prId].inPrices = [];
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId].outPrices) {
										consolidateOrder.consolidateObj.withoutSection[prId].outPrices = [];
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId].sum) {
										consolidateOrder.consolidateObj.withoutSection[prId].sum = [];
									}
									if (!consolidateOrder.consolidateObj.withoutSection[prId].inSum) {
										consolidateOrder.consolidateObj.withoutSection[prId].inSum = [];
									}
									consolidateOrder.consolidateObj.sections[section][prId].quantity += parseInt(quantity);
									consolidateOrder.consolidateObj.withoutSection[prId].quantity += parseInt(quantity);
									for (var i = 1; i <= parseInt(quantity); i++) {
										var data = {};
										data[parseInt(consolidateData[orderId].products[prId].inSum)] =  parseInt(consolidateData[orderId].products[prId].outSum);
										consolidateOrder.consolidateObj.sections[section][prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
										consolidateOrder.consolidateObj.sections[section][prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
										consolidateOrder.consolidateObj.sections[section][prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
										consolidateOrder.consolidateObj.sections[section][prId].sum.push(data);
										consolidateOrder.consolidateObj.withoutSection[prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
										consolidateOrder.consolidateObj.withoutSection[prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
										data = {};
										data[parseInt(consolidateData[orderId].products[prId].inSum)] = parseInt(consolidateData[orderId].products[prId].outSum);
										consolidateOrder.consolidateObj.withoutSection[prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
										consolidateOrder.consolidateObj.withoutSection[prId].sum.push(data);
									}
								});
							});
						}
					});
				}
				$.each(obj.products, function (prId, obj) {
					if (!consolidateOrder.consolidateObj.productsDetails[prId]) {
						consolidateOrder.consolidateObj.productsDetails[prId] = {};
					}
					consolidateOrder.consolidateObj.productsDetails[prId].article = obj.article;
					consolidateOrder.consolidateObj.productsDetails[prId].productName = obj.productName;
				});
			});
			if (consolidateOrder.consolidateObj.sections) {
				$.each(consolidateOrder.consolidateObj.sections, function (name, obj) {
					if ('out' === name) {
						$(consolidateOrder.buildConsolidateAverageOrderTr(obj, 'withoutSectionRow orderRow consAverageTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
						$(consolidateOrder.buildConsolidateOrderTr(obj, 'withoutSectionRow orderRow consTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
					} else {
						$('<tr class="orderTableSectionName" name="' + name + '"><th colspan="9">' + name + '</th></tr>').insertBefore('#orderWrapperFromTree .withoutSectionInOrderTable');
						$(consolidateOrder.buildConsolidateAverageOrderTr(obj, 'orderTableSection orderRow consAverageTr')).insertAfter('[name="' + name + '"]');
						$(consolidateOrder.buildConsolidateOrderTr(obj, 'orderTableSection orderRow consTr')).insertAfter('[name="' + name + '"]');
					}
				});
				$(consolidateOrder.buildConsolidateAverageOrderTr(consolidateOrder.consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionAverageTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
				$(consolidateOrder.buildConsolidateOrderTr(consolidateOrder.consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');

			}
		},
		buildConsolidateAverageOrderTr: function (obj, trClass) {
			var count = 1, rows = $();
			$.each(obj, function (prId, prObj) {
				var product = consolidateOrder.consolidateObj.productsDetails[prId];
				var inPricesSum = 0;
				var outPricesSum = 0;
				var quantity = prObj.sum.length;
				$.map(prObj.sum, function(obj) {
					inPricesSum += parseInt(_.keys(obj)[0]);
					outPricesSum += parseInt(obj[_.keys(obj)[0]]);
				});
				var inPrice = (inPricesSum / quantity).toFixed(2);
				var outPrice = (outPricesSum / quantity).toFixed(2);
				rows.push.apply(rows, consolidateOrder.buildConsOrderTr(trClass, count, product.article, product.productName, parseInt(prObj.quantity), inPrice, outPrice));
				count++;
			});
			return rows;
		},
		buildConsolidateOrderTr: function (obj, trClass) {
			var rows = $();
			var count = 1;
			$.each(obj, function (prId, prObj) {
				var product = consolidateOrder.consolidateObj.productsDetails[prId];
				var sumRes = {};
				var sum = _.clone(prObj.sum);
				$.map(sum, function(obj) {
					var temp = _.clone(sum[0]);
					var quantity = 1;
					sum.splice(0, 1);
					var compare = _.clone(sum);
					$.map(compare, function(iObj){
						if (parseInt(_.keys(iObj)[0]) === parseInt(_.keys(temp)[0]) && parseInt(iObj[_.keys(iObj)[0]]) === parseInt(temp[_.keys(temp)[0]])) {
							quantity++;
							sum.splice(0, 1);
						}
					});
					if (!sumRes[quantity]) {
						sumRes[quantity] = [];
					}
					if (_.size(temp)) {
						sumRes[quantity].push(temp);
					}
				});
				$.each(sumRes, function(quantity, arr) {
					$.map(arr, function(obj) {
						var inPrice = parseInt(_.keys(obj)[0]);
						var outPrice = obj[inPrice];
						rows.push.apply(rows, consolidateOrder.buildConsOrderTr(trClass, count, product.article, product.productName, quantity, inPrice, outPrice));
						count++;
					});
				});
			});
			return rows;
		},
		buildConsOrderTr: function (trClass, count, article, productName, quantity, inPrice, outPrice) {
			var tr = $('<tr></tr>' ).addClass(trClass);
			tr.append('<td class="orderNumberTd">' + count + '</td><td class="orderArticleTd">' + article + '</td><td class="orderProductNameTd">' + productName + '</td>');
			tr.append('<td class="orderUnitOfMeasureTd">шт</td><td class="quantityInOrderTd">' + quantity + '</td><td class="inputPriceInOrder" data-uah="' + inPrice + '">' + inPrice + '</td>');
			tr.append('<td class="inputSumInOrder" data-uah="' + quantity * inPrice + '">' + quantity * inPrice + '</td>');
			tr.append('<td class="outputPriceInOrder" data-uah="' + outPrice + '">' + outPrice + '</td>');
			tr.append('<td class="outputSumInOrder" data-uah="' + quantity * outPrice + '">' + quantity * outPrice + '</td>');
			
			return tr;
		},
		consAveragePrices: function () {
			var $this = $(this);
			if ($this.hasClass('uniquePrices')) {
				$this.removeClass('uniquePrices');
				$this.text('Уникальные цены');
				if ($('#consRemoveSections').hasClass('showSections')) {
					$('.consTr, .consAverageTr, .consWithoutSectionTr').hide();
					$('.consWithoutSectionAverageTr').show();
					localStorage.consOrder = 'consWithoutSectionAverageTr';
				} else {
					$('.consTr, .consWithoutSectionTr, .consWithoutSectionAverageTr').hide();
					$('.consAverageTr').show();
					localStorage.consOrder = 'consAverageTr';
				}
			} else {
				$this.addClass('uniquePrices');
				$this.text('Средние цены');
				if ($('#consRemoveSections').hasClass('showSections')) {
					$('.consTr, .consAverageTr, .consWithoutSectionAverageTr').hide();
					$('.consWithoutSectionTr').show();
					localStorage.consOrder = 'consWithoutSectionTr';
				} else {
					$('.consAverageTr, .consWithoutSectionTr, .consWithoutSectionAverageTr').hide();
					$('.consTr').show();
					localStorage.consOrder = 'consTr';
				}
			}
		},
		consRemoveSections: function () {
			var $this = $(this);
			if ($this.hasClass('showSections')) {
				$this.removeClass('showSections');
				$this.text('Убрать разделы');
				$('.orderTableSectionName' ).show();
				setTimeout(function () {
					$('.orderTableSectionName').removeClass('skip');
				}, 10);
				if ($('#consAveragePrices').hasClass('uniquePrices')) {
					$('.consWithoutSectionTr, .consAverageTr, .consWithoutSectionAverageTr').hide();
					$('.consTr').show();
					localStorage.consOrder = 'consTr';
				} else {
					$('.orderTableSectionName' ).addClass('skip');
					$('.consWithoutSectionTr, .consTr, .consWithoutSectionAverageTr').hide();
					$('.consAverageTr').show();
					localStorage.consOrder = 'consAverageTr';
				}
			} else {
				$this.addClass('showSections');
				$this.text('Показать разделы');
				$('.orderTableSectionName' ).addClass('skip').hide();
				if ($('#consAveragePrices').hasClass('uniquePrices')) {
					$('.consAverageTr, .consTr, .consWithoutSectionAverageTr').hide();
					$('.consWithoutSectionTr').show();
					localStorage.consOrder = 'consWithoutSectionTr';
				} else {
					$('.consWithoutSectionTr, .consTr, .consAverageTr').hide();
					$('.consWithoutSectionAverageTr').show();
					localStorage.consOrder = 'consWithoutSectionAverageTr';
				}
			}
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
				}
			} );
		},
        handler: function () {
			$('[data-toggle="tooltip"]').tooltip({ my: "left+15 center", at: "right center" });
			
            $('#hideShowClietsTree').click(function() {
                methods.toggleTreeDisplay('.totalClientsTreeWrapper', '#hideShowClietsTree');
				if ($('#fileManagerOrdersWrapper .totalClientsTreeWrapper').hasClass('hiddenTree')) {
					$('#fileManagerOrdersWrapper #orderFromTree').removeClass('col-md-8').addClass('col-md-12');
				} else {
					$('#fileManagerOrdersWrapper #orderFromTree').removeClass('col-md-12').addClass('col-md-8');
				}
            });
			
			$('#FMconsolidatedOrdersBtn').click(consolidateOrder.createConsolidateOrder);
			
			$('#findInClietsTree').keyup(findInClietsTree);
			
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
				.on('click', '#deleteOrder', orders.deleteOrder)
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
				.on('click', '.moveToCopyTo', orders.moveToCopyTo)
				.on('click', '.removeOrderRow', orders.removeOrderRow)
				.on('click', '#consAveragePrices', consolidateOrder.consAveragePrices)
				.on('click', '#consRemoveSections', consolidateOrder.consRemoveSections);
        }
    };

    return CLIENTS_TREE;
});