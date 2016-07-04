define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION) {var
    changeKimList = function () {
        var kim = $('option:selected', this ).attr('data-val');
        $('#addNewProductModal [data-cell="KIM1"]' ).val(kim);
        methods.excel();
    },
    changeMetallList = function () {
        var metallList = $jq.addNewProductModal.find('.metallsList option:selected');
        $('#addNewProductModal [data-cell="PR1"]').val(metallList.attr('data-price'));
        $('#addNewProductModal [data-cell="PR2"]').val(metallList.attr('data-outprice'));
        methods.excel();
    },
    addNewRow = function () {
        var numbersOfRows = 1,
            tableContent = {},
            temp,
            alwaysInTable,
            arr = [],
            max = 0,
            i;
        methods.cancelArticleBtn();
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
                row = _.clone(PRODUCT.tempTable);
                row['%ROW_NUMBER%'] = 'A' + (max + 1);
                row['%DATA_CELL%'] = 'A' + (max + 1);
                //tableContent[max] = temp;
                max++;
            }
            //alwaysInTable = PRODUCT.getTableContent('#alwaysInTable li');
            //PRODUCT.createTable(tableContent, alwaysInTable);
            PRODUCT.addRowToTable(row);
        }
    },
    rowValueInputMousewheel = function (e) {
        var mathAction = '-';
        if (1 === e.deltaY) {
            mathAction = '+';
        }
        formulas.catchKey(this, mathAction, 0.01);
        methods.excel();
    },
    // change value in product table by keys
    rowValueInputKeydown = function (e) {
        e.stopPropagation();
        switch (e.keyCode) {
            case 38: // UP
                formulas.catchKey(this, '+', 1);
                e.preventDefault();
                break;
            case 40: // DOWN
                formulas.catchKey(this, '-', 1);
                e.preventDefault();
                break;
            case 191: // /
                formulas.catchKey(this, '+', 10);
                e.preventDefault();
                break;
            case 17: // Ctrl
                formulas.catchKey(this, '-', 10);
                e.preventDefault();
                break;
            case 190: // >
                formulas.catchKey(this, '+', 100);
                e.preventDefault();
                break;
            case 18: // Alt
                formulas.catchKey(this, '-', 100);
                e.preventDefault();
                break;
            case 32: // Space
                e.preventDefault();
                break;
        }
    },
    rowValueInputKeyup = function (e) {
        e.stopPropagation();
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
            }
        }
    },
    removeRow = function () {
        var $this = $(this);
        $this.parent()
            .find('.rowNumber').text('').end()
            .find('.rowValueInput').attr('data-cell', '').end()
            .hide('drop');
        setTimeout(function () { $this.parent().remove(); }, 500);
    },
    formulas = {
        catchKey: function (el, mathAction, step) {
            var thisVal = Number($(el).val());
            if ('+' === mathAction) {
                $(el).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
            } else {
                $(el).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
            }
            methods.excel();
        }, 
        removeChar: function (string, index) {
            var res = '';
            for (var i in string) {
                if (index !== Number(i)) {
                    res = res + string[i];
                }
            }
    
            return res;
        },
        addWhereCaret: function(caretPos, what) {
            var currentVal =  $jq.addFormulaInputPr.val();
            $jq.addFormulaInputPr.val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
        },
        toggleAddFormula: function() {
            '' !== $jq.addFormulaInputPr.val() ? $jq.addFormulaBtnPr.slideDown() : $jq.addFormulaBtnPr.slideUp();
        },
        addElementToFormulaInput: function() {
            if (MAIN.clickOnFormulaInput) {
                var $this = $(this);
                formulas.addWhereCaret(localStorage.currentCaretPos, $this.text());
                localStorage.currentCaretPos = parseInt(localStorage.currentCaretPos) + parseInt($this.text().length);
                formulas.toggleAddFormula();
            }
        },
        startCreateNewFormula: function () {
            localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
            $('#addNewFhBtnInput').val('');
            if (!MAIN.clickOnFormulaInput) {
                MAIN.clickOnFormulaInput = true;
                $('body').css('cursor', 'pointer');
    
                $jq.addFormulaInputPr.css('border-color', 'rgba(82, 168, 236, 0.8)');
                $jq.formulasHelper.show('scale');
                $('#addFormulaBtnPr').hide();
                $('.formulaBtnGroupPr').show('drop');
    
                $('.removeFhBtn').hide();
            }
        },
        beautifyFormula: function (formula) {
            var constRules = {
                KIM1: '#388398',
                TAN: '#E817D7',
                SIN: '#17E828',
                RADIANS: '#E89117'
            },
                //operatorRules = ['+', '-', '*', '=', '(', ')'];
                operatorRules = ['+'];
            function escapeRegex(value) {
                return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
            }
            $.each(constRules, function (elem, color) {
                formula = formula.replace(new RegExp(elem,"g"), `<span style="color: ${color};">${elem}</span>`);
            });
            $.map(operatorRules, function (operator) {
                formula = formula.replace(new RegExp(escapeRegex(operator),"g"), ` <span class="plusBold">${operator}</span> `);
            });
            formula = formula.replace(/\*/g, `<span class="plusBold">*</span>`);
			formula = formula.replace(/(A\d+)/g, '<span class="Acolor">$1</span>');
            formula = formula.replace(/>([ ]*\d+\.?\d{0,3}[ ]*)</g, '><span class="likeNumber">$1</span><');
            return formula;
        },
        addNewFormula: function(){
            var formula = $jq.addFormulaInputPr.val();
            if ('' !== formula) {
                formula = formula.replace(/,/, '.');
                $jq.formulasList.find('tbody').append(Mustache.render($jq.formulaTemplate.html(), {
                    formula: formula,
                    beautyFormula: formulas.beautifyFormula(formula)
                    //availableCellList: addAvailableCellList()
                }));
                $('.removeFormula').hide();
                $('.editFormula').hide();
                formulas.cancelInputFormula();
                $jq.addFormulaInputPr.val('');
               // PRODUCT.formulas.addNewFormula(PRODUCT.getFormulasList, true);
            }
        },
        cancelInputFormula: function() {
            MAIN.clickOnFormulaInput = false;
            $jq.addFormulaInputPr.css('border-color', '' ).val('');
            $jq.formulaBtnGroupPr.hide('drop');
    
            $('body').css('cursor', 'auto');
            $(document).keydown(function (e) {
                if (e.which === 8) {
                    return true;
                }
            });
            $jq.formulasHelper.hide('slide');
        },
        applyFormula: function () {
            var $this = $(this),
                formula = $this.attr('data-formula'),
                isChecked = $this.prop('checked'),
                S1 = $jq.addNewProductModal.find('[data-cell="S1"]');
            if (!isChecked) {
                formula = '';
                S1.val('');
            } else {
                $('.applyFormula').removeClass('appliedFormula');
                $this.addClass('appliedFormula');
                $('#formulasList .applyFormula').not('.appliedFormula').prop('checked', false);
            }
            S1.attr('data-formula', formula);
            if (!methods.excel()) {
                $this.prop('checked', false);
                S1.attr('data-formula', '');
            }
        },
        editFormula: function () {
    
        },
        removeFormulasHelper: function (id) {
            return $.ajax( {
                url   : URLs.removeBtnFromFormulasHelper + '/' + id,
                method: 'DELETE'
            });
        },
        addElementToFormulaInput: function() {
            var $this = $(this);
            formulas.addWhereCaret(localStorage.currentCaretPos, $this.text());
            localStorage.currentCaretPos = parseInt(localStorage.currentCaretPos) + parseInt($this.text().length);
            formulas.toggleAddFormula();
        },
        removeFnBtn: function(e) {
            var $this = $(this);
            e.stopPropagation();
            e.preventDefault();
            formulas.removeFormulasHelper($this.attr('data-id')).then(function (response) {
                if (response.success) {
                    $this.parent().fadeOut('slow');
                }
            });
        },
        addNewFhBtn: function () {
            var formula = $jq.addNewFhBtnInput.val();
            $('body').css('cursor', 'pointer');
            $jq.addFormulaInputPr.click();
            formulas.addBtnToFormulasHelper(formula).then(function (response) {
                $(Mustache.render($jq.justCreatedFormula.html(), {
                    formula: formula,
                    id: response.data.id
                })).insertBefore('#addNewBtnSpan');
                $('.justCreated')
                    .find('.removeFhBtn').hide('fast').end()
                    .show('slow' ).removeClass('.justCreated');
                $jq.addNewFhBtnInput.val('');
            });
        },
        addBtnToFormulasHelper: function (newFl) {
            return $.ajax({
                url   : URLs.addBtnToFormulasHelper,
                method: 'POST',
                data: {'newFl': newFl}
            });
        },
    },
    saveProduct = {
        getData: function () {
            var data = {
                productName: VALIDATION.validateInputVal({
                    val: $jq.productNameInput.val(),
                    id: '.productNameInput',
                }),
                category: $jq.addNewProductModal.find('.categoriesList option:selected').attr('data-id'),
                kim: $jq.addNewProductModal.find('.kimList option:selected').attr('data-id'),
                metall: $jq.addNewProductModal.find('.metallsList option:selected').attr('data-id')
            };
            return data;
        },
        getTableContent: function (elem) {
            var tableContent = [],
                i = 0,
                temp;
            $.map($(elem), function(row) {
                temp = {
                    rowNumber: $('.rowNumber', row ).text(),
                    rowNameInput: $('.rowNameInput', row ).val(),
                    rowValueInput: $('.rowValueInput', row ).val(),
                    dataCell: $('.rowValueInput', row ).attr('data-cell'),
                    dataFormula: $('.rowValueInput', row ).attr('data-formula')
                };
                tableContent.push(temp);
            });

            return tableContent;
        },
        addNewProductBtn: function () {
            var data = saveProduct.getData();
            data.tableContent = saveProduct.getTableContent('#sortable li'),
            data.alwaysInTable = saveProduct.getTableContent('#alwaysInTable li');
            $.ajax({
                url   : URLs.saveProduct,
                method: 'POST',
                data: data
            });
        }

    }

    var newProductHandler = function () {
        $jq.kimList.change(changeKimList);
        $jq.metallsList.change(changeMetallList);

        $jq.addNewRow.click(addNewRow);

        $jq.productTableWrapper
            .on('mousewheel', '.rowValueInput', rowValueInputMousewheel)
            .on('keydown', '.rowValueInput', rowValueInputKeydown)
            .on('keyup', '.rowValueInput', rowValueInputKeyup)
            .on('click', '.removeRow', removeRow);

        // create formula
        $jq.addFormulaInputPr
            .click(formulas.startCreateNewFormula)
            .keydown(function(e){
                if (32 === e.keyCode) {
                    return false;
                }
            });
        // add new formula
        $jq.addFormulaBtnPr.click(formulas.addNewFormula);
        $jq.cancelFormulaBtnPr.click(formulas.cancelInputFormula);
        $jq.addNewProductModal
            .keydown(function (e) {
                if (MAIN.clickOnFormulaInput) {
                    if (e.keyCode === 8) {
                        var currentVal =  $jq.addFormulaInputPr.val();
                        var ls = localStorage.currentCaretPos;
                        currentVal = formulas.removeChar(currentVal, ls - 1);
                        $jq.addFormulaInputPr.val(currentVal);
                        localStorage.currentCaretPos--;
                        e.preventDefault();
                    }
                }
            })
            .keypress(function(e) {
                if (MAIN.clickOnFormulaInput) {
                    if (!$jq.addFormulaInputPr.is(":focus")) {
                        if (32 !== e.keyCode) {
                            formulas.addWhereCaret(localStorage.currentCaretPos, String.fromCharCode(e.keyCode));
                            localStorage.currentCaretPos++;
                        }
                    }
                }
            })
            .keyup(function() {
                if (MAIN.clickOnFormulaInput) {
                    formulas.toggleAddFormula();
                    localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
                }
            })
            .on('click', '.rowNumber', formulas.addElementToFormulaInput)
            .on('click', '.applyFormula', formulas.applyFormula)
            .on('dblclick', '.formulaValue', formulas.editFormula);

        $jq.formulasHelper
            .on('click', '.fhBtn', formulas.addElementToFormulaInput)
            // show remove formulas helper
            .on('mouseover', '.fhBtn', function() {
                $( '.removeFhBtn', this).show('fast');
            })
            // hide remove formulas helper
            .on('mouseleave', '.fhBtn', function() {
                $( '.removeFhBtn', this).hide('fast');
            })
            .on('click', '.removeFhBtn', formulas.removeFnBtn);
        $jq.addNewFhBtnInput.click(function(){
            MAIN.clickOnFormulaInput = false;
            $('body').css('cursor', 'auto');
        });
        $jq.addNewFhBtn.click(formulas.addNewFhBtn);
        $jq.addNewProductBtn.click(saveProduct.addNewProductBtn);
    }

    return newProductHandler;
});