define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'calx'], function ($jq, methods, URLs, Mustache, PRODUCT) {var
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
        catchKey(this, mathAction, 0.01);
        methods.excel();
    },
    // change value in product table by keys
    rowValueInputKeydown = function (e) {
        switch (e.keyCode) {
            case 38: // UP
                catchKey(this, '+', 1);
                e.preventDefault();
                break;
            case 40: // DOWN
                catchKey(this, '-', 1);
                e.preventDefault();
                break;
            case 191: // /
                catchKey(this, '+', 10);
                e.preventDefault();
                break;
            case 17: // Ctrl
                catchKey(this, '-', 10);
                e.preventDefault();
                break;
            case 190: // >
                catchKey(this, '+', 100);
                e.preventDefault();
                break;
            case 18: // Alt
                catchKey(this, '-', 100);
                e.preventDefault();
                break;
            case 32: // Space
                e.preventDefault();
                break;
        }
    },
    rowValueInputKeyup = function (e) {
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
        var $this = $(this),
            rowName = $this.parent().find('.rowValueInput').attr('data-cell'),
            checkBinding = $('.list-group-item').find('.glyphicon:contains(' + rowName + ')');
        if (checkBinding.length) { checkBinding.remove();}
        $this.parent().hide('drop');
        $this.parent()
            .find('.rowNumber').text('').end()
            .find('.rowValueInput').attr('data-cell', '');
        setTimeout(function () { $this.parent().remove(); }, 500);
    },
    catchKey = function (el, mathAction, step) {
        var thisVal = Number($(el).val());
        if ('+' === mathAction) {
            $(el).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
        } else {
            $(el).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
        }
        methods.excel();
    },
    removeChar = function (string, index) {
        var res = '';
        for (var i in string) {
            (index !== Number(i)) ? res = res + string[i] : 1;
        }

        return res;
    },
    notIncludeInCell = ['KIM1', 'PR1', 'SUM1', 'PR2', 'SUM2'],
    addWhereCaret = function(caretPos, what) {
        var currentVal =  $jq.addFormulaInputPr.val();
        $jq.addFormulaInputPr.val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
    },
    toggleAddFormula = function() {
        '' !== $jq.addFormulaInputPr.val() ? $jq.addFormulaBtnPr.slideDown() : $jq.addFormulaBtnPr.slideUp();
    },
    addElementToFormulaInput = function() {
        var $this = $(this);
        addWhereCaret(localStorage.currentCaretPos, $this.text());
        localStorage.currentCaretPos = parseInt(localStorage.currentCaretPos) + parseInt($this.text().length);
        toggleAddFormula();
    },
    startCreateNewFormula = function () {
        var currentVal, ls;
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

            $('#addNewProductModal').attr('tabindex', '1').css('outline', 'none');
            $('#addNewProductModal')
                .unbind('keydown')
                .bind('keydown',function (e) {
                    if (e.keyCode === 8) {
                        currentVal =  $jq.addFormulaInputPr.val();
                        ls = localStorage.currentCaretPos;
                        currentVal = removeChar(currentVal, ls - 1);
                        $jq.addFormulaInputPr.val(currentVal);
                        localStorage.currentCaretPos--;
                        e.preventDefault();
                    }
                })
                .unbind('keypress')
                .bind('keypress', function(e) {
                    if (!$jq.addFormulaInputPr.is(":focus")) {
                        if (32 !== e.keyCode) {
                            addWhereCaret(localStorage.currentCaretPos, String.fromCharCode(e.keyCode));
                            localStorage.currentCaretPos++;
                        }
                    }
                })
                .unbind('keyup')
                .bind('keyup', function() {
                    toggleAddFormula();
                    localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
                })
                .off('click')
                .on('click', '.rowNumber', addElementToFormulaInput);
        }
    },
    addAvailableCellList = function(formula = $jq.addFormulaInputPr.val()) {
        var res = '<select><option val="false">Выберите ячейку</option>';
        $.each($('.rowValueInput'), function(num, obj){
            var cell = $(obj).attr('data-cell'),
                dataFormula = $(obj).attr('data-formula');
            if (-1 === formula.search(cell) && -1 === notIncludeInCell.indexOf(cell) && !dataFormula && checkInputOnFormula(formula, cell)) {
                res += '<option val="true">' + cell + '</option>';
            }
        });
        res += '</select>';
        return res;
    },
    addNewFormula = function(){
        var formula = $jq.addFormulaInputPr.val();
        if ('' !== formula) {
            $jq.formulasList.append(Mustache.render($jq.formulaTemplate.html(), {
                formula: formula,
                //availableCellList: addAvailableCellList()
            }));
            $('.removeFormula').hide();
            $('.editFormula').hide();
            cancelInputFormula();
            $jq.addFormulaInputPr.val('');
           // PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
        }
    },
    cancelInputFormula = function() {
        MAIN.clickOnFormulaInput = false;
        $jq.addFormulaInputPr.css('border-color', '' ).val('');
        $jq.formulaBtnGroupPr.hide('drop');
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
        $jq.formulasHelper.hide('slide');
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
            .click(startCreateNewFormula)
            .keydown(function(e){
                if (32 === e.keyCode) {
                    return false;
                }
            });
        // add new formula
        $jq.addFormulaBtnPr.click(addNewFormula);
        $jq.cancelFormulaBtnPr.click(cancelInputFormula);
    }

    return newProductHandler;
});
