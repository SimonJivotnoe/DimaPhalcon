define(['store', 'pdfmake'], function (store, pdfMake) {'use strict'; var
	buildOrderDetailsPDF = function () {
		var i = -1;
		var tempObj = {widths: [ '50%', '50%' ],table: {body: []}, layout: 'noBorders', fontSize: 11};
		var tbody = tempObj.table.body; 
		var tempDetArr = [];
		var $orderDetailsWrapperFromTree = $('#orderDetailsWrapperFromTree');
		if ($orderDetailsWrapperFromTree.find('input').length) {
			$.each($orderDetailsWrapperFromTree.find('input:checked'), function(num, input) {
				var $input = $(input);
				if ($input.prop('checked')) {
					tempDetArr.push($input.attr('data-name') + $input.attr('data-val'));
					i++;
					if ((0 < i && 1 === (i % 2)) || num === $orderDetailsWrapperFromTree.find('input:checked').length - 1) {
						tbody.push(tempDetArr);
						tempDetArr = [];
					}
				}
			});
		}
		if (0 === tbody.length) {
			tbody.push(['','']);
		}
		if (1 === tbody[tbody.length - 1].length) {
			tbody[tbody.length - 1].push('');
		}
		return tempObj;
	},
	getExtendedOrderMap = function () {
		var res = {};
		res.out = [];			
		var name,
			extraClass = '';
		if (store.get('consOrder')) {
			extraClass = ' ' + store.get('consOrder');
		}
		$.each($('#orderTable tr'), function(key, val) {
			switch ($(val).attr('class')) {
				case 'skip':
					break;
				case 'orderTableSectionName':
					name = $(val).attr('name');
					res[name] = [];
					break;
				case 'orderTableSection orderRow' + extraClass:
					var obj = {}, data = {};
					$.each($('td', val), function(k, v) {
						if ('orderTableActions' !== $(v).attr('class')) {
							if (!extraClass) {
								if ('quantityInOrderTd' === $(v).attr('class')) {
									data[$(v).attr('class')] = $('input', v).val();
								} else {
									data[$(v).attr('class')] = $(v).text();
								}
							} else {
								data[$(v).attr('class')] = $(v).text();
							}
						}
					});
					res[name].push(data);
					break;
				case 'withoutSectionRow orderRow' + extraClass:
					var obj = {}, data = {};
					$.each($('td', val), function(k, v) {
						if ('orderTableActions' !== $(v).attr('class')) {
							if (!extraClass) {
								if ('quantityInOrderTd' === $(v).attr('class')) {
									data[$(v).attr('class')] = $('input', v).val();
								} else {
									data[$(v).attr('class')] = $(v).text();
								}
							} else {
								data[$(v).attr('class')] = $(v).text();
							}
						}
					});
					res.out.push(data);
					break;
				default:
					break;
			}
		});
		return res;
	},
	PDF = {
		saveOrderToPDF: function () {
			var orderName = $('#createPDF').attr('data-order-article');
			var pdfName = orderName + '.pdf';
			if (!pdfName) {
				pdfName = 'Ордер.pdf';
			}
			var content = [{
					text: 'Счет-фактура №' + orderName,
					style: 'header',
					alignment: 'center',
					margin: [0, 0, 0, 50]
				}
			];

			content.push(buildOrderDetailsPDF());

			var tempObj = {
				table: {
					body: [[]]
				},
				margin: [0, 30, 0, 30],
				alignment: 'center',
				style: {fontSize: 11}
			};
			var checkedOrderHead = [];
			var body = tempObj.table.body;
			var preWidths = [];

			$.each($('#orderHeadChecks input'), function(num, obj) {
				var thText = $(obj).attr('data-head');
				var thName = $(obj).attr('name');
				var check = $(obj).prop('checked');
				var width = $(obj).closest('th').width();
				if (check) {
					body[0].push({ text: thText, style: {bold: true, fontSize: 11, color: 'black'} });
					checkedOrderHead.push(thName);
					preWidths.push(width);
				}
				if (num === $('#orderHeadChecks input').length - 1) {
					content.push(_.clone(tempObj));
				}
			});

			tempObj.table.widths = [];
			var hundredWidth  =_.reduce(preWidths, function(memo, num){ return memo + num; }, 0);
			$.each(preWidths, function (num, px) {
				tempObj.table.widths.push(px / hundredWidth * 100 + '%');
			});
			var totalProducts = 0;
			var totalQuantity = 0;
			var orderMap = getExtendedOrderMap();
			$.each(orderMap, function (section, arr) {
				if ('out' !== section) {
					body.push(
						[
							{
								text: section,
								colSpan: checkedOrderHead.length,
								alignment: 'center'
							}
						]
					);
					$.each(arr, function (id, obj) {
						var tr = [];
						totalProducts++;
						$.each(obj, function (td, text) {
							if (-1 !== checkedOrderHead.indexOf(td)) {
								if ('orderProductNameTd' === td) {
									tr.push({text: text, alignment: 'left'});
								} else {
									tr.push(text);
								}
								if ('quantityInOrderTd' === td) {
									totalQuantity += parseInt(text);
								}
							}
						});
						body.push(tr);
					});
				}
			});
			$.each(orderMap, function (section, arr) {
				if ('out' === section) {
					body.push(
						[
							{
								text: '\n',
								colSpan: checkedOrderHead.length,
								alignment: 'center'
							}
						]
					);
					$.each(arr, function (id, obj) {
						var tr = [];
						totalProducts++;
						$.each(obj, function (td, text) {
							if (-1 !== checkedOrderHead.indexOf(td)) {
								if ('orderProductNameTd' === td) {
									tr.push({text: text, alignment: 'left'});
								} else {
									tr.push(text);
								}
								if ('quantityInOrderTd' === td) {
									totalQuantity += parseInt(text);
								}
							}
						});
						body.push(tr);
					});
				}
			});
			content.push({
				table: {
					body: [
						[{text: 'Итого: ', style: {bold: true}}, {text: $('#orderSum' ).text()}],
						[{text: 'Сумма с дисконтом: ', style: {bold: true}}, {text: $('#orderSumWithDiscount' ).text()}],
						[{text: 'Количество изделий: ', style: {bold: true}}, {text: '' + totalQuantity + 'шт'}]
					],
					alignment: 'right'
				},
				margin: [315, 20, 0, 0],
				layout: 'noBorders'
			});
			var docDefinition = {
				//pageOrientation: 'landscape',
				//pageMargins: [ 20, 5, 20, 0 ],
				content: content,
				styles: {
					header: {
						fontSize: 20,
						bold: true
					},
					subheader: {
						fontSize: 12,
						bold: true
					},
					tableHeader: {
						bold: true,
						fontSize: 12,
						color: 'black'
					}
				},
				defaultStyle: {
					columnGap: 50
				}
			};
			pdfMake.createPdf(docDefinition).download(pdfName);
		},  
	};
   
   return PDF;
});