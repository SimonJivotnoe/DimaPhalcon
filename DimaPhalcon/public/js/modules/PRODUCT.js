define(['jq', 'methods', 'URLs', 'CATEGORIES', 'KIM', 'METALLS', 'TABS', 'mustache', 'calx'], function ($jq, methods, URLs, CATEGORIES, KIM, METALLS, TABS, Mustache) {
    var PRODUCT = {
		cases: {
			categories: {
				modal: $jq.addCategoryModal,
				table: $jq.categoriesTable,
				deleteText: 'Вы уверены, что хотите удалить Категорию?',
				confirmDelete: CATEGORIES.confirmDelete
			},
			kim: {
				modal: $jq.addKimModal,
				table: $jq.kimTable,
				deleteText: 'Вы уверены, что хотите удалить КИМ?',
				confirmDelete: KIM.confirmDelete
			},
			metalls: {
				modal: $jq.addMetallModal,
				table: $jq.metallTable,
				deleteText: 'Вы уверены, что хотите удалить Металл?',
				confirmDelete: METALLS.confirmDelete
			}
		},
		getLeftTabsList: function () {
			$.ajax({
				url: URLs.getLeftTabsList,
				method: 'GET'
			}).then(function (response)
			{
				var html;

				MAIN.tabsList = response.tabsList;
				MAIN.tableContent = response.kim;
				MAIN.prRequested = true;
				
				if (response.template) {
					PRODUCT.addLeftTabsHandler($(Mustache.render($jq.leftTabsTemplate.html(), response))).insertAfter('#dbProductsListTab');
				}
				if (response.activeTabId && response.template) {
					PRODUCT.getLeftTabContent(response.productId, response.activeTabId);
				} else {
					$('#myTab, #leftTabsContent').fadeIn('slow');
					TABS.showPreferences();
					PRODUCT.createFileManager('PR');
				}
				$(response.formulasHelper).insertBefore('#addNewBtnSpan');
				$(function () {
					$('[data-toggle="tooltip"]').tooltip();
				});
			});
		},
		getLeftTabContent: function (productId, tabId) {
			localStorage.currentCaretPos = 0;
			$.ajax({
				url: URLs.getLeftTabContent + '/' + productId,
				method: 'GET'
			}).then(function (data)
			{
				var kim, metall, metallOut;

				$('#dbProductsListList').removeClass('active');
				$('.currentTab')
						.attr('id', tabId)
						.removeClass('saveInDB addedToOrder')
						.addClass('active ' + data.css)
						.html(PRODUCT.addLeftTabContentHandler($(data.html)));
				$('.removeRow').hide();

				MAIN.curTabId = tabId;
				MAIN.curTabName = 'a[href="#' + MAIN.curTabId + '"] .tabName';
				MAIN.productId = productId;
				MAIN.detailsForArticle = data.detailsForArticle;
				MAIN.isArticle = data.article;
				MAIN.metallId = data.metallId;

				if (!data.article) {
					kim = $('.listOfKim option:selected').attr('kim');
					metall = $('.listOfMetalls option:selected').attr('metall');
					metallOut = $('.listOfMetalls option:selected').attr('metallOut');
					$('[data-cell="KIM1"]').val(kim);
					$('[data-cell="PR1"]').val(metall);
					$('[data-cell="PR2"]').val(metallOut);
				} else {
					$('.rowValueInput').removeClass('rowValueInput');
					$('.cellBind').removeClass('cellBind');
					$('.glyphicon-retweet').removeClass('glyphicon-retweet');
					$('.removeFormula, .editFormula').remove();
					$('#metallHistorySelect option:last-child').prop('selected', true);
					PRODUCT.recalculateArticleTable();
				}
				$.each($('.bindFormulaWithCell'), function (num, obj) {
					var li = $(obj).closest('li');
					li.find('.addAvailableCellList').html(PRODUCT.addAvailableCellList(li.find('.formulaValue').text()));
				});
				methods.excel();
				methods.showBody();
				if (localStorage.addToOrder) {
					ORDER.addToOrder();
					delete localStorage.addToOrder;
					delete localStorage.alwaysInTable;
				}
				$(function () {
					$('[data-toggle="tooltip"]').tooltip();
				});
				$('#myTab, #leftTabsContent').fadeIn('slow');
			});
		},
		tempTable: {
			"%ROW_NUMBER%":   "",
			"%ROW_NAME%":	  "",
			"%DATA_CELL%":	  "",
			"%DATA_FORMULA%": "",
			"%INPUT_VALUE%":  ""
		},

		getTableContent: function (dom) {
			var tableContent = {},
				i = 0,
				temp;
			$.map($(dom), function(val) {
				temp = _.clone(PRODUCT.tempTable);
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

		createProductFromTemplate: function () {
			var obj = {prId: MAIN.productId, tab: 'new'};
			if ('currentTab' === $('#selectCreateproductWay').val()) {
				obj.tab = MAIN.curTabId;
			}
			$.ajax( {
				url   : URL_PRODUCT + 'createProductFromTemplate',
				method: 'POST',
				data: obj
			} ).then( function ( data )
			{
				if (true === data) {
					window.location.href = LOCATION;
				}
			});
		},

		recalculateArticleTable: function () {
			var selected = $('#metallHistorySelect option:selected');
			$('[data-cell="PR1"]' ).val(selected.attr('data-price'));
			$('[data-cell="PR2"]' ).val(selected.attr('data-outprice'));
			methods.excel();
			$.each($('.rowValue input'), function(num, obj){
				var cell = $(obj).attr('data-cell');
				$('[data-cellarticle="' + cell + '"]').text($(obj).val());
			});
		},

		getProductInfo: function (productId) {
			return $.ajax( {
				url   : URL_PRODUCT + 'getProductInfo',
				method: 'GET',
				data: {productId: productId}
			} ).then( function ( data )
			{
				return data;
			});
		},

		addLeftTabContentHandler: function(html) {
			html

			// edit & save categories list content
				.filter('.blockNameAndCat')
				.mouseover(function(){
					$('#editCategoriesListContent' ).show();
				})
				.mouseleave(function(){
					$('#editCategoriesListContent' ).css('display', 'none');
				} ).end()

			/*.filter('.tableContent')
			 .mouseover(function(){
			 $('#editTableContent' ).show();
			 })*/
				.mouseleave(function(){
					$('#editTableContent' ).css('display', 'none');
				} ).end()

			// edit Categories list of Product
				.on('click', '#editCategoriesListContent', function(){
					PRODUCT.cancelArticleBtn();
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

				.find('#metallHistorySelect').change(PRODUCT.recalculateArticleTable).end()

				.find('#saveInDB' ).click(function() {
					PRODUCT.saveProductInDB();
				}).end()

				.find('#addToOrderBtn').click(function () {
				console.log(MAIN);
				if (MAIN.orderId) {
					ORDER.addToOrder();
				} else {
					noty({
						text: 'Выберите Ордер',
						type: 'error',
						layout: 'center',
						/*animation: {
						 open: 'animated flipInX',
						 close: 'animated flipOutX'
						 },*/
						timeout: 900
					});
				}
				/*if (!MAIN.orderId) {
				 localStorage.addToOrder = MAIN.productId;
				 $('.rowValue input' ).addClass('rowValueInput');
				 localStorage.alwaysInTable = JSON.stringify(PRODUCT.getTableContent('#alwaysInTable li'));;
				 $('.rowValueInput').removeClass('rowValueInput');
				 ORDER.createNewOrder();
				 return true;
				 }
				 ORDER.addToOrder();*/
			}).end()

				.find('#createProductFromTemplate').click(PRODUCT.createProductFromTemplate).end()
				.find('.removeFormula' ).hide().end()

				.find('.editFormula' ).hide().end()

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
    };

    return PRODUCT;
});