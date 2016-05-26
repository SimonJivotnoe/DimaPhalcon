define(['jq', 'startPage'], function ($jq, startPage) {
    var appHandler = function () {
        $jq.runDB.click(function () {
            $jq.startPageWrapper.fadeOut();
            setTimeout(startPage.runDB, 300);
        });
        $('#outBodyElements').on('dblclick', '.categoriesListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.$editCategoryInput.val(MAIN.categoriesTableContent.data[id].name);
            $selectedRow = $this;
            $jq.$editCategoryModal.modal('show');
        });

        $('#outBodyElements').on('dblclick', '.kimListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.$editKimHardInput.val(MAIN.kimTableContent.data[id].name);
            $jq.$editKimInput.val(MAIN.kimTableContent.data[id]['value']);
            $jq.$editKimDescrInput.val(MAIN.kimTableContent.data[id].description);
            $selectedRow = $this;
            $jq.$editKimModal.modal('show');
        });

        $('#outBodyElements').on('dblclick', '.metallListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.$editMetallNameInput.val(MAIN.metallTableContent.data[id].name);
            $jq.$editMetallPriceInput.val(MAIN.metallTableContent.data[id].price);
            $jq.$editMetallMassInput.val(MAIN.metallTableContent.data[id].mass);
            $jq.$editMetallOutPriceInput.val(MAIN.metallTableContent.data[id]['out_price']);
            $selectedRow = $this;
            $jq.$editMetallModal.modal('show');
        });

        $('#addKimIcon').click(function () {
            methods.kimIconsToDefault();
            methods.launchAddNewModal();
        });

        /*$jq.editKimIcon.click(function () {
            methods.kimIconsToDefault(['#deleteKimIcon']);
            methods.editKim.call(this);
        });

        $jq.deleteKimIcon.click(function () {
            methods.kimIconsToDefault(['#editKimIcon']);
            methods.deleteKim.call(this);
        });

        $('#backKimIcon').click(function () {
            methods.kimIconsToDefault();
            methods.unfocus();
        });
        $jq.backDBTreeIcon.click(function () {
            var $productsTreeDB = $jq.$productsTreeDB();
            $('#dbProductsListList .innerBackLayout').show();
            productsTreeDB.plugins = _.difference(productsTreeDB.plugins, ['checkbox']);
            $productsTreeDB.jstree('destroy');
            $productsTreeDB.jstree(productsTreeDB);
            methods.toggleMainButtons($jq.$productsTreeDBButtons, $jq.$mainIcons);
            methods.hideLayout();
        });*/

        $('#addCategoryBtn').click(function(){
            var category = VALIDATION.validateInputVal({
                    val: $jq.$addCategoryInput.val(),
                    id: '#addCategoryInput',
                    unique: true
                }),
                article = VALIDATION.validateInputVal({
                    val: $jq.$addCategoryArticleInput.val(),
                    id: '#addCategoryArticleInput',
                    unique: true
                });
            if (category && article) {
                CATEGORIES.addCategory(category, article);
            }
        });
        $('#editCategoryBtn').click(function(){
            var name = VALIDATION.validateInputVal({
                val: $jq.$editCategoryInput.val()
            });
            if (name) {
                $.when(CATEGORIES.editCategory(name)).then(function (response) {
                    if (true === response.success) {
                        $.when(CATEGORIES.getCategories(), CATEGORIES.getCategoriesList() ).then(function () {
                            $jq.$editKimIcon.click().click();
                            $jq.$editCategoryModal.modal('hide');
                            setTimeout(MESSAGES.show.bind(this, response), 300);
                        });
                    } else {
                        MESSAGES.show(response);
                    }
                });
            }
        });

        $('#addKIMBtn').click(function(){
            var kim = VALIDATION.validateInputVal({
                    val: $jq.$kimInput.val(),
                    id: '#kimInput',
                    digitsOnly: true
                }),
                kimHardInput = VALIDATION.validateInputVal({
                    val: $jq.$kimHardInput.val(),
                    id: '#kimHardInput',
                    unique: true
                });
            if (kim && kimHardInput) {
                KIM.addKIM(kim, kimHardInput, $jq.$kimDescrInput.val());
            }
        });
        $('#editKimBtn').click(function(){
            var kim = VALIDATION.validateInputVal({
                    val: $jq.$editKimInput.val(),
                    digitsOnly: true
                }),
                kimHard = VALIDATION.validateInputVal({
                    val: $jq.$editKimHardInput.val()
                });
            if (kim && kimHard) {
                $.when(KIM.editKim(kim, kimHard, $jq.$editKimDescrInput.val())).then(function (response) {
                    if (true === response.success) {
                        $.when(KIM.getKIM(), KIM.getKimList() ).then(function () {
                            $jq.$editKimIcon.click().click();
                            $jq.$editKimModal.modal('hide');
                            setTimeout(MESSAGES.show.bind(this, response), 300);
                        });
                    } else {
                        MESSAGES.show(response);
                    }
                });
            }
        });

        $('#addMetallBtn').click(function(){
            var metall = VALIDATION.validateInputVal({
                    val: $jq.$metallNameInput.val(),
                    id: '#metallName',
                    unique: true
                }),
                price =  VALIDATION.validateInputVal({
                    val: $jq.$metallPriceInput.val(),
                    id: '#metallPrice',
                    digitsOnly: true
                }),
                mass =  VALIDATION.validateInputVal({
                    val: $jq.$metallMassInput.val(),
                    id: '#metallMass',
                    digitsOnly: true
                }),
                outPrice =  VALIDATION.validateInputVal({
                    val: $jq.$metallOutPriceInput.val(),
                    id: '#metallOutPrice',
                    digitsOnly: true
                }),
                article = VALIDATION.validateInputVal({
                    val: $jq.$metallArticleInput.val(),
                    id: '#metallArticle',
                    unique: true
                });
            if (metall && price && mass && outPrice && article) {
                METALLS.addMetall({
                    metall: metall,
                    price: price,
                    mass: mass,
                    outPrice: outPrice,
                    article: article
                });
            }
        });
        $('#editMetallBtn').click(function(){
            var id = $selectedRow.attr('data-id' ),
                metallName = VALIDATION.validateInputVal({
                    val: $jq.$editMetallNameInput.val()
                }),
                metallPrice =  VALIDATION.validateInputVal({
                    val: $jq.$editMetallPriceInput.val(),
                    digitsOnly: true
                }),
                metallMass =  VALIDATION.validateInputVal({
                    val: $jq.$editMetallMassInput.val(),
                    digitsOnly: true
                }),
                metallOutPrice =  VALIDATION.validateInputVal({
                    val: $jq.$editMetallOutPriceInput.val(),
                    digitsOnly: true
                });
            if (metallName && metallPrice && metallMass && metallOutPrice) {
                $.when(METALLS.editMetall({
                    metallId: id,
                    metallName: metallName,
                    metallPrice: metallPrice,
                    metallMass: metallMass,
                    metallOutPrice: metallOutPrice
                })).then(function (response) {
                    if (true === response.success) {
                        $.when(METALLS.getMetalls(), METALLS.getMetallsList()).then(function () {
                            $jq.$editKimIcon.click().click();
                            $jq.$editMetallModal.modal('hide');
                            setTimeout(MESSAGES.show.bind(this, response), 300);
                        });
                    } else {
                        MESSAGES.show(response);
                    }
                    if (MAIN.isArticle && (id === MAIN.metallId)) {
                        TABS.getLeftTabContent(MAIN.productId, MAIN.curTabId);
                    }
                });
            }
        });

        $('#addNewProductIcon').click(function () {

        });
        $('#showItemFromFileManager').click(function() {
            var product = [];
            $(this).hide();
            $.each($('.productsTreeDB li[data-section=product][aria-selected=true]' ), function (num, obj) {
                product.push($(obj).attr('data-productid'));
            });
            $.when(TABS.openSavedProduct(product, 'new', false, false)).done(function(){
                window.location.href = LOCATION;
            });
        });
        $('#addNewRow').click(function () {
            var numbersOfRows = 1,
                tableContent = {},
                temp,
                alwaysInTable,
                arr = [],
                max = 0,
                i;
            _products.cancelArticleBtn();
            if (0 === $('#sortable li').size()) {
                for (i = 0; i < numbersOfRows; i++) {
                    temp = _.clone(_products.tempTable);
                    temp['%ROW_NUMBER%'] = 'A' + (i + 1);
                    temp['%DATA_CELL%'] = 'A' + (i + 1);
                    tableContent[i] = temp;
                }
                alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
                PRODUCT.createTable(tableContent, alwaysInTable);
            } else {
                $.map($('#sortable .rowNumber'), function (val) {
                    if ('' !== $(val).text()) {
                        arr.push(parseInt($(val).text().substring(1)));
                    }
                });
                if (0 !== arr.length) {
                    max = Math.max.apply(Math, arr);
                }

                tableContent = PRODUCT.getTableContent('#sortable li');
                var row = {};
                for (var i = 0; i < numbersOfRows; i++) {
                    row = _.clone(_products.tempTable);
                    row['%ROW_NUMBER%'] = 'A' + (max + 1);
                    row['%DATA_CELL%'] = 'A' + (max + 1);
                    //tableContent[max] = temp;
                    max++;
                }
                //alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
                //PRODUCT.createTable(tableContent, alwaysInTable);
                PRODUCT.addRowToTable(row);
            }
        });
        // add new formula
        $('#addFormulaBtnPr').click(function(){
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
        });

        // create formula
        $('#addFormulaInputPr')
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
                    $('#addNewProductModal ').attr('tabindex', '1').css('outline', 'none');
                    $('#addNewProductModal ')
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
            } );

        //cancel create new formula
       // $('#cancelFormulaBtnPr' ).click(PRODUCT.cancelInputFormula);

        // add formulas helper to formula input
        $('#formulasHelper')
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
            });

        // add new formula helper
        $('.addNewFhBtn').click(function(){
            var newFl = $('#addNewFhBtnInput' ).val();
            $('body').css('cursor', 'pointer');
            $('#addFormulaInputPr' ).click();
            PRODUCT.addBtnToFormulasHelper(newFl);
        });

        // focus on formula helper input
        $('#addNewFhBtnInput').click(function(){
            clickOnFormulaInput = false;
            $('.currentTab ')
                .unbind('keydown keypress keyup');
            $('body').off('keypress')
                .css('cursor', 'auto');
        });

        // hide all removeFormula icons
        //.find('.removeFormula' ).hide();
    };

    return appHandler;
});