define(function (require) {
	var $jq = require('jq');
	var methods = require('methods');
	var URLs = require('URLs');
	var CATEGORIES = require('CATEGORIES');
	var KIM = require('KIM');
	var METALLS = require('METALLS');
	var TABS = require('TABS');
	
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
		loadKimSection: function () {
			CATEGORIES.getCategories();
			KIM.getKIM();
			METALLS.getMetalls();
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

				if (response.html) {
					html = $(response.html);
					PRODUCT.addLeftTabsHandler(html);
					html.insertBefore('#addNewTab');
				}
				if (response.activeTabId && response.html) {
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
						.html(addLeftTabContentHandler($(data.html)));
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
					_products.recalculateArticleTable();
				}
				$.each($('.bindFormulaWithCell'), function (num, obj) {
					var li = $(obj).closest('li');
					li.find('.addAvailableCellList').html(PRODUCT.addAvailableCellList(li.find('.formulaValue').text()));
				});
				$('#calx').calx();
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
		addLeftTabsHandler: function (html) {

			html
				// change current tab
				.find('[role=tab], #dbProductsListList').click(function(){
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
		},
		
        addProductsDbHandler: function(html) {
            html
                .find('#db-left-component').css('width', localStorage['db-split']).end()

                .find('#db-divider, #db-right-component').css('left', localStorage['db-split']).end()

                .find('#db-divider').on('mousemove', function(){
                    localStorage['db-split'] = $('#db-divider').css('left');
                }).end()

                .find('#dbProductsListList .productsTreeDB' ).on('changed.jstree', function(){
                    return false;
                }).end()

                .find('#fileManagerCatogoriesSelect' ).change(function() {
                    var category = $('option:selected', this ).attr('name' );
                    $.each($('.prManProductTableCategory'), function(){
                        $(this ).parent().show();
                        if ($(this).attr('name') !== category && 'categoriesAll' !== category) {
                            $(this ).parent().hide();
                        }
                    });
                }).end()

                .find('#dbProductsListTab').click(function(){
                    TABS.setActiveDefaultTab('tabsList', 'dbProductsListTab', 'curTabId');
                    TABS.changeActiveTab('', '', 'changeActiveLeftTab');
                    PRODUCT.createFileManager('PR');
                }).end()

                .find('.categoriesWrapper, .kimWrapper, .metallWrapper' ).click(function(){
                    MAIN.focusedElem = $(this);
                    var scrollTable = MAIN.focusedElem.find('table').attr('data-scroll');
                    MAIN.scrollTables.scrollTop = MAIN.focusedElem.find('.dataTables_scrollBody').scrollTop();
                    if (MAIN.scrollTables[scrollTable]) {
                        MAIN.scrollTables[scrollTable].destroy();
                        MAIN.scrollTables[scrollTable] = false;
                    }
                    methods.focus(scrollTable);
                } ).end()

                .find('#dbProductsListList .innerBackLayout').click(function(){
                    var $productsTreeDB = $jq.productsTreeDB();
                    $(this ).hide();
                    MAIN.productsTreeDB.plugins.push('checkbox');
                    MAIN.productsTreeDB.plugins = _.uniq(MAIN.productsTreeDB.plugins);
                    $productsTreeDB.jstree('destroy');
                    $productsTreeDB.jstree(MAIN.productsTreeDB);
                    methods.toggleMainButtons($jq.mainIcons, $jq.productsTreeDBButtons);
                    methods.showLayout($('#settingsMetallsWrapper'));
                } ).end()

                .find('#addNewTab').on('click', function(){
                    TABS.getLastLeftTab();
                }).end()

                .find('#FMsearchInProducts').keyup(function() {
                    var text = $(this).val(),
                        rows = $('#fileManagerProductsTable tr:gt(0)');
                    MENU.searchInTable(rows, text, 'tr');
                }).end()

                .find('#tabs').on('dblclick', '#myTab li', function(){
                    localStorage['db-split'] === MAIN.maxScreenSize ? localStorage['db-split'] = MAIN.defaultScreenSize : localStorage['db-split'] = MAIN.maxScreenSize;
                    $('#db-left-component').css('width', localStorage['db-split']);
                    $('#db-divider, #db-right-component').css('left', localStorage['db-split']);
                });
            return html;
        },
		createFileManager: function(param) {
			$.ajax( {
				url   : URLs.getProductsTree,
				method: 'GET',
				data: {param: param}
			} ).then( function ( response )
			{
				var $productsList = $jq.dbProductsListList();
				MAIN.productsTreeDB.core.data = response.tree;
				$('.productsTreeDB' ).jstree(MAIN.productsTreeDB);
				$('#databaseWrapper .innerBackLayout')
					.width($productsList.width())
					.height('100vh' )
					.css({top: $productsList.offset().top});
			});
		}
    };

    return PRODUCT;
});