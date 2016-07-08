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
				
				if (response.template) {
					PRODUCT.addLeftTabsHandler($(Mustache.render($jq.leftTabsTemplate.html(), response))).insertBefore('#addNewTab');
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

		addRowToTable: function (tableContent) {
			$('#sortable').append(Mustache.render($('#productTableRowTemplate').html(), tableContent));
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

		addLeftTabsHandler: function (html) {
			html
				// change current tab
				.find('[role=tab], #dbProductsListList').click(function(){
					if ($(this ).attr('aria-controls') !== MAIN.curTabId) {
						var tabsCloseRes = TABS.changeActiveTab({
							scope: this,
							curTabId: 'curTabId',
							tabsList: 'tabsList',
							getTabContent: 'getLeftTabContent',
							changeActiveTab: 'changeActiveTab',
							action: 'changeActiveLeftTab'
						});
						if (tabsCloseRes) {
							PRODUCT.getLeftTabContent(tabsCloseRes.prodId, tabsCloseRes.selectedTabId);
							TABS.changeActiveTabBack(tabsCloseRes.tabId, tabsCloseRes.selectedTabId, 'changeActiveLeftTab');
						}
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
			
			return html;
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
                    TABS.changeActiveTabBack('', '', 'changeActiveLeftTab');
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
					methods.blur($('#settingsMetallsWrapper'));
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

				.find('#cancelArticleBtn').click(PRODUCT.cancelArticleBtn).end()

				.find('#metallHistorySelect').change(PRODUCT.recalculateArticleTable).end()

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
					PRODUCT.cancelArticleBtn();
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
				methods.excel();
			}).end()

			// change metall in table
				.find('.listOfMetalls').change(function(){
				var metall = $('option:selected', this ).attr('metall');
				var metallOut = $('.listOfMetalls option:selected' ).attr('metallOut');
				$('[data-cell="PR1"]' ).val(metall);
				$('[data-cell="PR2"]' ).val(metallOut);
				methods.excel();
			}).end()

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
					methods.excel();
					PRODUCT.saveTable();
				})

				// change value in product table by keys
				.on('keydown', '.rowValueInput', function (e) {
					console.log('here');
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
							methods.excel();
							text = '' + $(this).val();
							$(this).caret(caretPos);
							if ('.' === text.charAt((text.length - 2))) {
								$(this).caret((text.length - 1));
							}
							PRODUCT.saveTable();
						}
					}
				})
				/*.find('#addFormulaBtnPr').click(function(){
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
				 .find('#cancelFormulaBtnPr' ).click(function(){
				 PRODUCT.cancelInputFormula();
				 }).end()
				 .on('click', '.fhBtn', function(){
				 PRODUCT.addElementToFormulaInput(this);
				 })
				 .on('mouseover', '.fhBtn', function() {
				 $( '.removeFhBtn', this).show('fast');
				 })
				 .on('mouseleave', '.fhBtn', function() {
				 $( '.removeFhBtn', this).hide('fast');
				 })
				 .on('click', '.removeFhBtn', function(e) {
				 e.stopPropagation();
				 e.preventDefault();
				 var fhText = $(this ).parent().text();
				 PRODUCT.removeFormulasHelper(this, fhText);
				 })
				 .on('click', '.addNewFhBtn', function(){
				 var newFl = $('#addNewFhBtnInput' ).val();
				 $('body').css('cursor', 'pointer');
				 $('#addFormulaInputPr' ).click();
				 PRODUCT.addBtnToFormulasHelper(newFl);
				 })
				 .on('click', '#addNewFhBtnInput', function(){
				 clickOnFormulaInput = false;
				 $('.currentTab ')
				 .unbind('keydown keypress keyup');
				 $('body').off('keypress')
				 .css('cursor', 'auto');
				 })*/
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
					methods.excel();
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
				$jq.productsTreeDB().jstree('destroy').jstree(MAIN.productsTreeDB);
				$('#databaseWrapper .innerBackLayout')
					.width($productsList.width())
					.height('100vh' )
					.css({top: $productsList.offset().top});
			});
		}
    };

    return PRODUCT;
});