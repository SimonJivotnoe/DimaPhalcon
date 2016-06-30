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
    // change value in product table by keys
    rowValueInputKeydown = function (e) {
        console.log('here');
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
    }

    var newProductHandler = function () {
        $jq.kimList.change(changeKimList);
        $jq.metallsList.change(changeMetallList);
        $('#addNewRow').click(addNewRow);
        $jq.productTableWrapper
            .on('keydown', '.rowValueInput', rowValueInputKeydown)
            .on('click', '.removeRow', removeRow);

    }

    return newProductHandler;
});
