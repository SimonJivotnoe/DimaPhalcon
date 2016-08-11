define([], function () {'use strict'; var
	CONSOLIDATE = {
		consolidateObj: {
			sections: {},
			withoutSection: {},
			productsDetails: {}
		},
		buildConsolidateOrder: function (consolidateData) {
			CONSOLIDATE.consolidateObj = {
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
									if (!CONSOLIDATE.consolidateObj.sections[section]) {
										CONSOLIDATE.consolidateObj.sections[section] = {};
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId]) {
										CONSOLIDATE.consolidateObj.sections[section][prId] = {};
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId].quantity) {
										CONSOLIDATE.consolidateObj.sections[section][prId].quantity = 0;
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId].inPrices) {
										CONSOLIDATE.consolidateObj.sections[section][prId].inPrices = [];
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId].outPrices) {
										CONSOLIDATE.consolidateObj.sections[section][prId].outPrices = [];
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId].sum) {
										CONSOLIDATE.consolidateObj.sections[section][prId].sum = [];
									}
									if (!CONSOLIDATE.consolidateObj.sections[section][prId].inSum) {
										CONSOLIDATE.consolidateObj.sections[section][prId].inSum = [];
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId]) {
										CONSOLIDATE.consolidateObj.withoutSection[prId] = {};
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId].quantity) {
										CONSOLIDATE.consolidateObj.withoutSection[prId].quantity = 0;
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId].inPrices) {
										CONSOLIDATE.consolidateObj.withoutSection[prId].inPrices = [];
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId].outPrices) {
										CONSOLIDATE.consolidateObj.withoutSection[prId].outPrices = [];
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId].sum) {
										CONSOLIDATE.consolidateObj.withoutSection[prId].sum = [];
									}
									if (!CONSOLIDATE.consolidateObj.withoutSection[prId].inSum) {
										CONSOLIDATE.consolidateObj.withoutSection[prId].inSum = [];
									}
									CONSOLIDATE.consolidateObj.sections[section][prId].quantity += parseInt(quantity);
									CONSOLIDATE.consolidateObj.withoutSection[prId].quantity += parseInt(quantity);
									for (var i = 1; i <= parseInt(quantity); i++) {
										var data = {};
										data[parseInt(consolidateData[orderId].products[prId].inSum)] =  parseInt(consolidateData[orderId].products[prId].outSum);
										CONSOLIDATE.consolidateObj.sections[section][prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
										CONSOLIDATE.consolidateObj.sections[section][prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
										CONSOLIDATE.consolidateObj.sections[section][prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
										CONSOLIDATE.consolidateObj.sections[section][prId].sum.push(data);
										CONSOLIDATE.consolidateObj.withoutSection[prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
										CONSOLIDATE.consolidateObj.withoutSection[prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
										data = {};
										data[parseInt(consolidateData[orderId].products[prId].inSum)] = parseInt(consolidateData[orderId].products[prId].outSum);
										CONSOLIDATE.consolidateObj.withoutSection[prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
										CONSOLIDATE.consolidateObj.withoutSection[prId].sum.push(data);
									}
								});
							});
						}
					});
				}
				$.each(obj.products, function (prId, obj) {
					if (!CONSOLIDATE.consolidateObj.productsDetails[prId]) {
						CONSOLIDATE.consolidateObj.productsDetails[prId] = {};
					}
					CONSOLIDATE.consolidateObj.productsDetails[prId].article = obj.article;
					CONSOLIDATE.consolidateObj.productsDetails[prId].productName = obj.productName;
				});
			});
			if (CONSOLIDATE.consolidateObj.sections) {
				$.each(CONSOLIDATE.consolidateObj.sections, function (name, obj) {
					if ('out' === name) {
						$(CONSOLIDATE.buildConsolidateAverageOrderTr(obj, 'withoutSectionRow orderRow consAverageTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
						$(CONSOLIDATE.buildConsolidateOrderTr(obj, 'withoutSectionRow orderRow consTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
					} else {
						$('<tr class="orderTableSectionName" name="' + name + '"><th colspan="9">' + name + '</th></tr>').insertBefore('#orderWrapperFromTree .withoutSectionInOrderTable');
						$(CONSOLIDATE.buildConsolidateAverageOrderTr(obj, 'orderTableSection orderRow consAverageTr')).insertAfter('[name="' + name + '"]');
						$(CONSOLIDATE.buildConsolidateOrderTr(obj, 'orderTableSection orderRow consTr')).insertAfter('[name="' + name + '"]');
					}
				});
				$(CONSOLIDATE.buildConsolidateAverageOrderTr(CONSOLIDATE.consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionAverageTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');
				$(CONSOLIDATE.buildConsolidateOrderTr(CONSOLIDATE.consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionTr')).insertAfter('#orderWrapperFromTree .withoutSectionInOrderTable');

			}
		},
		buildConsolidateAverageOrderTr: function (obj, trClass) {
			var count = 1, rows = $();
			$.each(obj, function (prId, prObj) {
				var product = CONSOLIDATE.consolidateObj.productsDetails[prId];
				var inPricesSum = 0;
				var outPricesSum = 0;
				var quantity = prObj.sum.length;
				$.map(prObj.sum, function(obj) {
					inPricesSum += parseInt(_.keys(obj)[0]);
					outPricesSum += parseInt(obj[_.keys(obj)[0]]);
				});
				var inPrice = (inPricesSum / quantity).toFixed(2);
				var outPrice = (outPricesSum / quantity).toFixed(2);
				rows.push.apply(rows, CONSOLIDATE.buildConsOrderTr(trClass, count, product.article, product.productName, parseInt(prObj.quantity), inPrice, outPrice));
				count++;
			});
			return rows;
		},
		buildConsolidateOrderTr: function (obj, trClass) {
			var rows = $();
			var count = 1;
			$.each(obj, function (prId, prObj) {
				var product = CONSOLIDATE.consolidateObj.productsDetails[prId];
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
						rows.push.apply(rows, CONSOLIDATE.buildConsOrderTr(trClass, count, product.article, product.productName, quantity, inPrice, outPrice));
						count++;
					});
				});
			});
			return rows;
		},
		buildConsOrderTr: function (trClass, count, article, productName, quantity, inPrice, outPrice) {
			var tr = $('<tr></tr>' ).addClass(trClass);
			tr.append('<td class="orderNumberTd">' + count + '</td><td class="orderArticleTd">' + article + '</td><td class="orderProductNameTd">' + productName + '</td>');
			tr.append('<td class="quantityInOrderTd">' + quantity + '</td><td class="inputPriceInOrder" data-uah="' + inPrice + '">' + inPrice + '</td>');
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
		}
	};
	
	return CONSOLIDATE;
});