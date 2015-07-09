$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};

var tabs = {
    curTabId: '',
    productId: '',
    curTabName: '',
    tabsList: '',
    addTab: function (id) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/addNewTab/' + id,
            method: 'POST'
        } ).then( function ( data )
        {console.log(data);
            window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
        });
    },
    changeActiveTab: function (id, tabId) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/changeActiveTab' ,
            method: 'POST',
            data: {
                id: id,
                tabId: tabId
            }
        });
    },
    changeTabName: function (prId, prName, categoryId) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/changeTabName',
            method: 'POST',
            data: {
                prId: prId,
                prName : prName,
                categoryId : categoryId
            }
        } ).then( function ( data )
        {
            console.log(data);
        });
    }
};

var product = {
    self: this,
    sortable: '#sortable',
    alw: '#alwaysInTable',
    createTable: function(prId, tableContent, alwaysInTable) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/products/createTable',
            method: 'POST',
            data: {
                'prId' : tabs.productId,
                'tableContent' : JSON.stringify(tableContent),
                'alwaysInTable' : JSON.stringify(alwaysInTable)
            }
        } ).then( function ( data )
        {
            $(self.sortable ).html(data[0]);
            $(self.alw ).html(data[1]);
            $('.removeRow' ).hide();
        });
    },
    getTableContent: function (dom) {
        var tableContent = {};
        var i = 0;
        $.each($(dom), function(key, val) {
            var temp = new RowTemplate();
            if ('' !== $('.rowNumber', val ).text()) {
                temp.temp['%ROW_NUMBER%'] = $('.rowNumber', val ).text();
                temp.temp['%ROW_NAME%'] = $('.rowNameInput', val ).val();
                temp.temp['%DATA_CELL%'] = $('.rowValueInput', val ).attr('data-cell');
                temp.temp['%DATA_FORMULA%'] = $('.rowValueInput', val ).attr('data-formula');
                temp.temp['%INPUT_VALUE%'] = $('.rowValueInput', val ).val();
                tableContent[i] = temp.temp;
                i++;
            }
        });

        return tableContent;
    },
    saveTable: function () {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/products/changeTableContent',
            method: 'POST',
            data: {
                prId: tabs.productId,
                tableContent: JSON.stringify(this.getTableContent(this.sortable + ' li')),
                alwaysInTable: JSON.stringify(this.getTableContent(this.alw + ' li'))
            }
        } ).then( function ( data )
        {
            console.log(data);
        });
    },
    catchKey: function (el, mathAction, step) {
        var thisVal = Number($( el ).val());
        if ('+' === mathAction) {
            $(el ).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
        } else {
            $(el ).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
        }
        $( '#calx' ).calx();
        this.saveTable(tabs.productId);
    },
    addFormulaBtnPr: '#addFormulaBtnPr',
    formulaInputValue: function() {
        return $('#addFormulaInputPr').val();
    },
    addNewFormula: function (formulas) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/addNewFormula',
            method: 'POST',
            data: {
                formulas: formulas,
                prId : tabs.productId
            }
        } ).then( function ( data )
        {
            if (true === data) {

            }
        });
    },
    checkInputOnFormula: function(formula, cell) {
        var tableContent = this.getTableContent(this.sortable + ' li');
        var alwaysInTable = this.getTableContent(this.alw + ' li');
        var cellsArr = {};
        var cellsInFormula = [];
        $.each(tableContent, function (key, val) {
            cellsArr[val['%DATA_CELL%']] = val['%DATA_FORMULA%'];
        });
        $.each(alwaysInTable, function (key, val) {
            cellsArr[val['%DATA_CELL%']] = val['%DATA_FORMULA%'];
        });
        $.each(cellsArr, function (key) {
            (-1 !== formula.search(key)) ? cellsInFormula.push(key) : 0;
        });
       /* $.each(cellsInFormula, function (key, val) {
            $.each(cellsArr, function (k, v) {
                if (-1 !== v['%DATA_FORMULA%'].search(val)) {
                    
                }
            (-1 !== v['%DATA_FORMULA%'].search(val)) ? cellsInFormula.push(key) : 0;
        });
        });*/

        console.log(cellsInFormula);
    }
};

function RowTemplate() {
    this.temp = {
        "%ROW_NUMBER%": "",
        "%ROW_NAME%": "",
        "%DATA_CELL%": "",
        "%DATA_FORMULA%": "",
        "%INPUT_VALUE%": ""
    };
}

function showPreferences(){
    $('#preferences, #preferences1').addClass('active');
    $('.bg-danger' ).fadeOut(10);
    $('#addCategoryInput' ).val('');
    getCategoriesList();
    $('body' ).fadeIn(350);
}

function cancelInputFotmula() {
    $('#addFormulaInputPr' ).css('border-color', '' ).val('');
    $('#addFormulaInputPr, .rowNumber').off('click');
    $('body').off('keypress');
    $('body').off('click', '.rowNumber');
    $('body').css('cursor', 'auto');
    $(document).keydown(function (e) {
        if (e.which === 8) {
            return true;
        }
    });
    $('#formulasHelper' ).hide('slide');
}

function addWhereCaret(caretPos, what) {console.log(caretPos);
    var currentVal =  $('#addFormulaInputPr').val();
    $('#addFormulaInputPr').val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
}

function caretPositionInFormulaInput() {
    var caret = 0;
    return function() {
        caret = document.getElementById('addFormulaInputPr').selectionStart;
        return caret;
    };    
}

function caretAfterBlur() {
    var caret = 0;
    return function(position) {
        if ('' !== position) {
            caret = position;
            return caret;
        } else {
            console.log(caret);
        }       
    };     
}

function removeChar(string, index){
    var res = '';
    for (var i in string) {
      (index !== Number(i)) ? res = res + string[i] : 1;        
    }
  
 return res;
}