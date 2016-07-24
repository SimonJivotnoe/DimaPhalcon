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

				.find('#metallHistorySelect').change(PRODUCT.recalculateArticleTable).end()

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
			}).end()
			return html;
		}
    };

    return PRODUCT;
});