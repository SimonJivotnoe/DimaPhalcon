;(function(global, $) {
	
	// 'new' an object
	var Dima = function(firstName, lastName, language) {
		return new Dima.init(firstName, lastName, language);
	};

	// url's
	var URL = {
		BASE: 'http://DimaPhalcon/DimaPhalcon/',
		TABS: 'tabs/',
		CATEG: 'categories/',
		ORDER: 'order/',
		KIM: 'kim/',
		METALLS: 'metalls/',
		PRODUCT: 'products/',
		MENU: 'menu/',
		THEMES: 'themes/',
		LOCATION: 'http://DimaPhalcon/DimaPhalcon/'
	};

	var URL_TABS = URL.BASE + URL.TABS;

	var URL_CATEG = URL.BASE + URL.CATEG;

	var URL_ORDER = URL.BASE + URL.ORDER;

	var URL_KIM = URL.BASE + URL.KIM;

	var URL_METALLS = URL.BASE + URL.METALLS;

	var URL_PRODUCT = URL.BASE + URL.PRODUCT;

	var URL_MENU = URL.BASE + URL.MENU;

	var URL_THEMES = URL.BASE + URL.THEMES;

	var LOCATION = URL.LOCATION;

	// alias to this Class
	var SELF;

	// alias to self.main
	var MAIN;

	// alias to self.tabs
	var TABS;

	// alias to self.product
	var PRODUCT;

	// alias to self.order
	var ORDER;

	// alias to self.categories
	var CATEGORIES;

	// alias to self.kim
	var KIM;

	// alias to self.metalls
	var METALLS;

	// alias to self.menu
	var MENU;
	
	// alias to self.preferences
	var PREFERENCES;

	// alias to self.validation
	var VALIDATION;

	// alias to self.themes
	var THEMES;
	// error messages obj
	var ERR = {
		ARTICLE: {
			emptyTable: ' Заполните поля таблицы продукта! ',
			checked: ' Нужно отметить от 2-х до 4-х значений в таблице! ',
			already: 'Такой артикул уже существует!',
			emptyName: ' Задайте имя продукта! '
		}
	};
	var preferencesSettings = [
		// GLOBAL
		{
			id: '#globalBodyColor',
			elem: 'body',
			style: 'backgroundColor',
			cssArr: ['body']
		},
		{
			id: '#globalFontColor',
			elem: 'body',
			style: 'color',
			cssArr: ['body']
		},
		{
			id: '#globalHRColor',
			elem: 'hr',
			style: 'border-color',
			cssArr: ['hr']
		},
		
		// TABS
		{
			id: '#prefTabFontColor',
			elem: '#myTab li a',
			style: 'color',
			cssArr: ['#myTab li a', '#rightTabs li a', '#testTab li a']
		},
		{
			id: '#prefActiveTabColor',
			elem: '#testTab .active a',
			style: 'backgroundColor',
			cssArr: ['#myTab .active a', '#rightTabs .active a', '#testTab .active a']
		},
		{
			id: '#prefInactiveTabColor',
			elem: '#testTab li:not(.active) a',
			style: 'backgroundColor',
			cssArr: ['#myTab li:not(.active) a', '#rightTabs li:not(.active) a', '#testTab li:not(.active) a']
		},
		
		// PRODUCTS
		{
			id: '#prefDynProductTableColor',
			elem: '#prefSortable li',
			style: 'backgroundColor',
			cssArr: ['#sortable li, #prefSortable li']
		},
		{
			id: '#prefProductTableColor',
			elem: '#prefAlwaysInTable li',
			style: 'backgroundColor',
			cssArr: ['#alwaysInTable li, #prefAlwaysInTable li']
		},
		{
			id: '#prefDynProductFontColor',
			elem: '#prefSortable li .prefRowNumber',
			style: 'color',
			cssArr: ['#prefSortable li .prefRowNumber', '#sortable li .rowNumber']
		},
		{
			id: '#prefProductFontColor',
			elem: '#prefAlwaysInTable li .prefRowNumber',
			style: 'color',
			cssArr: ['#prefAlwaysInTable li .prefRowNumber', '#alwaysInTable li .rowNumber']
		},
		{
			id: '#prefDynProductCellFontColor',
			elem: '#prefSortable li .prefRowNameInput',
			style: 'color',
			cssArr: ['#prefSortable li .prefRowNameInput', '#sortable li .rowNameInput']
		},
		{
			id: '#prefProductCellFontColor',
			elem: '#prefAlwaysInTable li .prefRowNameInput',
			style: 'color',
			cssArr: ['#prefAlwaysInTable li .prefRowNameInput', '#alwaysInTable li .rowNameInput']
		},
		{
			id: '#prefDynProductCellBackground',
			elem: '#prefSortable li .prefRowNameInput',
			style: 'backgroundColor',
			cssArr: ['#prefSortable li .prefRowNameInput', '#sortable li .rowNameInput'],
			important: true
		},
		{
			id: '#prefProductCellBackground',
			elem: '#prefAlwaysInTable li .prefRowNameInput',
			style: 'backgroundColor',
			cssArr: ['#prefAlwaysInTable li .prefRowNameInput', '#alwaysInTable li .rowNameInput']
		},
		{
			id: '#prefDynProductQuantityColor',
			elem: '#prefSortable li .refRowValueInput',
			style: 'color',
			cssArr: ['#prefSortable li .refRowValueInput', '#sortable li .rowValueInput']
		},
		{
			id: '#prefProductQuantityColor',
			elem: '#prefAlwaysInTable li .refRowValueInput',
			style: 'color',
			cssArr: ['#prefAlwaysInTable li .refRowValueInput', '#alwaysInTable li .rowValueInput']
		},
		{
			id: '#prefDynProductQuantityBackground',
			elem: '#prefSortable li .refRowValueInput',
			style: 'backgroundColor',
			cssArr: ['#prefSortable li .refRowValueInput', '#sortable li .rowValueInput']
		},
		{
			id: '#prefProductQuantityBackground',
			elem: '#prefAlwaysInTable li .refRowValueInput',
			style: 'backgroundColor',
			cssArr: ['#prefAlwaysInTable li .refRowValueInput', '#alwaysInTable li .rowValueInput']
		},
		
		// ORDERS
		{
			id: '#prefOrderHeadBackground',
			elem: '#prefOrderTable tr:not(.orderTableSectionName) th',
			style: 'backgroundColor',
			cssArr: ['#prefOrderTable tr:not(.orderTableSectionName) th', '#orderTable tr:not(.orderTableSectionName) th', '.sumOrderTableHead']
		},
		{
			id: '#prefOrderHeadBordersColor',
			elem: '#prefOrderTable tr:not(.orderTableSectionName) th',
			style: 'borderColor',
			cssArr: ['#prefOrderTable tr:not(.orderTableSectionName) th', '#orderTable tr:not(.orderTableSectionName) th', '.sumOrderTableHead']
		},
		{
			id: '#prefOrderHeadFontColor',
			elem: '#prefOrderTable tr:not(.orderTableSectionName) th',
			style: 'color',
			cssArr: ['#prefOrderTable tr:not(.orderTableSectionName) th', '#orderTable tr:not(.orderTableSectionName) th', '.sumOrderTableHead']
		},
		{
			id: '#prefOrderSectionBackground',
			elem: '.orderTableSectionName th',
			style: 'backgroundColor',
			cssArr: ['.orderTableSectionName th', '.withoutSectionInOrderTable th']
		},
		{
			id: '#prefOrderSectionBordersColor',
			elem: '.orderTableSectionName th',
			style: 'borderColor',
			cssArr: ['.orderTableSectionName th']
		},
		{
			id: '#prefOrderSectionFontColor',
			elem: '.orderTableSectionName th',
			style: 'color',
			cssArr: ['.orderTableSectionName th']
		},
		{
			id: '#prefOrderRowBackground',
			elem: '#prefOrderTable td',
			style: 'backgroundColor',
			cssArr: ['#prefOrderTable td', '#orderTable td', '.inputWithoutBorders', '.sumOrderTableTd']
		},
		{
			id: '#prefOrderRowBordersColor',
			elem: '#prefOrderTable td',
			style: 'borderColor',
			cssArr: ['#prefOrderTable td', '#orderTable td', '.sumOrderTableTd']
		},
		{
			id: '#prefOrderRowFontColor',
			elem: '#prefOrderTable td',
			style: 'color',
			cssArr: ['#prefOrderTable td', '#orderTable td', '.sumOrderTableTd']
		}
	];
	
	var clickOnFormulaInput = false;
	
	var spinnerSettings = {
		lines: 15 // The number of lines to draw
		, length: 0 // The length of each line
		, width: 10 // The line thickness
		, radius: 23 // The radius of the inner circle
		, scale: 1 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#000' // #rgb or #rrggbb or array of colors
		, opacity: 0 // Opacity of the lines
		, rotate: 0 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 2.2 // Rounds per second
		, trail: 47 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '50%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	};
	var spinnerLeft;
	var spinnerRight;
	var spinnerKim;
	
	// PRIVATE METHODS SECTION
	function run() {
		THEMES.getThemesList();
		spinnerLeft = new Spinner(spinnerSettings);
		spinnerRight = new Spinner(spinnerSettings);
		spinnerKim = new Spinner(spinnerSettings);
		spinnerLeft.spin(document.getElementById('leftTabsSpinner'));
		spinnerRight.spin(document.getElementById('rightTabsSpinner'));
		spinnerKim.spin(document.getElementById('kimSpinner'));
		var sector = localStorage.siteSector;
		if (!sector) {
			localStorage.siteSector = 'MENU';
			MENU.showMainMenu();
		} else {
			switch (sector) {
				case 'MENU':
					MENU.showMainMenu();
					break;
				case 'PR':
					MENU.runPreferences();
					break;
				case 'DB':
					MENU.runDB();
					break;
				case 'FM':
					break;
				case 'OR':
					MENU.runProductCreation();
					break;
				default:
					$('#runPR').click();
			}
		}
	}
	
	/*
	 * 
	 * @param {type} sourceObj
	 * @param {type} sourceKey
	 * @param {type} targetObj
	 * @param {type} targetKey
	 * @returns {undefined}
	 */
	function swap(sourceObj, sourceKey, targetObj, targetKey) {
		var temp = sourceObj[sourceKey];
		sourceObj[sourceKey] = targetObj[targetKey];
		targetObj[targetKey] = temp;
	};
	
	
	// TABS

	// PRODUCTS

	function createProductFromTemplate (obj, action) {
		var obj = (obj === undefined) ? obj = {prId: MAIN.productId, tab: 'new'} : obj;
		var action = (action === undefined) ? action = true : action;
		if ('currentTab' === $('#selectCreateproductWay').val()) {
			obj.tab = MAIN.curTabId;
		}
		$.ajax( {
			url   : URL_PRODUCT + 'createProductFromTemplate',
			method: 'POST',
			data: obj
		} ).then( function ( data )
		{
			console.log(data);
			if (true === data && action) {
				window.location.href = LOCATION;
			}
		});
	}
	/*
	 * 
	 * @returns {undefined}
	 */
	function cancelArticleBtn () {
		$('#createArticle').show();
		$('#cancelArticleBtn, #errorArticle' ).hide();
		$.each($('.checkToArticle'), function(key, val){
			if($(val).prop('checked')) {
				$(this).click();
			};
		});
		$('.checkToArticle, #saveArticle').hide();
		$('#productArticle' ).html('');
	}

	function recalculateArticleTable () {
		var selected = $('#metallHistorySelect option:selected');
		$('[data-cell="PR1"]' ).val(selected.attr('data-price'));
		$('[data-cell="PR2"]' ).val(selected.attr('data-outprice'));
		$('#calx' ).calx();
		$.each($('.rowValue input'), function(num, obj){
			var cell = $(obj).attr('data-cell');
			$('[data-cellarticle="' + cell + '"]').text($(obj).val());
		});
	}

	var orderPlaceholder = {
		"%FIO%": "",
		"%PROJECT_NAME%": "",
		"%APPEAL%": "",
		"%PROJECT_DESCR%": "",
		"%COMPANY_NAME%": "",
		"%ADDRES%": "",
		"%ACC_NUMBER%": "",
		"%CITY%": "",
		"%ESTIMATE%": "",
		"%DATE%": ""
	};

	var tempTable = {
		"%ROW_NUMBER%": "",
		"%ROW_NAME%": "",
		"%DATA_CELL%": "",
		"%DATA_FORMULA%": "",
		"%INPUT_VALUE%": ""
	};
	
	var notIncludeInCell = ['KIM1', 'PR1', 'SUM1', 'PR2', 'SUM2'];
	// ORDERS
	
	var consolidateObj = {
		sections: {},
		withoutSection: {},
		productsDetails: {}
	};
	/*
	 * 
	 * @param {type} map
	 * @param {type} refresh
	 * @returns {undefined}
	 */
	function saveOrderMap(map, refresh) {
		$.ajax( {
			url   : URL_MENU + 'saveOrderMap',
			method: 'POST',
			data: {map: map, orderId: MAIN.orderId}
		} ).then( function ( data )
		{
			if (data && refresh) {
				TABS.getRightTabContentTable(MAIN.orderId);
			}
		} );
	}
	
	/*
	 * 
	 * @returns {undefined}
	 */
	function setOrderSum () {
		var orderSum = 0;
		var currency = ' грн';
		$.each($('.outputSumInOrder'), function(num, obj) {
			orderSum += parseInt($(obj).text());
		});
		
		if ($('#orderCurrencyUSDToggle').hasClass('activeCurrency')) {
			currency = ' USD';
		}
		$('#orderSum').text(orderSum + currency);
		$('#orderSumWithDiscount').text(orderSum - orderSum * parseInt($('#changeDiscount').val())/100 + currency);
	}
	
	/*
	 * 
	 * @param {type} scope
	 * @param {type} area
	 * @param {type} dirr
	 * @returns {Array|Dima_L1.getOrderMap.res}
	 */
	function swapRows (scope, area, dirr) {
		var map = getOrderMap(),
			currentIndex = 	parseInt($(scope ).attr('data-number')),
			swapIndex;
		switch (dirr) {
			case 'up':
				swapIndex = currentIndex - 1;
				if (0 === currentIndex) {
					swapIndex = _.size(map[area]) - 1;
				}
				break;
			case 'down':
				swapIndex = currentIndex + 1;
				if ((_.size(map[area]) - 1) === currentIndex) {
					swapIndex = 0;
				}
				break;
		}
		swap(map[area], currentIndex, map[area], swapIndex);
		return map;
	}
	
	/*
	 * 
	 * @param {type} productId
	 * @returns {Number}
	 */
	function countProductInOrder (productId) {
		var count = 0;
		$.each(getOrderMap(), function (rowName, obj) {
			$.each(obj, function (num, object) {
				if (productId === _.keys(object)[0]) {
					count++;
				}
			});
		});
		return count;
	}
	
	/*
	 * 
	 * @param {type} scope
	 * @returns {undefined}
	 */
	function removeRowFromOrder (scope) {
		var productId = $(scope ).attr('name');
		if (1 >= countProductInOrder(productId)) {
			ORDER.removeFromOrder(productId);
		}
		$(scope ).closest('tr' ).remove();
		saveOrderMap(JSON.stringify(getOrderMap()), true);
	}
	
	function buildConsolidateOrder (consolidateData) {
		consolidateObj = {
			sections: {},
			withoutSection: {},
			productsDetails: {}
		};
		$.each(consolidateData, function (orderId, obj) {
			$.each(obj.map, function (section, secObj) {
				if (_.size(secObj)) {
					$.each(secObj, function (num, detSec) {
						$.each(detSec, function (prId, quantity) {
							if (!consolidateObj.sections[section]) {
								consolidateObj.sections[section] = {};
							}
							if (!consolidateObj.sections[section][prId]) {
								consolidateObj.sections[section][prId] = {};
							}
							if (!consolidateObj.sections[section][prId].quantity) {
								consolidateObj.sections[section][prId].quantity = 0;
							}
							if (!consolidateObj.sections[section][prId].inPrices) {
								consolidateObj.sections[section][prId].inPrices = [];
							}
							if (!consolidateObj.sections[section][prId].outPrices) {
								consolidateObj.sections[section][prId].outPrices = [];
							}
							if (!consolidateObj.sections[section][prId].sum) {
								consolidateObj.sections[section][prId].sum = [];
							}
							if (!consolidateObj.sections[section][prId].inSum) {
								consolidateObj.sections[section][prId].inSum = [];
							}
							if (!consolidateObj.withoutSection[prId]) {
								consolidateObj.withoutSection[prId] = {};
							}
							if (!consolidateObj.withoutSection[prId].quantity) {
								consolidateObj.withoutSection[prId].quantity = 0;
							}
							if (!consolidateObj.withoutSection[prId].inPrices) {
								consolidateObj.withoutSection[prId].inPrices = [];
							}
							if (!consolidateObj.withoutSection[prId].outPrices) {
								consolidateObj.withoutSection[prId].outPrices = [];
							}
							if (!consolidateObj.withoutSection[prId].sum) {
								consolidateObj.withoutSection[prId].sum = [];
							}
							if (!consolidateObj.withoutSection[prId].inSum) {
								consolidateObj.withoutSection[prId].inSum = [];
							}
							consolidateObj.sections[section][prId].quantity += parseInt(quantity);
							consolidateObj.withoutSection[prId].quantity += parseInt(quantity);
							for (var i = 1; i <= parseInt(quantity); i++) {
								var data = {};
								data[parseInt(consolidateData[orderId].products[prId].inSum)] =  parseInt(consolidateData[orderId].products[prId].outSum);
								consolidateObj.sections[section][prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
								consolidateObj.sections[section][prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
								consolidateObj.sections[section][prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
								consolidateObj.sections[section][prId].sum.push(data);
								consolidateObj.withoutSection[prId].inPrices.push(parseInt(consolidateData[orderId].products[prId].inPrice));
								consolidateObj.withoutSection[prId].outPrices.push(parseInt(consolidateData[orderId].products[prId].outPrice));
								data = {};
								data[parseInt(consolidateData[orderId].products[prId].inSum)] = parseInt(consolidateData[orderId].products[prId].outSum);
								consolidateObj.withoutSection[prId].inSum.push(parseInt(consolidateData[orderId].products[prId].inSum));
								consolidateObj.withoutSection[prId].sum.push(data);
							}
						});
					});
				}
			});
			$.each(obj.products, function (prId, obj) {
				if (!consolidateObj.productsDetails[prId]) {
					consolidateObj.productsDetails[prId] = {};
				}
				consolidateObj.productsDetails[prId].article = obj.article;
				consolidateObj.productsDetails[prId].productName = obj.productName;
			});
		});
		$('#addNewSection').parent().remove();
		if (consolidateObj.sections) {
			$.each(consolidateObj.sections, function (name, obj) {
				if ('out' === name) {
					$(buildConsolidateAverageOrderTr(obj, 'withoutSectionRow orderRow consAverageTr')).insertAfter('.withoutSectionInOrderTable');
					$(buildConsolidateOrderTr(obj, 'withoutSectionRow orderRow consTr')).insertAfter('.withoutSectionInOrderTable');
				} else {
					$('<tr class="orderTableSectionName" name="' + name + '"><th colspan="9">' + name + '</th></tr>').insertBefore('.withoutSectionInOrderTable');
					$(buildConsolidateAverageOrderTr(obj, 'orderTableSection orderRow consAverageTr')).insertAfter('[name="' + name + '"]');
					$(buildConsolidateOrderTr(obj, 'orderTableSection orderRow consTr')).insertAfter('[name="' + name + '"]');
				}
			});
			$(buildConsolidateAverageOrderTr(consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionAverageTr')).insertAfter('.withoutSectionInOrderTable');
			$(buildConsolidateOrderTr(consolidateObj.withoutSection, 'withoutSectionRow orderRow consWithoutSectionTr')).insertAfter('.withoutSectionInOrderTable');

		}
	}
	
	function buildConsolidateAverageOrderTr (obj, trClass) {
		var count = 1, rows = $();
		$.each(obj, function (prId, prObj) {
			var product = consolidateObj.productsDetails[prId];
			var inPricesSum = 0;
			var outPricesSum = 0;
			var quantity = prObj.sum.length;
			$.each(prObj.sum, function(num, obj) {
				inPricesSum += parseInt(_.keys(obj)[0]);
				outPricesSum += parseInt(obj[_.keys(obj)[0]]);
			});
			var inPrice = (inPricesSum / quantity).toFixed(2);
			var outPrice = (outPricesSum / quantity).toFixed(2);
			rows.push.apply(rows, buildConsOrderTr(trClass, count, product.article, product.productName, parseInt(prObj.quantity), inPrice, outPrice));
			count++;
		});
		return rows;
	}

	function buildConsolidateOrderTr (obj, trClass) {
		var rows = $();
		var count = 1;
		$.each(obj, function (prId, prObj) {
			var product = consolidateObj.productsDetails[prId];
			var sumRes = {};
			var sum = _.clone(prObj.sum);
			$.each(sum, function(num, obj) {
				var temp = _.clone(sum[0]);
				var quantity = 1;
				sum.splice(0, 1);
				var compare = _.clone(sum);
				$.each(compare, function(i, iObj){
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
				$.each(arr, function(num, obj) {
					var inPrice = parseInt(_.keys(obj)[0]);
					var outPrice = obj[inPrice];
					rows.push.apply(rows, buildConsOrderTr(trClass, count, product.article, product.productName, quantity, inPrice, outPrice));
					count++;
				});
			});
		});
		return rows;
	}
	
	function buildConsOrderTr (trClass, count, article, productName, quantity, inPrice, outPrice) {
		var tr = $('<tr></tr>' ).addClass(trClass);
		tr.append('<td class="orderNumberTd">' + count + '</td><td class="orderArticleTd">' + article + '</td><td class="orderProductNameTd">' + productName + '</td>');
		tr.append('<td class="orderUnitOfMeasureTd">шт</td><td class="quantityInOrderTd">' + quantity + '</td><td class="inputPriceInOrder" data-uah="' + inPrice + '">' + inPrice + '</td>');
		tr.append('<td class="inputSumInOrder" data-uah="' + quantity * inPrice + '">' + quantity * inPrice + '</td>');
		tr.append('<td class="outputPriceInOrder" data-uah="' + outPrice + '">' + outPrice + '</td>');
		tr.append('<td class="outputSumInOrder" data-uah="' + quantity * outPrice + '">' + quantity * outPrice + '</td>');
		return tr;
	}

	function buildOrderDetailsPDF () {
		var i = -1;
		var tempObj = {widths: [ '50%', '50%' ],table: {body: []}, layout: 'noBorders', fontSize: 11};
		var body = tempObj.table.body; 
		var tempDetArr = [];
		$.each($('.orderDetailsItem'), function(num, obj) {
			var itemText = $(obj).find('label').text();
			var itemName = $(obj).find('label input').attr('name');
			var check = $(obj).find('label input').prop('checked');
			var itemDetails = $(obj).find('.inputOrderDetails').val();
			if (check) {
				if ('orderNumber' === itemName) {
					tempDetArr.push(itemText + $('[aria-controls=' + MAIN.curTabRightId + ']').find('.tabNameRight').text());
				} else {
					tempDetArr.push(itemText + itemDetails);
				}
				i++;
			}
			if ((0 < i && 1 === (i % 2)) || num === $('.orderDetailsItem').length - 1) {
				body.push(tempDetArr);
				tempDetArr = [];
			}
		});
		if (1 === body[body.length - 1].length) {
			body[body.length - 1].push('');
		}
		return tempObj;
	}
	
	/*
	 * 
	 * @returns {undefined}
	 */
	function saveOrderToPDF () {
		var orderName = $('[aria-controls=' + MAIN.curTabRightId + ']').find('.tabNameRight').text();
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
	}
	
	/*
	 * logging errors
	 * @param {type} php
	 * @returns {undefined}
	 */
	function log(php) {
		if('undefined' !== typeof(console)) {
			console.error('ERROR in ' + php);
		}
	}
	
	/*
	 * show body
	 *
	 * @returns {boolean}
	 */
	function showBody() {
		PREFERENCES.applyCss();
		if ($('body').is(":visible")) {
			return false;
		}
		$('body' ).fadeIn(350);
		return true;
	}

	/**
	 * editing kim table
	 *
	 * @param obj
	 * @param scope
	 */
	function kimEditOver(obj, scope) {
		$('.glyphicon-pencil', scope)
			.removeClass(obj.pencilRemove)
			.addClass(obj.pencilAdd);
		$('.glyphicon-remove', scope)
			.removeClass(obj.removeRemove)
			.addClass(obj.removeAdd);
	}

	// change active tab method
	function changeActiveTab(obj) {
		var scope = obj.scope,
			selectedTabId = $(scope ).attr('aria-controls'),
			curTabId = obj.curTabId,
			tabsList = obj.tabsList,
			tabId, prodId, orderId;

		if ('' !== MAIN[curTabId]) {
			MAIN[tabsList][MAIN[curTabId]].active = '0';
		}

		if (MAIN[curTabId] !== selectedTabId && undefined !== selectedTabId){
			tabId = $(scope ).find('.glyphicon-remove' ).attr('name' );
			prodId = $(scope ).attr('name');
			MAIN[tabsList][selectedTabId].active = '1';
			if (obj.hasOwnProperty('order')) {
				orderId = $(scope ).attr('data-order');
				TABS.getRightTabContentOrderDetails(orderId, selectedTabId);
				TABS.getRightTabContentTable(orderId);
			} else {
				TABS[obj.getTabContent](prodId, selectedTabId);
			}

			TABS[obj.changeActiveTab](tabId, selectedTabId, obj.action);
		}
	}

	function editDescriptionOfProduct(bool) {
		var obj = {};

		$('.nameOfProduct, .listOfCategories, .listOfKim, .listOfMetalls' ).prop('disabled', bool );

		if (!bool) {
			return true;
		}

		obj.prName = $('.nameOfProduct' ).val(),
		obj.categoryId = $('.listOfCategories option:selected' ).attr('name' ),
		obj.kimId = $('.listOfKim option:selected' ).attr('name' ),
		obj.metallId = $('.listOfMetalls option:selected' ).attr('name');

		return obj;
	}

	function getOrderMap() {
		var res = {};
		res.out = [];
		var name;
		$.each($('#orderTable tr'), function(key, val) {
			switch ($(val ).attr('class')) {
				case 'skip':
					break;
				case 'orderTableSectionName':
					name = $(val ).attr('name');
					res[name] = [];
					break;
				case 'orderTableSection orderRow':
					var productId = $(val ).attr('name' ),
						obj = {};
					$.each($('td', val), function(k, v) {
						if ('quantityInOrderTd' === $(v).attr('class')) {
							obj[productId] = $('input', v).val();
							res[name].push(obj);
						}
					});
					break;
				case 'withoutSectionRow orderRow':
					var productId = $(val ).attr('name' ),
						obj = {};
					$.each($('td', val), function(k, v) {
						if ('quantityInOrderTd' === $(v).attr('class')) {
							obj[productId] = $('input', v).val();
							res.out.push(obj);
						}
					});
					break;
				default:
					break;
			}
		});
		return res;
	}
	
	function getExtendedOrderMap() {
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
	}

	function enableDisableButton (id, button) {
		if (0 < id.size()) {
			if (button.prop('disabled')) {
				button.prop('disabled', false);
			}
		} else {
			button.prop('disabled', true);
		}
	}
	
	function addLeftTabContentHandler(html) {
		//console.log(html.find('#addFormulaBtnPr' ));
		html
			.find('#uploadImageProduct').click(function (e) {
				$('#input-file-upload').trigger('click');
			}).end()
			
			.find('#input-file-upload').change(function () {
				if(!window.File || !window.FileReader || !window.FileList || !window.Blob){
					window.alert("Can't upload! Your browser does not support File API!");
					return;
				}
				
				var fileReader = new FileReader();
				var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
				if (this.files.length == 0) {
					window.alert('Нужно выбрать файл');
					return;
				}
				var file = this.files[0];
				var size = file.size;
				var type = file.type;

				if (!filter.test(type)) {
					window.alert('Формат файла не поддерживается');
					return;
				}
				
				var max = 2000000;
				if (size > max) {
					window.alert('Файл больше чем 2 MB');
					return;
				}
				
				$('.upload-image').show();
				
				$('#uploadImageProduct').hide();
				
				var formData = new FormData();
				formData.append('image_data', file);
				$.ajax({
					type: 'POST',
					processData: false,
					contentType: false,
					url: URL_PRODUCT + 'uploadImage/' + MAIN.productId,
					data: formData,
					dataType: 'json',
					success: function(data) {
						$('.upload-image').hide();
						$('#uploadImageProduct, #productPicture').show();
						if (data) {
							TABS.getLeftTabContent(MAIN.productId, MAIN.curTabId);
						}
					}
				});
			}).end()
			
			// edit & save categories list content
			.filter('.blockNameAndCat')
				.mouseover(function(){
					$('#editCategoriesListContent' ).show();
				})
				.mouseleave(function(){
					$('#editCategoriesListContent' ).css('display', 'none');
				} ).end()

				.filter('.tableContent')
				.mouseover(function(){
					$('#editTableContent' ).show();
				})
				.mouseleave(function(){
					$('#editTableContent' ).css('display', 'none');
				} ).end()

			// edit Categories list of Product
			.on('click', '#editCategoriesListContent', function(){
				cancelArticleBtn();
				$(this ).attr({
					class: 'glyphicon glyphicon-floppy-disk',
					id: 'saveCategoriesListContent'
				});
				editDescriptionOfProduct(false);
			} )
			
			// save Categories list of Product
			.on('click', '#saveCategoriesListContent', function(){
				var obj;
				$(this ).attr({
					class: 'glyphicon glyphicon-pencil leftTable',
					id: 'editCategoriesListContent'
				});
				obj = editDescriptionOfProduct(true);
				if ('' === obj.prName) {
					obj.prName = 'Новое изделие';
					$(MAIN.curTabName).text('Новое изделие');
				}
				TABS.changeTabName(obj);
				PRODUCT.saveTable();
			})

			.find('#createArticle' ).click(function(){
				var check = 0,
					rowValueInput,
					categoryArticle = $('.listOfCategories option:selected').attr('article'),
					metallArticle = $('.listOfMetalls option:selected').attr('article');
				$('#saveCategoriesListContent, #saveTableContent').click();	
				$('#productArticle' ).html(categoryArticle + metallArticle);
				$.each($('.checkToArticle'), function(k, v){
					rowValueInput = $(v).closest('li').find('.rowValueInput');
					if(rowValueInput.val()) {
						check++;
						$(this).show();
					}
				});
				if (check) {
					$('#saveArticle, #cancelArticleBtn').show();
					$('#errorArticle' ).hide();
					$(this ).hide();
				} else {
					$('#errorArticle' ).text(ERR.ARTICLE.emptyTable).show();
					setTimeout(function(){ $('#errorArticle' ).text('').hide('slow'); }, 2000);
				}

			}).end()

			.find('#saveArticle' ).click(function(){
				var checkCount = 0,
					check = true,
					productName = true,
					rowValueInput,
					errorMessage = '';
				$.each($('.checkToArticle'), function(k, v){
					rowValueInput = $(v).closest('li').find('.rowValueInput');
					if ($(v ).prop('checked')) {
						checkCount++;
					}
				});
				if (!$('.nameOfProduct').val()) {
					productName = false;
					errorMessage += ERR.ARTICLE.emptyName;
				}
				if (2 > checkCount || 4 < checkCount) {
					check = false;
					errorMessage += ERR.ARTICLE.checked;
				}
				if (check && productName) {
					if ($('#saveInDB').size()) {
						
					}
					PRODUCT.saveArticleOfProduct($('#productArticle').text());
				} else {
					$('#errorArticle' ).text(errorMessage).show();
					setTimeout(function(){ $('#errorArticle' ).text('').hide('slow'); }, 2000);
				}
			}).end()

			.find('#cancelArticleBtn').click(cancelArticleBtn).end()
			
			.find('#metallHistorySelect').change(recalculateArticleTable).end()
	
			.on('change', '.checkToArticle', function(){
				var val = $(this ).closest('li' ).find('.rowValueInput' ).val(),
					cell = $(this ).closest('li' ).find('.rowNumber' ).text(),
					appendSpan;
				if ($(this).prop('checked')) {
					if (val) {
						appendSpan = $('<span articlepart="' + cell +'" style="display: none;">' +
							VALIDATION.validateInputVal({val: val, digitsOnly: true}) + '</span>');
						$('#productArticle' ).append(appendSpan);
						appendSpan.show('slow');

					}
				} else {
					$.each($('#productArticle span'), function(key, val) {
						if (cell === $(val).attr('articlepart')) {
							$(val).slideUp();
							setTimeout(function(){ $(val).remove(); }, 400);
						}
					});
				}
			})
			
			// edit & save TableContent
			.on('click', '#editTableContent', function(){
				cancelArticleBtn();
				$(this ).attr(
					{
						class: 'glyphicon glyphicon-floppy-disk',
						id: 'saveTableContent'
					}
				);
				$('.checkToArticule').hide();
				$('.removeRow').show();
				$('#sortable').sortable({
					revert: true
				});
				$('#sortable').sortable("enable");
				//$( "ul, li" ).disableSelection();
			})

			.on('click', '#saveTableContent', function(){
				$(this ).attr({
					class: 'glyphicon glyphicon-pencil leftTable',
					id: 'editTableContent'}
				);
				$('.removeRow' ).hide();
				$('.checkToArticule').show();
				PRODUCT.saveTable();
				$('#sortable').sortable({
					revert: false
				});
				$('#sortable').sortable('disable');
			})

			.find('#saveInDB' ).click(function() {
				PRODUCT.saveProductInDB();
			}).end()

			.find('#addToOrderBtn').click(function () {
				if (!MAIN.orderId) {
					localStorage.addToOrder = MAIN.productId;
					$('.rowValue input' ).addClass('rowValueInput');
					localStorage.alwaysInTable = JSON.stringify(PRODUCT.getTableContent('#alwaysInTable li'));;
					$('.rowValueInput').removeClass('rowValueInput');
					ORDER.createNewOrder();
					return true;
				}
				ORDER.addToOrder();
			}).end()
			
			.find('#createProductFromTemplate').click(function () {
				createProductFromTemplate();
			}).end()

			// change left tab name
			.find('.nameOfProduct').on('change, keyup', function(){
				$(MAIN.curTabName).text($(this ).val());
				if ('' === $(this ).val()) {
					$(MAIN.curTabName).text('Новое изделие');
				}
			}).end()

			// change kim in table
			.find('.listOfKim').change(function(){
				var kim = $('option:selected', this ).attr('kim');
				$('[data-cell="KIM1"]' ).val(kim);
				$( '#calx' ).calx();
			}).end()

			// change metall in table
			.find('.listOfMetalls').change(function(){
				var metall = $('option:selected', this ).attr('metall');
				var metallOut = $('.listOfMetalls option:selected' ).attr('metallOut');
				$('[data-cell="PR1"]' ).val(metall);
				$('[data-cell="PR2"]' ).val(metallOut);
				$( '#calx' ).calx();
			}).end()

			// add new row in product table
			.find('#addNewRow').click(function () {
				var numbersOfRows = $('#duration').val(),
					tableContent = {},
					temp,
					alwaysInTable,
					arr = [],
					max = 0,
					i;
				cancelArticleBtn();
				if (0 === $('#sortable li').size()) {
					for (i = 0; i < numbersOfRows; i++) {
						temp = _.clone(tempTable);
						temp['%ROW_NUMBER%'] = 'A' + (i + 1);
						temp['%DATA_CELL%'] = 'A' + (i + 1);
						tableContent[i] = temp;
					}
					alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
					PRODUCT.createTable(tableContent, alwaysInTable);
				} else {
					$.each($('#sortable .rowNumber'), function (key, val) {
						if ('' !== $(val).text()) {
							arr.push(parseInt($(val).text().substring(1)));
						}
					});
					if (0 !== arr.length) {
						max = Math.max.apply(Math, arr);
					}

					tableContent = PRODUCT.getTableContent('#sortable li');
					for (var i = 0; i < numbersOfRows; i++) {
						temp = _.clone(tempTable);
						temp['%ROW_NUMBER%'] = 'A' + (max + 1);
						temp['%DATA_CELL%'] = 'A' + (max + 1);
						tableContent[max] = temp;
						max++;
					}
					alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
					PRODUCT.createTable(tableContent, alwaysInTable);
				}
			}).end()

			// remove tr in product table
			.on('click', '.removeRow', function () {
				var rowName = $(this).parent().find('.rowValueInput').attr('data-cell'),
					checkBinding = $('.list-group-item').find('.glyphicon:contains(' + rowName + ')');
				checkBinding.length ? checkBinding.remove() : 0;
				$(this).parent().hide('drop');
				$(this).parent().find('.rowNumber').text('');
				$(this).parent().find('.rowValueInput').attr('data-cell', '');
				setTimeout(function () {
					$(this).parent().remove();
				}, 500);
			})

			// change row name in product table
			.on('keyup', '.rowNameInput', function () {
				$(this).attr('value', $(this).val());
				PRODUCT.saveTable();
			})

			// change value in product table by mouse wheel
			.on('mousewheel', '.rowValueInput', function (e) {
				var thisVal = Number($(this).val());
				if (1 === e.deltaY) {
					$(this).val((thisVal + 0.01).toFixed(2)).attr('value', (thisVal + 0.01).toFixed(2));
				} else if (-1 === e.deltaY) {
					$(this).val((thisVal - 0.01).toFixed(2)).attr('value', (thisVal - 0.01).toFixed(2));
				}
				$('#calx').calx();
				PRODUCT.saveTable();
			})

			// change value in product table by keys
			.on('keydown', '.rowValueInput', function (e) {
				switch (e.keyCode) {
					case 38: // UP
						PRODUCT.catchKey(this, '+', 1);
						e.preventDefault();
						break;
					case 40: // DOWN
						PRODUCT.catchKey(this, '-', 1);
						e.preventDefault();
						break;
					case 191: // /
						PRODUCT.catchKey(this, '+', 10);
						e.preventDefault();
						break;
					case 17: // Ctrl
						PRODUCT.catchKey(this, '-', 10);
						e.preventDefault();
						break;
					case 190: // >
						PRODUCT.catchKey(this, '+', 100);
						e.preventDefault();
						break;
					case 18: // Alt
						PRODUCT.catchKey(this, '-', 100);
						e.preventDefault();
						break;
					case 32: // Space
						e.preventDefault();
						break;
				}
			})

			// prevent space and comma default action
			.on('keyup', '.rowValueInput', function (e) {
				var notToReact = [17, 18, 32, 37, 38, 39, 40, 110, 188, 190, 191],
					text = $(this).val(),
					caretPos;
				if (text.indexOf(',') !== -1) {
					text = text.replace(',', '.');
					$(this).val(text);
				}
				$(this).attr('value', text);
				if (-1 === $.inArray(e.keyCode, notToReact)) {
					caretPos = this.selectionStart;
					if (96 === e.keyCode && '.' === text.charAt((text.length - 2))) {

					} else {
						$('#calx').calx();
						text = '' + $(this).val();
						$(this).caret(caretPos);
						if ('.' === text.charAt((text.length - 2))) {
							$(this).caret((text.length - 1));
						}
						PRODUCT.saveTable();
					}
				}
			})

			// add new formula
			.find('#addFormulaBtnPr').click(function(){
				if ('' !== $('#addFormulaInputPr').val()) {
					$( '#formulasList' )
						.append('<li class="list-group-item formula"><span class="formulaValue">'
						+ $( '#addFormulaInputPr' ).val() + '<span class="glyphicon glyphicon-resize-small bindFormulaWithCell" aria-hidden="true"></span></span><span class="addAvailableCellList">' + PRODUCT.addAvailableCellList($( '#addFormulaInputPr' ).val()) + '</span>' +
						'<span class="glyphicon glyphicon-pencil editFormula" aria-hidden="true"></span><span class="glyphicon glyphicon-remove removeFormula" aria-hidden="true"></span></li>');
					$('.removeFormula' ).hide();
					$('.editFormula' ).hide();
					PRODUCT.cancelInputFormula();
					$( '#addFormulaInputPr' ).val('');
					PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
				}
			}).end()

			// create formula
			.find('#addFormulaInputPr')
				.click(function(){
					var currentVal, ls;
					localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
					$('#addNewFhBtnInput' ).val('');
					if (!clickOnFormulaInput) {
						clickOnFormulaInput = true;
						$('.removeFhBtn').hide();
						$('#addFormulaInputPr' ).css('border-color', 'rgba(82, 168, 236, 0.8)');
						$('#formulasHelper' ).show('scale');
						$('#addFormulaBtnPr' ).hide();
						$('.formulaBtnGroupPr' ).show('drop');
						$('body').css('cursor', 'pointer');
						$('.currentTab ').attr('tabindex', '1').css('outline', 'none');
						$('.currentTab ')
							.unbind('keydown')
							.bind('keydown',function (e) {
								if (e.keyCode === 8) {
									currentVal =  $('#addFormulaInputPr').val();
									ls = localStorage.currentCaretPos;
									currentVal = PRODUCT.removeChar(currentVal, ls - 1);
									$('#addFormulaInputPr').val(currentVal);
									localStorage.currentCaretPos--;
									e.preventDefault();
								}
							})
							.unbind('keypress')
							.bind('keypress', function(e) {
								if (!$('#addFormulaInputPr').is(":focus")) {
									if (32 !== e.keyCode) {
										PRODUCT.addWhereCaret(localStorage.currentCaretPos, String.fromCharCode(e.keyCode));
										localStorage.currentCaretPos++;
									}
								}
							})
							.unbind('keyup')
							.bind('keyup', function() {
								PRODUCT.toggleAddFormula();
								localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
							})
							.off('click')
							.on('click', '.rowNumber', function(){
								PRODUCT.addElementToFormulaInput(this);
							});
					}
				})
				.keydown(function(e){
					if (32 === e.keyCode) {
						return false;
					}
				} ).end()

			//cancel create new formula
			.find('#cancelFormulaBtnPr' ).click(function(){
				PRODUCT.cancelInputFormula();
			}).end()

			// add formulas helper to formula input
			.on('click', '.fhBtn', function(){
				PRODUCT.addElementToFormulaInput(this);
			})

			// show remove formulas helper
			.on('mouseover', '.fhBtn', function() {
				$( '.removeFhBtn', this).show('fast');
			})

			// hide remove formulas helper
			.on('mouseleave', '.fhBtn', function() {
				$( '.removeFhBtn', this).hide('fast');
			})

			// remove formulas helper
			.on('click', '.removeFhBtn', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var fhText = $(this ).parent().text();
				PRODUCT.removeFormulasHelper(this, fhText);
			})

			// add new formula helper
			.on('click', '.addNewFhBtn', function(){
				var newFl = $('#addNewFhBtnInput' ).val();
				$('body').css('cursor', 'pointer');
				$('#addFormulaInputPr' ).click();
				PRODUCT.addBtnToFormulasHelper(newFl);
			})

			// focus on formula helper input
			.on('click', '#addNewFhBtnInput', function(){
				clickOnFormulaInput = false;
				$('.currentTab ')
					.unbind('keydown keypress keyup');
				$('body').off('keypress')
						 .css('cursor', 'auto');
			})
			
			// hide all removeFormula icons
			.find('.removeFormula' ).hide().end()

			.find('.editFormula' ).hide().end()

			.find('.bindFormulaWithCell').click(function() {
				var li = $(this).closest('li'),
					cellStatus = li.find('.addAvailableCellList option:selected').attr('val'),
					cell = li.find('.addAvailableCellList option:selected').val(),
					formula = li.find('.formulaValue').text(),
					cellList = li.find('.addAvailableCellList');
				if ('true' === cellStatus && cell) {
					$('[data-cell="' + cell + '"]').attr('data-formula', formula);
					$( '#calx' ).calx();
					cellList.remove();
					$( '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> ' + cell + '</span>' ).insertAfter( $(this) );
					$(this).remove();
					PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
				}
			}).end()
	
			.on('click', '.removeFormula', function(){
				var bindCell = $(this ).parent().find('.cellBind'),
					tableContent, alwaysInTable, flag = false;
				if (bindCell.length) {
					PRODUCT.removeBindingFormulaFromTable(false, bindCell.text());
					tableContent = PRODUCT.getTableContent('#sortable li');
					alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
					PRODUCT.createTable(tableContent, alwaysInTable);
					flag = true;
				}
				$(this).closest('li').hide("slide", {}, function() {
					$(this).remove();
					setTimeout(function(){ PRODUCT.addNewFormula(PRODUCT.getFormulasList, flag); }, 400);
				});
			})

			.on('click', '.editFormula', function() {
				var formula = $(this ).closest('li' ).find('.formulaValue' ).text();
				$(this ).closest('li' ).find('.removeFormula' ).click();
				$('#addFormulaInputPr' ).click().val(formula);
				PRODUCT.toggleAddFormula();
			})

			.on('mouseover', '.list-group-item', function(){
				$(this ).addClass('list-group-item-info');
				$(this ).find('.removeFormula' ).show();
				$(this ).find('.editFormula' ).show();
			})

			.on('mouseleave', '.list-group-item', function(){
				$(this ).removeClass('list-group-item-info');
				$(this ).find('.removeFormula' ).hide();
				$(this ).find('.editFormula' ).hide();
			})

			.on('mouseover', '.glyphicon-retweet', function(){
				$(this ).removeClass('glyphicon glyphicon-retweet' ).addClass('glyphicon glyphicon-resize-full');
			})

			.on('mouseleave', '.glyphicon-resize-full', function(){
				$(this ).removeClass('glyphicon glyphicon-resize-full' ).addClass('glyphicon glyphicon-retweet');
			})

			.on('click', '.glyphicon-resize-full', function(e){
				var bindCell = $(this ).text(),
					tableContent, alwaysInTable;
				e.stopPropagation();
				e.preventDefault();
				PRODUCT.removeBindingFormulaFromTable(this, bindCell);
				PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
				tableContent = PRODUCT.getTableContent('#sortable li');
				alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
				PRODUCT.createTable(tableContent, alwaysInTable);
			});
		return html;
	}


	function addLeftTabsHandler(html) {

		html
			// change current tab
			.find('[role=tab]').click(function(){
				if ($(this ).attr('aria-controls') !== MAIN.curTabId) {
					changeActiveTab({
						scope: this,
						curTabId: 'curTabId',
						tabsList: 'tabsList',
						getTabContent: 'getLeftTabContent',
						changeActiveTab: 'changeActiveTab',
						action: 'changeActiveLeftTab'
					});
				}
			}).end()

			//close tab
			.find('.closeTab').click(function (e){
				e.stopPropagation();
				e.preventDefault();
				var currentID = $(this).parent().attr('aria-controls' ),
					idDb = $(this ).attr('name');
				$(this ).attr('class', 'glyphicon glyphicon-remove');
				TABS.closeLeftTab(idDb, currentID);
			});
	}

	function addRightTabsHandler(html) {

		html
			.find('[role=tab]').click(function(){
				if ($(this ).attr('aria-controls') !== MAIN.curTabRightId) {
					changeActiveTab({
						scope: this,
						order: true,
						curTabId: 'curTabRightId',
						tabsList: 'tabsRightList',
						getTabContent: 'getRightTabContent',
						changeActiveTab: 'changeActiveTab',
						action: 'changeActiveRightTab'
					});
				}
			} ).end()

			.find('.closeTabRight ' ).click(function(e) {
				e.stopPropagation();
				var currentID = $(this).parent().attr('data-order' ),
					idDb = $(this ).attr('name');
				$(this ).attr('class', 'glyphicon glyphicon-remove');
				TABS.closeRightTab(idDb, currentID);
			} ).end();

		return html;
	}

	function addRightTabContentOrderHandler(html) {
		//console.log(html.find('#saveOrderInDB'));
		html
			.find('#saveOrderInDB').click(function() {
				ORDER.saveOrderInDB();
			} ).end()
			
			.find('#createPDF').click(saveOrderToPDF).end()
			
			.find('#checkAllInOrder').click(function () {
				ORDER.checkAllInOrderDetails(true);
			}).end()
			
			.find('#uncheckAllInOrder').click(function () {
				ORDER.checkAllInOrderDetails(false);
			}).end()

			.find('#changeDiscount').click(function () {
				ORDER.changeDiscount(
					{
						discount: $(this).val(),
						orderId: MAIN.orderId
					}
				);
				setOrderSum();
			}).end()

			.find('.inputOrderDetails' ).keyup(function() {
				var obj = ORDER.createJSONFromOrderDescription();
				ORDER.changeOrderDetails(
					{
						orderId: MAIN.orderId,
						orderDescr: obj
					}
				);
			}).end()
			
			.find('#consAveragePrices').click(function () {
				if ($(this).hasClass('uniquePrices')) {
					$(this).removeClass('uniquePrices');
					$(this).text('Уникальные цены');
					if ($('#consRemoveSections').hasClass('showSections')) {
						$('.consTr, .consAverageTr, .consWithoutSectionTr').hide();
						$('.consWithoutSectionAverageTr').show();
						store.set('consOrder', 'consWithoutSectionAverageTr');
					} else {
						$('.consTr, .consWithoutSectionTr, .consWithoutSectionAverageTr').hide();
						$('.consAverageTr').show();
						store.set('consOrder', 'consAverageTr');
					}
				} else {
					$(this).addClass('uniquePrices');
					$(this).text('Средние цены');
					if ($('#consRemoveSections').hasClass('showSections')) {
						$('.consTr, .consAverageTr, .consWithoutSectionAverageTr').hide();
						$('.consWithoutSectionTr').show();
						store.set('consOrder', 'consWithoutSectionTr');
					} else {
						$('.consAverageTr, .consWithoutSectionTr, .consWithoutSectionAverageTr').hide();
						$('.consTr').show();
						store.set('consOrder', 'consTr');
					}
				}
			}).end()

			.find('#consRemoveSections').click(function () {
				if ($(this).hasClass('showSections')) {
					$(this).removeClass('showSections');
					$(this).text('Убрать разделы');
					$('.orderTableSectionName' ).show();
					setTimeout(function () {
						$('.orderTableSectionName').removeClass('skip');
					}, 10);
					if ($('#consAveragePrices').hasClass('uniquePrices')) {
						$('.consWithoutSectionTr, .consAverageTr, .consWithoutSectionAverageTr').hide();
						$('.consTr').show();
						store.set('consOrder', 'consTr');
					} else {
						$('.orderTableSectionName' ).addClass('skip');
						$('.consWithoutSectionTr, .consTr, .consWithoutSectionAverageTr').hide();
						$('.consAverageTr').show();
						store.set('consOrder', 'consAverageTr');
					}
				} else {
					$(this).addClass('showSections');
					$(this).text('Показать разделы');
					$('.orderTableSectionName' ).addClass('skip').hide();
					if ($('#consAveragePrices').hasClass('uniquePrices')) {
						$('.consAverageTr, .consTr, .consWithoutSectionAverageTr').hide();
						$('.consWithoutSectionTr').show();
						store.set('consOrder', 'consWithoutSectionTr');
					} else {
						$('.consWithoutSectionTr, .consTr, .consAverageTr').hide();
						$('.consWithoutSectionAverageTr').show();
						store.set('consOrder', 'consWithoutSectionAverageTr');
					}
				}
			}).end()

			.find('#orderEstimateInput, #orderDateInput').on('keyup, click, change', function() {
				var obj = ORDER.createJSONFromOrderDescription();
				ORDER.changeOrderDetails(
					{
						orderId: MAIN.orderId,
						orderDescr: obj
					}
				);
			}).end()
			
			.find('#orderCurrencyUAHToggle').click(function () {
				$('#orderCurrencyUAHToggle').addClass('activeCurrency');
				$('#orderCurrencyUSDToggle').removeClass('activeCurrency');
				$.each($('[data-uah]'), function (num, td) {
					$(td).text($(td).attr('data-uah'));
				});
				setOrderSum();
			}).end()
			
			.find('#orderCurrencyUSDToggle').click(function () {
				$('#orderCurrencyUSDToggle').addClass('activeCurrency');
				$('#orderCurrencyUAHToggle').removeClass('activeCurrency');
				$.each($('[data-uah]'), function (num, td) {
					$(td).text((parseInt($(td).attr('data-uah')) / parseInt($('#usdSet').val())).toFixed(2));
				});
				setOrderSum();
			}).end();

		return html;
	}

	function addRightTabContentTableHandler(html) {

		html
			.find('.quantityInOrder' ).change(function () {
				var quantity = parseInt($(this).val()),
					productId = $(this).attr('data-product'),
					row = $(this).parents('.orderRow'),
					inPrice, outPrice, inSum, outSum, map;
				if (0 > quantity) {
					quantity = 1;
					$(this).val(quantity);
				}
				inPrice = parseFloat(row.find('.inputPriceInOrder').text());
				outPrice = parseFloat(row.find('.outputPriceInOrder').text());
				inSum = quantity * inPrice;
				outSum = quantity * outPrice;
				row.find('.inputSumInOrder' ).attr('data-uah', inSum.toFixed(2)).html(inSum.toFixed(2)).
					end().
					find('.outputSumInOrder').attr('data-uah', outSum.toFixed(2)).html(outSum.toFixed(2));
				map = JSON.stringify(getOrderMap());
				saveOrderMap(map, false);
				setOrderSum();
			} ).end()
			
			.find('#addNewSection' ).click(function() {
				var map, sectionsNames = [], sectionsNamesNumbers = [], biggestNumber = 1;
				$.each($('.orderTableSectionName'), function (num, obj) {
					sectionsNames.push($(obj).attr('name').split(' '));
				});
				$.each(sectionsNames, function (num, arr) {
					if (parseInt(arr[1])) {
						sectionsNamesNumbers.push(parseInt(arr[1]));
					}
				});
				if (sectionsNamesNumbers.length) {
					biggestNumber = Math.max.apply(Math, sectionsNamesNumbers) + 1;
				}
				$('.withoutSectionInOrderTable' ).before('<tr class="orderTableSectionName" name="Раздел ' +
				biggestNumber+ '"><th colspan="9"><span class="orderSectionName" contenteditable="true">Раздел ' + biggestNumber+ '</span></th></tr>');
				map = JSON.stringify(getOrderMap());
				saveOrderMap(map, true);
			}).end()
			
			.find('#checkAllInMainOrder').click(function () {
				ORDER.checkAllInOrderDetails(true, '#orderHeadChecks input');
			}).end()
			
			.find('#uncheckAllInMainOrder').click(function () {
				ORDER.checkAllInOrderDetails(false, '#orderHeadChecks input');
			}).end()
			
			.find('.moveWithoutOrderUp' ).click(function() {
				saveOrderMap(JSON.stringify(swapRows(this, 'out', 'up')), true);
			} ).end()

			.find('.moveWithoutOrderDown' ).click(function() {
				saveOrderMap(JSON.stringify(swapRows(this, 'out', 'down')), true);
			} ).end()

			.find('.removeWithoutOrderRow' ).click(function() {
				removeRowFromOrder(this);
			}).end()
			
			.find('.moveOrderUp').click(function(){
				saveOrderMap(JSON.stringify(swapRows(this, $(this).attr('data-section'), 'up')), true);
			}).end()
			
			.find('.moveOrderDown').click(function(){
				saveOrderMap(JSON.stringify(swapRows(this, $(this).attr('data-section'), 'down')), true);
			}).end()
			
			.find('.removeOrderRow' ).click(function() {
				removeRowFromOrder(this);
			}).end()
			
			.find('.moveToCopyTo' ).click(function() {
				var action = $(this).closest('div').find('.moveToAction option:selected').val(),
					path = $(this).closest('div').find('.moveToPath option:selected').text(),
					productId = $(this).attr('name'),
					map = getOrderMap(),
					data = {},
					quantity = 1,
					currentPath = $(this).attr('data-section');
				if (!currentPath) {
					currentPath = 'out';
				}
				if ('move' === action) {
					quantity = $(this).closest('tr').find('.quantityInOrder').val();
					$.each(map[currentPath], function (num, obj) {
						if (productId === _.keys(obj)[0]) {
							map[currentPath].splice(num, 1);
						}
					});
				}
				data[productId] = quantity;
				map[path].push(data);
				saveOrderMap(JSON.stringify(map), true);
				
			}).end()
			
			.find('.removeRowSection').click(function () {
				var map = getOrderMap();
				delete map[$(this).attr('name')];
				saveOrderMap(JSON.stringify(map), true);
			}).end()
			
			.find('.orderSectionName').blur(function () {
				var currentSection = $(this).text(), sectionsNames = [];
				$.each($('.orderTableSectionName'), function (num, obj) {
					sectionsNames.push($(obj).attr('name'));
				});
				if (-1 === sectionsNames.indexOf($(this).text())) {
					$(this).closest('tr').attr('name', currentSection);
				}
				saveOrderMap(JSON.stringify(getOrderMap()), true);
			});
			
		return html;
	}

    function addCategoriesTableHandler(html) {
        html
            .filter('tr')
            .mouseover(function () {
                var obj = {
                    pencilRemove: 'triggerCategoryPencil',
                    pencilAdd: 'editCategoryPencil',
                    removeRemove: 'triggerRemoveCategory',
                    removeAdd: 'removeCategory'
                };
                kimEditOver(obj, this);
            })
            .mouseleave(function () {
                var obj = {
                    pencilRemove: 'editCategoryPencil',
                    pencilAdd: 'triggerCategoryPencil',
                    removeRemove: 'removeCategory',
                    removeAdd: 'triggerRemoveCategory'
                };
                kimEditOver(obj, this);
            }).end()

            .on('click', '.removeCategory', function(){
                var catId = $(this ).attr('name');
                CATEGORIES.removeCategory(catId);
            })

            .on('click', '.editCategoryPencil', function(){
                $(this )
                    .attr('class', 'glyphicon glyphicon-floppy-disk saveEditCategory' )
                    .css('margin-left', '0');
                $(this )
                    .parents('tr')
                    .find('.categoryName')
                    .attr('contenteditable', 'true')
                    .css({
                        'border': '1px solid hsl(195, 79%, 43%)',
                        'border-radius': '2px'
                    });
            })

            .on('click', '.saveEditCategory', function(){
                var id = $(this ).attr('name'),
                    name = VALIDATION.validateInputVal({
                        val: $(this ).parents('tr').find('.categoryName' ).text()
                    }),
                    self = this;
                if (name) {
                    CATEGORIES.editCategory(id, name, self);
                }
            });
        return html;
    }

	function addKimTableHandler(html) {
		//console.log(html.find('.editKimPencil'));
		html
			.filter('tr')
				.mouseover(function () {
					var obj = {
						pencilRemove: 'triggerKimPencil',
						pencilAdd: 'editKimPencil',
						removeRemove: 'triggerRemoveKim',
						removeAdd: 'removeKim'
					};
					kimEditOver(obj, this);
				})
				.mouseleave(function () {
					var obj = {
						pencilRemove: 'editKimPencil',
						pencilAdd: 'triggerKimPencil',
						removeRemove: 'removeKim',
						removeAdd: 'triggerRemoveKim'
					};
					kimEditOver(obj, this);
				}).end()

			.on('click', '.removeKim', function(){
				var kimId = $(this ).attr('name');
				KIM.removeKim(kimId);
			})

			.on('click', '.editKimPencil', function(){
				$(this )
					.attr('class', 'glyphicon glyphicon-floppy-disk saveEditKim' )
					.css('margin-left', '0');
				$(this )
					.parents('tr')
					.find('.kimHardName, .kimName, .kimArticle')
					.attr('contenteditable', 'true')
					.css({
						'border': '1px solid hsl(195, 79%, 43%)',
						'border-radius': '2px'
					});
			})

			.on('click', '.saveEditKim', function(){
				var kimId = $(this ).attr('name'),
					kim = VALIDATION.validateInputVal({
                        val: $(this ).parents('tr').find('.kimName' ).text(),
                        digitsOnly: true
                    }),
					kimHard = VALIDATION.validateInputVal({
                        val: $(this ).parents('tr').find('.kimHardName' ).text()
                    }),
					self = this;
                if (kim && kimHard) {
                    KIM.editKim(kimId, kim, kimHard, self);
                }
			});

		return html;
	}

	function addMetallsTableHandler(html) {

		html
			.filter('tr')
				.mouseover(function () {
					var obj = {
						pencilRemove: 'triggerMetallPencil',
						pencilAdd: 'editMetallPencil',
						removeRemove: 'triggerRemoveMetall',
						removeAdd: 'removeMetall'
					};
					kimEditOver(obj, this);
				})
				.mouseleave(function () {
					var obj = {
						pencilRemove: 'editMetallPencil',
						pencilAdd: 'triggerMetallPencil',
						removeRemove: 'removeMetall',
						removeAdd: 'triggerRemoveMetall'
					};
					kimEditOver(obj, this);
				}).end()

			.on('click', '.editMetallPencil', function () {
				$(this)
						.attr('class', 'glyphicon glyphicon-floppy-disk saveEditMetall')
						.css('margin-left', '0');
				$(this)
						.parents('tr')
						.find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
						.attr('contenteditable', 'true')
						.css({
							'border': '1px solid hsl(195, 79%, 43%)',
							'border-radius': '2px'
						});
			})

			.on('click', '.saveEditMetall', function(){
                var scope = $(this ).parents('tr');
                var metallName = VALIDATION.validateInputVal({
                        val: scope.find('.metallName' ).text()
                    }),
                    metallPrice =  VALIDATION.validateInputVal({
                        val: scope.find('.metallPrice' ).text(),
                        digitsOnly: true
                    }),
                    metallMass =  VALIDATION.validateInputVal({
                        val: scope.find('.metallMass' ).text(),
                        digitsOnly: true
                    }),
                    metallOutPrice =  VALIDATION.validateInputVal({
                        val: scope.find('.metallOutPrice' ).text(),
                        digitsOnly: true
                    });
                if (metallName && metallPrice && metallMass && metallOutPrice) {
                    METALLS.editMetall({
                        metallId: $(this ).attr('name'),
                        metallName: metallName,
                        metallPrice: metallPrice,
                        metallMass: metallMass,
                        metallOutPrice: metallOutPrice
                    }, this);
                }
			})
			.on('click', '.removeMetall', function () {
				var metallId = $(this).attr('name');
				METALLS.removeMetall(metallId);
			});

		return html;
	}
	
	
	function addMenuProductHandler(html) {

		html
			.find('.openProductTab').click(function() {
				if ('' === $(this ).attr('data-selected')) {
					$(this ).addClass('openProductTabSelected').attr('data-selected', 'selected' );
				} else if('selected' === $(this ).attr('data-selected')){
					$(this).removeClass('openProductTabSelected').attr('data-selected', '' );
				}
				enableDisableButton($('.openProductTabSelected'), $('#showItemFromFileManager'));
			}).end();

		return html;
	}

	function addMenuOrdersHandler(html) {
		html
			.find('.openProductTab').click(function () {
				if ('' === $(this).attr('data-selected')) {
					$(this).addClass('openProductTabSelected').attr('data-selected', 'selected');
				} else if ('selected' === $(this).attr('data-selected')) {
					$(this).removeClass('openProductTabSelected').attr('data-selected', '');
				}
				enableDisableButton($('.openProductTabSelected'), $('#showItemFromFileManager'));
			}).end()

			.find('.consolidateOrder').click(function () {
				if ('' === $(this).attr('data-selected')) {
					$(this).addClass('consolidateOrderSelected').attr('data-selected', 'selected');
				} else if ('selected' === $(this).attr('data-selected')) {
					$(this).removeClass('consolidateOrderSelected').attr('data-selected', '');
				}
				enableDisableButton($('.consolidateOrderSelected'), $('#FMconsolidatedOrdersBtn'));
			}).end();
		
		return html;
	}

	// prototype holds methods (to save memory space)
	Dima.prototype = {

		// tabs section
		tabs: {
			openProductCreation: function  () {
				if (!MAIN.prRequested) {
					TABS.getLeftTabsList();
					TABS.getRightTabsList();
				}
			},

			getLeftTabsList: function() {
				$.ajax( {
					url: URL_TABS + 'getLeftTabsList',
					method: 'GET'
				} ).then( function ( data )
				{
					var html;

					MAIN.tabsList = data.tabsList;
					MAIN.tableContent = data.kim;
					MAIN.prRequested = true;

					if (data.html) {
						html = $(data.html);
						addLeftTabsHandler(html);
						html.insertBefore( '#addNewTab' );
					}
					if (data.active && data.html) {
						TABS.getLeftTabContent(data.productId, data.active);
					} else {
						$('#myTab, #leftTabsContent').fadeIn('slow');
						setTimeout(function(){ spinnerLeft.stop(document.getElementById('leftTabsSpinner')); }, 200);
						TABS.showPreferences();
					}
					$(function () {
						$('[data-toggle="tooltip"]').tooltip();
					});
				});
			},

			getLeftTabContent: function(productId, tabId) {
				localStorage.currentCaretPos = 0;
				$.ajax( {
					url   : URL_TABS + 'getLeftTabContent/' + productId,
					method: 'GET'
				} ).then( function ( data )
				{
					var kim, metall, metallOut;

					$('#preferences1').removeClass('active');
					$('.currentTab' )
						.attr('id', tabId)
						.removeClass('saveInDB addedToOrder')
						.addClass('active ' + data.css)
						.html(addLeftTabContentHandler($(data.html)));
					$('.removeRow' ).hide();

					MAIN.curTabId = tabId;
					MAIN.curTabName = 'a[href="#' + MAIN.curTabId + '"] .tabName';
					MAIN.productId = productId;
                    MAIN.detailsForArticle = data.detailsForArticle;
					MAIN.isArticle = data.article;
					MAIN.metallId = data.metallId;

					if (!data.article){
						kim = $('.listOfKim option:selected' ).attr('kim');
						metall = $('.listOfMetalls option:selected' ).attr('metall');
						metallOut = $('.listOfMetalls option:selected' ).attr('metallOut');
						$('[data-cell="KIM1"]' ).val(kim);
						$('[data-cell="PR1"]' ).val(metall);
						$('[data-cell="PR2"]' ).val(metallOut);
					} else {
						$('.rowValueInput').removeClass('rowValueInput');
						$('.cellBind').removeClass('cellBind');
						$('.glyphicon-retweet').removeClass('glyphicon-retweet');
						$('.removeFormula, .editFormula').remove();
						$('#metallHistorySelect option:last-child' ).prop('selected', true);
						recalculateArticleTable();
					}
					$.each($('.bindFormulaWithCell'), function(num, obj){
						var li = $(obj).closest('li');
						li.find('.addAvailableCellList').html(PRODUCT.addAvailableCellList(li.find('.formulaValue').text()));
					});
					$('#calx').calx();
					showBody();
					if (localStorage.addToOrder) {
						ORDER.addToOrder();
						delete localStorage.addToOrder;
						delete localStorage.alwaysInTable;
					}
					$(function () {
						$('[data-toggle="tooltip"]').tooltip();
					});
					$('#myTab, #leftTabsContent').fadeIn('slow');
					setTimeout(function(){ spinnerLeft.stop(document.getElementById('leftTabsSpinner')); }, 200);
				});
			},

			changeActiveTab: function (id, tabId, action) {
				$.ajax({
					url: URL_TABS + action,
					method: 'POST',
					data: {
						id: id,
						tabId: tabId
					}
				}).then(function (data)
				{
					//console.log(data);
				});
			},

			closeLeftTab: function (idDb, currentID) {
				var nextActiveTab = MAIN.curTabId,
					productId = MAIN.productId,
					elemInObj = Object.keys(MAIN.tabsList),
					ifActive, index;
				if (2 === elemInObj.length) {
					nextActiveTab = 'preferences1';
				} else {
					ifActive = MAIN.tabsList[currentID].active;
					if ('1' === ifActive) {
						index = elemInObj.indexOf(currentID);
						if (index === elemInObj.length - 1) {
							nextActiveTab = Object.keys(MAIN.tabsList)[elemInObj.length - 2];
						} else {
							nextActiveTab = Object.keys(MAIN.tabsList)[index + 1];
						}
						productId = MAIN.tabsList[nextActiveTab].productId;
						MAIN.tabsList[nextActiveTab].active = '1';
					}
				}
				delete MAIN.tabsList[currentID];
				$('[aria-controls=' + currentID + ']').hide('highlight');
				setTimeout(function () {
					$('[aria-controls=' + currentID + ']').parent().remove();
				}, 900);
				if ('preferences1' === nextActiveTab || undefined === nextActiveTab) {
					$('.currentTab').removeClass('active');
					$('#preferences, #preferences1').addClass('active');
					TABS.loadPreferences();
				} else {
					$('[aria-controls=' + nextActiveTab + ']').parent().addClass('active');
				}

				$.ajax({
					url: URL_TABS + 'closeTab',
					method: 'POST',
					data: {
						id: idDb,
						tabId: currentID,
						nextActiveTab: nextActiveTab
					}
				}).then(function (  )
				{
					if ('preferences1' !== nextActiveTab) {
						TABS.getLeftTabContent(productId, nextActiveTab);
					}
				});
			},

			closeRightTab: function (tabId, orderID) {
				var nextActiveTab = MAIN.curTabRightId,
					productId = MAIN.orderId,
					elemInObj = Object.keys(MAIN.tabsRightList),
					orderId = 'or' + tabId,
					ifActive, index;

				if (2 === elemInObj.length) {
					nextActiveTab = 'kim';
					delete MAIN.orderId;
				} else {
					ifActive = MAIN.tabsRightList[orderId].active;
					if ('1' === ifActive) {
						index = elemInObj.indexOf(orderId);
						if (index === elemInObj.length - 1) {
							nextActiveTab = Object.keys(MAIN.tabsRightList)[elemInObj.length - 2];
						} else {
							nextActiveTab = Object.keys(MAIN.tabsRightList)[index + 1];
						}
						productId = MAIN.tabsRightList[nextActiveTab].orderId;
						MAIN.tabsRightList[nextActiveTab].active = '1';
					}
				}
				delete MAIN.tabsRightList[orderId];
				$('[aria-controls=' + orderId + ']').hide('highlight');
				setTimeout(function () {
					$('[aria-controls=' + orderId + ']').parent().remove();
				}, 700);
				if ('kim' === nextActiveTab || undefined === nextActiveTab) {
					$('.currentTabRight').removeClass('active');
					$('#kim, #kimTab').addClass('active');
					$('#livemill').prop('muted', false);
                    /*CATEGORIES.getCategoriesTable();
					KIM.getKIMTable();
					METALLS.getMetallsTable();*/
				} else {
					$('[aria-controls=' + nextActiveTab + ']').parent().addClass('active');
				}
				if ('kim' !== nextActiveTab) {
					nextActiveTab = VALIDATION.digitsOnly(nextActiveTab);					
				}
				$.ajax({
					url: URL_TABS + 'closeRightTab',
					method: 'POST',
					data: {
						tabId: tabId,
						orderID: orderID,
						nextActiveTab: nextActiveTab
					}
				}).then(function (  )
				{
					if ('kim' !== nextActiveTab) {
						 TABS.getRightTabContentOrderDetails(productId, 'or' + nextActiveTab);
						 TABS.getRightTabContentTable(productId);
					}
				});
			},

			getLastLeftTab: function() {
				$.ajax( {
					url   : URL_TABS + 'getLastLeftTab',
					method: 'GET'
				} ).then( function ( data )
				{
					TABS.addNewLeftTab(data);
				});
			},

			addNewLeftTab: function(id) {
				$.ajax( {
					url   : URL_TABS + 'addNewLeftTab/' + id,
					method: 'POST'
				} ).then( function ( data )
				{
					window.location.href = LOCATION;
				});
			},

			changeTabName: function (obj) {
				$.ajax( {
					url   : URL_TABS + 'changeTabName',
					method: 'POST',
					data: {
						prId: MAIN.productId,
						prName : obj.prName,
						categoryId : obj.categoryId,
						kimId: obj.kimId,
						metallId: obj.metallId
					}
				} ).then( function ( data )
				{
					//console.log(data);
				});
			},

			openSavedProduct: function (arr, tab, active, refresh) {
				var refresh = (refresh === undefined) ? refresh = true : refresh;
				$.ajax( {
					url   : URL_TABS + 'openSavedProduct',
					method: 'POST',
					data: {
						arr: arr,
						tab: tab,
						active: active
					}
				} ).then( function ( data )
				{console.log(data);
					if (true === data && refresh) {
						window.location.href = LOCATION;
					}
				});
			},
			
			getRightTabsList: function () {
				$.ajax( {
					url   : URL_TABS + 'getRightTabsList',
					method: 'GET'
				} ).then( function ( data )
				{
					if(!data.tabs) {
						/*CATEGORIES.getCategoriesTable();
						KIM.getKIMTable();
						METALLS.getMetallsTable();*/
						$('#rightTabs, #rightTabsContent').fadeIn('slow');
						setTimeout(function(){ spinnerRight.stop(document.getElementById('orderSpinner')); }, 200);
						return true;
					}

					$(addRightTabsHandler($(data.html))).insertBefore( '#addNewTabRight' );
					MAIN.tabsRightList = data.obj;
					if('kim' !== data.tabId) {
						TABS.getRightTabContentOrderDetails(data.orderId, data.tabId);
						TABS.getRightTabContentTable(data.orderId);
						return true;
					}
					//TABS.showKim();
					MAIN.tabsRightList.kim.active = '1';
					MAIN.curTabRightId = 'kim';
					$('#rightTabs, #rightTabsContent').fadeIn('slow');
					setTimeout(function(){ spinnerRight.stop(document.getElementById('orderSpinner')); }, 200);
					$(function () {
						$('[data-toggle="tooltip"]').tooltip();
					});
				});
			},

			getRightTabContentOrderDetails: function (orderId, tabId) {
				$.ajax( {
					url   : URL_TABS + 'getRightTabContentOrderDetails/',
					method: 'GET',
					data: {orderId: orderId}
				} ).then( function ( data )
				{
					if (true === data.success) {
						$('#kimTab, #kim').removeClass('active');
						$('#livemill').prop('muted', true);
						$('.currentTabRight' )
							.attr('id', tabId)
							.addClass('active');
						$('#orderDetailsWrapper').html(addRightTabContentOrderHandler($(data.html)));

						MAIN.curTabRightId = tabId;
						MAIN.curTabRightName = 'a[href="#' + MAIN.curTabRightId + '"] .tabName';
						MAIN.orderId = orderId;
						if ('TRUE' === data.consolidate) {
							store.set('consOrder', 'consAverageTr');
						} else {
							store.remove('consOrder');
						}
						$(function () {
							$('[data-toggle="tooltip"]').tooltip();
							$.each(data.orderDescription, function(name, arr) {
								$('[data-orderdetails="' + name.replace(/%/g, '') + '"]').autocomplete({
									source: arr,
									select: function (event, ui) {
										$('[data-orderdetails="' + name.replace(/%/g, '') + '"]').attr('value', ui.item.value ).val(ui.item.value);
										var obj = ORDER.createJSONFromOrderDescription();
										ORDER.changeOrderDetails(
											{
												orderId: MAIN.orderId,
												orderDescr: obj
											}
										);
									}
								});
							});
						});
						return this;
					}
					log(data.error);
				});
			},

			getRightTabContentTable: function (orderId) {
				$.ajax( {
					url   : URL_TABS + 'getRightTabContentTable/',
					method: 'GET',
					data: {orderId: orderId}
				} ).then( function ( data )
				{
					if (data.success) {
						$('#orderTableWrapper').html(addRightTabContentTableHandler($(data.html)));
						if (data.consolidateData) {
							$('#saveOrderInDBWrapper').hide();
							$('#consOrderButtonsWrapper').show();
							buildConsolidateOrder(data.consolidateData);
						}
						setOrderSum();
						showBody();
						$('#rightTabs, #rightTabsContent').fadeIn('slow');
						setTimeout(function(){ spinnerRight.stop(document.getElementById('orderSpinner')); }, 200);
						$(function () {
							$('[data-toggle="tooltip"]').tooltip({ my: "left+15 center", at: "right center" });
							$('#orderTable').resizableColumns({
								  //store: window.store
								});
						});
					}
				});
			},

			showKim: function() {
				$.when(CATEGORIES.getCategoriesTable(), KIM.getKIMTable(), METALLS.getMetallsTable()).done(function () {
					setTimeout(function(){ spinnerKim.stop(document.getElementById('orderSpinner')); }, 500);
				});
			},

			loadPreferences: function() {
				MAIN.tabsList['preferences1'].active = '1';
				MAIN.curTabId = 'preferences1';
			},

			showPreferences: function (){
				$('#preferences, #preferences1').addClass('active');
				TABS.loadPreferences();
				showBody();
			},

            splitMonitor: function() {
                $('#left-component').css('width', localStorage.split);
                $('#divider, #right-component').css('left', localStorage.split);
                $('#db-left-component').css('width', localStorage['db-split']);
                $('#db-divider, #db-right-component').css('left', localStorage['db-split']);
            }
		},

		// product section
		product: {
			saveProductInDB: function() {
				$.ajax( {
					url   : URL_PRODUCT + 'saveProductInDB',
					method: 'POST',
					data: {prId: MAIN.productId}
				} ).then( function ( data )
				{
					data ? $('#statusOfProductInDB' ).html('Сохранено в базе данных')  : false;
				});
			},

			saveArticleOfProduct: function (article) {
				$.ajax( {
					url   : URL_PRODUCT + 'saveArticleOfProduct',
					method: 'POST',
					data: {
						prId: MAIN.productId,
						article: article
					}
				} ).then( function ( data )
				{
					if (true === data.status) {
						$('.checkToArticle, #cancelArticleBtn, #saveArticle').remove();
						PRODUCT.saveProductInDB();
						TABS.getLeftTabContent(MAIN.productId, MAIN.curTabId);
					} else if('already' === data.status) {
						var href = '';
						if (!MAIN.tabsList[MAIN.curTabId]) {
							href = $('<span><a id="errorOpenInCurrentTab"> Открыть в текущей вкладке</a><span> или</span><a id="errorOpenInNewTab"> Открыть в новой вкладке</a></span>');
							href
								.find('#errorOpenInCurrentTab').click(function () {
								console.log(MAIN);
									TABS.openSavedProduct(data.id, MAIN.curTabId, true, true);
								}).end()
								.find('#errorOpenInNewTab').click(function () {
									TABS.openSavedProduct(data.id, 'new', true, true);
								});
						} else {
							href = ' Продукт открыт во вкладках.';
						}
						$('#errorArticle' )
							.html(ERR.ARTICLE.already)
							.append(href)
							.show();
					}
				});
			},

			saveTable: function () {
				$.ajax( {
					url   : URL_PRODUCT + 'changeTableContent',
					method: 'POST',
					data: {
						prId: MAIN.productId,
						tableContent: JSON.stringify(PRODUCT.getTableContent('#sortable li')),
						alwaysInTable: JSON.stringify(PRODUCT.getTableContent('#alwaysInTable li'))
					}
				} ).then( function ( data )
				{
					//console.log(data);
				});
			},

			getTableContent: function (dom) {
				var tableContent = {},
					i = 0,
					temp;
				$.each($(dom), function(key, val) {
					temp = _.clone(tempTable);
					if ('' !== $('.rowNumber', val ).text()) {
						temp['%ROW_NUMBER%'] = $('.rowNumber', val ).text();
						temp['%ROW_NAME%'] = $('.rowNameInput', val ).val();
						temp['%DATA_CELL%'] = $('.rowValueInput', val ).attr('data-cell');
						temp['%DATA_FORMULA%'] = $('.rowValueInput', val ).attr('data-formula');
						temp['%INPUT_VALUE%'] = $('.rowValueInput', val ).val();
						tableContent[i] = temp;
						i++;
					}
				});

				return tableContent;
			},

			createTable: function (tableContent, alwaysInTable) {
				$.ajax({
					url: URL_PRODUCT + 'createTable',
					method: 'POST',
					data: {
						prId: MAIN.productId,
						tableContent: JSON.stringify(tableContent),
						alwaysInTable: JSON.stringify(alwaysInTable)
					}
				}).then(function (data)
				{
					$('#sortable').html(data[0]);
					$('#alwaysInTable').html(data[1]);
					$('.removeRow').hide();
					PREFERENCES.applyCss();
				});
			},

			catchKey: function (el, mathAction, step) {
				var thisVal = Number($(el).val());
				if ('+' === mathAction) {
					$(el).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
				} else {
					$(el).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
				}
				$('#calx').calx();
				PRODUCT.saveTable();
			},

			addNewFormula: function (formulas, binding) {
				$.ajax( {
					url   : URL_PRODUCT + 'addNewFormula',
					method: 'POST',
					data: {
                        formulas: formulas,
                        prId : MAIN.productId
					}
				} ).then( function ( data )
				{
					if (true === binding) {
					   PRODUCT.saveTable();
					   $('#formulasList').html(addLeftTabContentHandler($(data.formulasList)));
					   $.each($('.bindFormulaWithCell'), function(num, obj){
							var li = $(obj).closest('li');
							li.find('.addAvailableCellList').html(PRODUCT.addAvailableCellList(li.find('.formulaValue').text()));
						});
						$('#calx').calx();
					}
				});
			},

			removeBindingFormulaFromTable: function(scope, bindCell){
				$('.rowValueInput[data-cell=' +bindCell + ']' )
					.removeAttr('color' ).val('' )
					.attr('value', '')
					.attr('data-formula', '')
					.css('color', '' );
				$('.rowValueInput[data-cell=' +bindCell + ']' ).parent().parent().find('.rowNameInput').css('color', '' );
				$('.rowValueInput[data-cell=' +bindCell + ']' ).parent().parent().css({'background' : '', 'color' : ''});
				if (scope) {
					$(scope ).parent().removeClass('list-group-item-info');
					$(scope ).remove();
				}
				$( '#calx' ).calx();
			},

			getFormulasList: function() {
				var formulasList = {},
					formula,
					cell;
				$.each($('.formula'), function(key, val) {
					formula = $('.formulaValue', val ).text();
					cell = $.trim($('.cellBind', val ).text());
					formulasList[key] = {
						formula: formula,
						cell: cell
					};
				});
				return JSON.stringify(formulasList);
			},

			toggleAddFormula: function() {
				'' !== $('#addFormulaInputPr').val() ? $('#addFormulaBtnPr' ).slideDown() : $('#addFormulaBtnPr' ).slideUp();
			},

			cancelInputFormula: function() {
                clickOnFormulaInput = false;
				$('#addFormulaInputPr' ).css('border-color', '' ).val('');
				$('.formulaBtnGroupPr' ).hide('drop');
                $('.currentTab ')
                    .removeAttr('tabindex')
                    .unbind('keydown keypress keyup click');

				$('body')
					.off('keypress')
					.off('click', '.rowNumber')
					.css('cursor', 'auto');
				$(document).keydown(function (e) {
					if (e.which === 8) {
					return true;
					}
				});
				$('#formulasHelper' ).hide('slide');
			},

			addElementToFormulaInput: function(scope) {
				PRODUCT.addWhereCaret(localStorage.currentCaretPos, $(scope ).text());
				localStorage.currentCaretPos = parseInt(localStorage.currentCaretPos) + parseInt($(scope ).text().length);
				PRODUCT.toggleAddFormula();
			},

			addBtnToFormulasHelper: function (newFl) {
				$.ajax( {
					url   : URL_PRODUCT + 'addBtnToFormulasHelper',
					method: 'POST',
					data: {'newFl': newFl}
				} ).then( function ( data )
				{
					if (true === data) {
						$('<span class="justCreated"><button type="button" class="btn custom-addRowsToTable btn-xs fhBtn">' + newFl + '' +
						'<span class="glyphicon glyphicon-remove removeFhBtn" aria-hidden="true"></span></button></span>').insertBefore('#addNewBtnSpan');
						$('.justCreated' ).find('.removeFhBtn').hide('fast');
						$('.justCreated' ).show('slow' ).removeClass('.justCreated');
						$('#addNewFhBtnInput' ).val('');
					}

				});
			},

			removeFormulasHelper: function(dom, fhText) {
				$.ajax( {
					url   : URL_PRODUCT + 'removeBtnFromFormulasHelper',
					method: 'POST',
					data: {'fhText': fhText}
				} ).then( function ( data )
				{
					$(dom ).parent().fadeOut('slow');

				});
			},
			
			addAvailableCellList: function(formula) {
				var res = '<select><option val="false">Выберите ячейку</option>';
				$.each($('.rowValueInput'), function(num, obj){
					var cell = $(obj).attr('data-cell'),
						dataFormula = $(obj).attr('data-formula');
					if (-1 === formula.search(cell) && -1 === notIncludeInCell.indexOf(cell) && !dataFormula && PRODUCT.checkInputOnFormula(formula, cell)) {
						res += '<option val="true">' + cell + '</option>';
					}
				});
				res += '</select>';
				return res;
			},
			
			checkInputOnFormula: function(formula, cell) {
				var tableContent = PRODUCT.getTableContent('#sortable li'),
					alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li'),
					cellsArr = {},
					cellsInFormula = [],
					res = true;
				$.each(tableContent, function (key, val) {
					cellsArr[val['%DATA_CELL%']] = val['%DATA_FORMULA%'];
				});
				$.each(alwaysInTable, function (key, val) {
					cellsArr[val['%DATA_CELL%']] = val['%DATA_FORMULA%'];
				});
				$.each(cellsArr, function (key) {
					if (-1 !== formula.search(key)) {
						cellsInFormula.push(key);
					}
				});
				$.each(cellsInFormula, function (key, val) {
					if (-1 !== cellsArr[val].search(cell)) {
						res = false;
					}

				});
				return res;
			},

			addWhereCaret: function(caretPos, what) {
				var currentVal =  $('#addFormulaInputPr').val();
				$('#addFormulaInputPr').val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
			},

			removeChar: function(string, index){
				var res = '';
				for (var i in string) {
					(index !== Number(i)) ? res = res + string[i] : 1;
				}

				return res;
			}
		},

		// order section
		order: {
			createNewOrder: function (refresh, consolidate) {
				var refresh = (refresh=== undefined) ? refresh = true : refresh;
				var consolidate = (consolidate=== undefined) ? consolidate = false : consolidate;
				return $.ajax({
					url: URL_ORDER + 'createNewOrder',
					method: 'POST',
					data: {consolidate: consolidate}
				}).then(function (data)
				{
					if (false !== data && refresh) {
						window.location.href = LOCATION;
					}
					return data;
				});
			},
			addToOrder: function () {
				var map,
					productId = MAIN.productId,
					alwaysInTable = '',
					obj = {};
				if (localStorage.addToOrder) {
					alwaysInTable = localStorage.alwaysInTable;
				} else {
					$('.rowValue input' ).addClass('rowValueInput');
					alwaysInTable = JSON.stringify(PRODUCT.getTableContent('#alwaysInTable li'));
					$('.rowValueInput').removeClass('rowValueInput');
				}
				$.ajax({
					url: URL_ORDER + 'addProductToOrder',
					method: 'POST',
					data: {
						orderId: 	   MAIN.orderId,
						productId: 	   productId,
						alwaysInTable: alwaysInTable
					}
				}).then(function (data)
				{
					if ('ok' === data.status) {
						map = getOrderMap();
						obj[productId] = 1;
						map.out.push(obj);
						saveOrderMap(JSON.stringify(map), true);
					}
				});

			},

			addToConsolidateOrder: function (orderId, arr) {
				return $.ajax({
					url: URL_ORDER + 'addToConsolidateOrder',
					method: 'POST',
					data: {orderId: orderId, arr: arr}
				}).then(function (data)
				{
					window.location.href = LOCATION;
				});
			},

			saveOrderInDB: function() {
				$.ajax({
					url: URL_ORDER + 'saveOrderInDB',
					method: 'POST',
					data: {orderId: MAIN.orderId}
				}).then(function (data)
				{
					if (data) {
						$('#saveOrderInDBWrapper' ).html('Сохранено в базе данных');
					}
				});
			},

			checkAllInOrderDetails:  function(param, id) {
				var id = (id === undefined) ? id = '#orderDetails input' : id;
				$.each($(id), function (key, val) {
					$(val).prop('checked', param);
				});
			},

			changeDiscount: function (obj) {
				$.ajax({
					url: URL_ORDER + 'changeDiscount',
					method: 'POST',
					data: obj
				}).then(function (data) {
					console.log(data);
				});
			},

			changeOrderDetails: function(obj) {
				$.ajax( {
					url   : URL_ORDER + 'changeOrderDetails',
					method: 'POST',
					data: obj
				} ).then( function ( data ) {
				});
			},

			removeFromOrder: function (productId) {
				$.ajax( {
					url   : URL_ORDER + 'removeFromOrder',
					method: 'POST',
					data: {orderId: MAIN.orderId, productId: productId}
				} ).then( function ( data ) {
				});
			},
			
			openSavedOrder: function (arr, tab, active, refresh) {
				var refresh = (refresh === undefined) ? refresh = true : refresh;
				$.ajax( {
					url   : URL_ORDER + 'openSavedOrder',
					method: 'POST',
					data: {
						arr: arr,
						tab: tab,
						active: active
					}
				} ).then( function ( data ) {
					if (true === data && refresh) {
						window.location.href = LOCATION;
					}
				});
			},
			
			createJSONFromOrderDescription: function() {
				var obj = _.clone(orderPlaceholder),
					arr = _.keys(obj), i = 0;
				$.each($('.inputOrderDetails'), function(key, val){
					if (!$(val).hasClass('skip')) {
						obj[arr[i]] = $(val).val();
						i++;
					}
				});
				obj["%ESTIMATE%"] = $('#orderEstimateInput' ).val();
				obj["%DATE%"] = $('#orderDateInput' ).val();
				return obj;
			}
		},

        // categories section
        categories: {
            addCategory: function(categoryName, article) {
                $.ajax( {
                    url   :  URL_CATEG +'add',
                    method: 'POST',
                    data: {
                        categoryName: categoryName,
                        article: article
                    }
                } ).then( function ( data )
                {
                    if (true === data) {
                        $('#addCategoryInput, #addCategoryArticleInput').val('');
                        CATEGORIES.getCategoriesTable();
                        CATEGORIES.getCategoriesList();
                    }
                } );
            },

            getCategoriesTable: function() {
                 return $.ajax( {
                    url   : URL_CATEG + 'getCategoriesTable',
                    method: 'GET'
                } ).then( function ( data )
                {
                    MAIN.categoriesTableContent = data.categoriesTableContent;
                    $('#categoriesListTable tbody' ).html(addCategoriesTableHandler($(data.html)));
                } );
            },

            getCategoriesList: function () {
                return $.ajax({
                    url: URL_CATEG + 'getCategoriesList',
                    method: 'GET',
                    data: {
                        prId: MAIN.productId
                    }
                }).then(function (data) {console.log(data);
                    $('.listOfCategories').html(data.html);
                });
            },

            editCategory: function (id, name, save) {
                cancelArticleBtn();
                $.ajax( {
                    url   : URL_CATEG + 'editCategory',
                    method: 'POST',
                    data: {
                        id: id,
                        name: name
                    }
                } ).then( function ( data )
                {
                    if (true === data) {
                        CATEGORIES.getCategoriesTable();
                        CATEGORIES.getCategoriesList();
                    } else {
                        $(save )
                            .parents('tr')
                            .find('.categoryName')
                            .css({
                                'border': '3px solid hsl(0, 69%, 22%)',
                                'border-radius': '2px'
                            });
                    }
                });
            },
            removeCategory: function (id) {
                cancelArticleBtn();
                $.ajax({
                    url   : URL_CATEG + 'removeCategory',
                    method: 'POST',
                    data: {
                        id: id
                    }
                }).then(function (data)
                {
                    if (true === data) {
                        CATEGORIES.getCategoriesTable();
                        CATEGORIES.getCategoriesList();
                    }
                });
            }
        },

		// kim section
		kim: {
			getKIMTable: function () {
				return $.ajax({
					url: URL_KIM + 'getKIMTable',
					method: 'GET'
				}).then(function (data)
				{
					MAIN.kimTableContent = data.kimTableContent;
					$('#tbodyKIM').html(addKimTableHandler($(data.html)));
				});
			},

			getKimList: function () {
				$.ajax({
					url: URL_KIM + 'getKimList',
					method: 'GET',
					data: {
						prId: MAIN.productId
					}
				}).then(function (data) {
					$('.listOfKim').html(data.html);
					var kim = $('.listOfKim option:selected').attr('kim');
					$('[data-cell="KIM1"]').val(kim);
					$('#calx').calx();
				});
			},

			addKIMtoTable: function (kim, kimHard) {
                cancelArticleBtn();
				$.ajax({
					url: URL_KIM + 'addKIMtoTable',
					method: 'POST',
					data: {
						kim: kim,
						kimHard: kimHard
					}
				}).then(function (data)
				{
					if (true === data) {
						$('#kimInput, #kimHardInput, #kimArticle').val('');
						KIM.getKIMTable();
						KIM.getKimList();
					} else {

					}
				});
			},

			editKim: function (kimId, kim, kimHard, save) {
                cancelArticleBtn();
				$.ajax( {
					url   : URL_KIM + 'editKim',
					method: 'POST',
					data: {
						kimId: kimId,
						kim: kim,
						kimHard : kimHard
					}
				} ).then( function ( data )
				{
					if (true === data) {
						KIM.getKIMTable();
						KIM.getKimList();
					} else {
						$(save )
							.parents('tr')
							.find('.kimHardName, .kimName')
							.css({
								'border': '3px solid hsl(0, 69%, 22%)',
								'border-radius': '2px'
							});
					}
				});
			},

			removeKim: function (kimId) {
                cancelArticleBtn();
				$.ajax({
					url   : URL_KIM + 'removeKim',
					method: 'POST',
					data: {
					kimId: kimId
					}
				}).then(function (data)
				{
					if (true === data) {
						KIM.getKIMTable();
						KIM.getKimList();
					}
				});
			}
		},

		// metalls section
		metalls: {
			getMetallsTable: function() {
				return $.ajax({
					url: URL_METALLS + 'getMetallsTable',
					method: 'GET'
				}).then(function (data){
                    MAIN.metallTableContent = data.metallTableContent;
					 $('#tbodyMetalls').html(addMetallsTableHandler($(data.html)));
				}); 
			},

			editMetall: function (obj, scope) {
                cancelArticleBtn();
				$.ajax({
					url: URL_METALLS + 'editMetall',
					method: 'POST',
					data: obj
				}).then(function (data)
				{
					if (true === data) {
						METALLS.getMetallsTable();
						METALLS.getMetallsList();
					} else {
						$(scope)
							.parents('tr')
							.find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
							.css({
								'border': '3px solid hsl(0, 69%, 22%)',
								'border-radius': '2px'
							});
					}
					if (MAIN.isArticle && (obj.metallId === MAIN.metallId)) {
						TABS.getLeftTabContent(MAIN.productId, MAIN.curTabId);
					}
				});
			},

			getMetallsList: function () {
				$.ajax({
					url: URL_METALLS + 'getMetallsList',
					method: 'GET',
					data: {
						prId: MAIN.productId
					}
				}).then(function (data) {
					$('.listOfMetalls').html(data.html);
					var metall = $('.listOfMetalls option:selected').attr('metall');
					var metallOut = $('.listOfMetalls option:selected').attr('metallOut');
					$('[data-cell="PR1"]').val(metall);
					$('[data-cell="PR2"]').val(metallOut);
					$('#calx').calx();
				});
			},

			addMetallToTable: function (obj) {
                cancelArticleBtn();
				$.ajax( {
					url   : URL_METALLS + 'addMetallToTable',
					method: 'POST',
					data: obj
				} ).then( function ( data )
				{
					if (true === data) {
						$('#metallName, #metallPrice, #metallMass, #metallOutPrice, #metallArticle').val('');
						METALLS.getMetallsTable();
						METALLS.getMetallsList();
					}
				});
			},

			removeMetall: function(metallId) {
                cancelArticleBtn();
				$.ajax( {
					url   : URL_METALLS + 'removeMetall',
					method: 'POST',
					data: {
						metallId: metallId
					}
				} ).then( function ( data )
				{
					console.log(data);
					if (true === data) {
						METALLS.getMetallsTable();
						METALLS.getMetallsList();
					}
				});
			}
		},

		menu: {
			showMainMenu: function () {
				$('#livemill').prop('muted', true);
				MENU.activeClassValidation('#backIcon');
				localStorage.siteSector = 'MENU';
				showBody();
				$('#topIconsWrapper, #creatingProductsWrapper, #preferencesWrapper, #menuIconsRight, #menuIconsBottom, #menuIconsLeft').hide();
				$('#mainMenuWrapper').fadeIn();
			},
			
			runPreferences: function () {
				$('#livemill').prop('muted', true);
				if (MENU.activeClassValidation('#prefIcon')) {
					localStorage.siteSector = 'PR';
					showBody();
					$('#mainMenuWrapper, #databaseWrapper, #creatingProductsWrapper').hide();
					$('#topIconsWrapper, #preferencesWrapper').show();
				}
			},
			
			runDB: function () {
				$('#livemill').prop('muted', true);
				if (MENU.activeClassValidation('#dbIcon')) {
					localStorage.siteSector = 'DB';
					showBody();
					$('#mainMenuWrapper, #preferencesWrapper, #creatingProductsWrapper').hide();
					$.when(TABS.showKim()).done(function () {
						setTimeout(function(){ spinnerKim.stop(document.getElementById('orderSpinner')); }, 300);
					});
					$('#topIconsWrapper, #databaseWrapper').show();
					TABS.openProductCreation();
				}
			},
			
			runProductCreation: function () {
				if ($('#kimTab').hasClass('active')) {
					$('#livemill').prop('muted', false);
				}
				if (MENU.activeClassValidation('#prIcon')) {
					localStorage.siteSector = 'OR';
					showBody();
					$('#mainMenuWrapper, #preferencesWrapper, #databaseWrapper').hide();
					$('#topIconsWrapper, #creatingProductsWrapper').show();
					TABS.openProductCreation();
				}
			},
			
			showTopIcons: function (px, animate, timeout) {
				setTimeout(function(){
					$('#backIcon, #prefIcon, #dbIcon, #menuOpen, #prIcon').blur().animate( { "marginTop": px }, animate ); 
				}, timeout);
			},
			
			activeClassValidation: function (id) {
				if (!$(id).hasClass('activeTopIcon')) {
					$('#menuIconsTop div')
							.removeClass('activeTopIcon')
							.addClass('hvr-pulse-grow');
					$(id).addClass('activeTopIcon').removeClass('hvr-pulse-grow');
					return true;
				}
				return false;
			},
			
			onHoverElement: function(obj){
				var scope = obj.scope,
					css = obj.css,
					speed = obj.speed;
				$(scope).stop(true).delay(20)
					.animate( css, speed );
			},

			createFileManager: function() {
				$.ajax( {
					url   : URL_MENU + 'createFileManager',
					method: 'GET'
				} ).then( function ( data )
				{
					$('#fileManagerCatogoriesSelect' ).html(data.categories);
					$('#fileManagerProductsTable' ).html(addMenuProductHandler($(data.products)));
					$('#fileManagerOrdersTable' ).html(addMenuOrdersHandler($(data.orders)));
					$.each(data.orderDescription, function(name, arr) {
						var option = '<option></option>';
						$.each(arr, function(num, val) {
							option += '<option>' + val + '</option>';
						});
						$('[data-section="' + name.replace(/%/g, '') + '"]').html(option);
					});
					$('#openMenuModal').modal('show');
				});
			},
			
			searchInTable: function(rows, text) {
				if (!text) {
					rows.show();
				} else {
					rows.hide();
					$.each(rows, function(num, tr) {
						$.each($(tr), function(key, td) {
							if (-1 !== $(td).text().search(text)) {
								$(td).closest('tr').show();
								return true;
							}
						});
					});
				}
			},
			
			getPreferencesSettings: function () {
				return preferencesSettings;
			}
		},

		preferences: {
			insertFontSizes: function (arr, elem) {
				var i = 1;
				var option = '';
				for (i; i <= 60; i++) {
					option += $(elem).css('font-size') === i + 'px' ? '<option selected>' : '<option>';
					option += i + 'px</option>';
				}
				$.each(arr, function (num, target) {
					$(target).append(option);
				});
			},
			
			applyCss: function () {
				if (localStorage.customCSS) {
					try {
						$.each(JSON.parse(localStorage.customCSS), function (elem, obj) {
							$.each(obj, function (key, val) {
								$(elem).css(key, val);
							});
						});
						PREFERENCES.applyPreferences(MENU.getPreferencesSettings());
					} catch (err) {
						console.log(err);
					}
				}
			},

			applyPreferences: function (arr) {
				$.each(arr, function (num, obj) {
					$(obj.id).css({
						backgroundColor: $(obj.elem).css(obj.style)
					}).colorpicker({
						color: $(obj.elem).css(obj.style),
						backgroundColor: $(obj.elem).css(obj.style)
					}).on('changeColor', function(ev) {
						$(obj.id).css('backgroundColor', ev.color.toHex());
						PREFERENCES.applyColorAndSaveToLS(obj.cssArr, obj.style, ev, obj.important);
					});
				});
			},

			applyColorAndSaveToLS: function (cssArr, style, ev, important) {
				var imp = '';
				if (important && undefined !== important) {
					imp = ' !important';
				}
				$(cssArr.join(', ')).css(style, ev.color.toHex());
				for (var i = 0; i < cssArr.length; i++) {
					var css = PREFERENCES.checkStorageCSS(cssArr[i]);
					css[cssArr[i]][style] = ev.color.toHex() + imp;
					THEMES.addThemeCss(css);
				}
			},

			checkStorageCSS: function (elem) {
				if (!localStorage.customCSS) {
					localStorage.customCSS = JSON.stringify({});
				}
				var css = JSON.parse(localStorage.customCSS);
				if (!css[elem]) {
					css[elem] = {};
					localStorage.customCSS = JSON.stringify(css);
				}
				return JSON.parse(localStorage.customCSS);
			}
		},
		
        validation: {
            validateInputVal: function (obj) {
                var val = obj.val.trim();

                if (val && obj.digitsOnly) {
                    val = VALIDATION.digitsOnly(val);
                }

                if (val && obj.unique) {
                    val = VALIDATION.onUnique(val, obj.id);
                }

                if (!val) {
                    if (obj.id) {
                        VALIDATION.showError(obj.id);
                    }
                    return false;
                }

                return val;
            },

            /**
             * parse string remove all letters and change coma to dot
             *
             * @param val
             * @returns {string}
             */
            digitsOnly: function (val) {
                var res;
                res = val.replace(/[A-Za-z]+/g, '').replace(/,/g, '.');
                return res;
            },

            onUnique: function (val, id) {
                var articles, names;
                switch (id) {
                    case '#metallName':
                        names = MAIN.metallTableContent.names;
                        if (0 < names.length) {
                            val = VALIDATION.parseArray(names, val);
                        }
                        break;
                    case '#metallArticle':
                        articles = MAIN.metallTableContent.articles;
                        if (0 < articles.length) {
                            val = VALIDATION.parseArray(articles, val);
                        }
                        break;
                    case '#addCategoryInput':
                        names = MAIN.categoriesTableContent.names;
                        if (0 < names.length) {
                            val = VALIDATION.parseArray(names, val);
                        }
                        break;
                    case '#addCategoryArticleInput':
                        articles = MAIN.categoriesTableContent.articles;console.log(MAIN);
                        if (0 < articles.length) {
                            val = VALIDATION.parseArray(articles, val);
                        }
                        break;
                }
                return val;
            },

            showError: function (id) {
                $(id).addClass('inputError');
                setTimeout(function(){ $(id).removeClass('inputError'); }, 1000);
            },

            parseArray: function (arr, val) {
                var i;
                for (i = 0; i < arr.length; i++) {
                    if (val.toLowerCase() === arr[i].toLowerCase()) {
                        val = false;
                        break;
                    }
                }
                return val;
            }
        },

		themes: {
			addTheme: function () {
				return $.ajax( {
					url   : URL_THEMES + 'addTheme',
					method: 'POST',
					data: {
						name: $('#customThemeName').val()
					}
				} ).then( function ( data )
				{
					return data;
				});
			},
			
			getThemesList: function () {
				$.ajax( {
					url   : URL_THEMES + 'getThemesList',
					method: 'GET'
				} ).then( function ( data )
				{
					$('#customThemesList').html(data.html);
					MAIN.themesList = data.list;
					var activeTheme = MAIN.themesList['1'];
					if (_.size(activeTheme) && null !== activeTheme[_.keys(activeTheme)]) {
						localStorage.customCSS = activeTheme[_.keys(activeTheme)];
						PREFERENCES.applyCss();
					} else {
						localStorage.customCSS = '{}';
					}
					
				});
			},
			
			applyTheme: function () {
				var theme = $('#customThemesList option:selected').val();
				$.ajax( {
					url   : URL_THEMES + 'applyThemes',
					method: 'POST',
					data: {theme: theme}
				} ).then( function ( data )
				{
					if ('default' === theme) {
						delete localStorage.customCSS;
						window.location.href = LOCATION;
					} else {
						localStorage.customCSS = null !== data.css ? data.css : '{}';
						PREFERENCES.applyCss();
					}
				});
			},
			
			addThemeCss: function (css) {
				var theme = $('#customThemesList option:selected').val();
				if ('default' !== theme) {
					$.ajax( {
						url   : URL_THEMES + 'addThemeCss',
						method: 'POST',
						data: {
							theme: theme,
							css: css
						}
					} ).then( function ( data )
					{
						if (data) {
							localStorage.customCSS = JSON.stringify(css);
						}
					});
				}
			}
		}
	};

	// the actual object is created here, allowing us to 'new' an object without calling 'new'
	Dima.init = function() {

		var self = this;
		self.main = {};
		SELF  = this;
		MAIN = this.main,
		TABS = this.tabs;
		ORDER = this.order;
		PRODUCT = this.product;
        CATEGORIES = this.categories;
		KIM = this.kim;
		METALLS = this.metalls;
		MENU = this.menu;
		PREFERENCES = this.preferences;
        VALIDATION = this.validation;
		THEMES = this.themes;

		run();

	};

	// trick borrowed from jQuery so we don't have to use the 'new' keyword
	Dima.init.prototype = Dima.prototype;

	// attach our Dima to the global object, and provide a shorthand '$G' for ease our poor fingers
	global.Dima = global.D$ = Dima;
    
}(window, jQuery));