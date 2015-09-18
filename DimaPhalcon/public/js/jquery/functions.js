$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};
var app = {    
    BASE_URL: 'http://DimaPhalcon/DimaPhalcon/',
    addHandlers: function() { 
    },
    tabs: {
        URL: 'tabs/',
        dom: {
            closeTab: '.closeTab',
            addCategoryInput: '#addCategoryInput',
            curTabId: '',
            productId: '',
            curTabName: '',
            tabsList: '',
            createOrderBtn: '#createOrderBtn'
        }
    },
    product: {
        URL: 'products/',
        dom: {
           sortable: '#sortable',
           alw: '#alwaysInTable',
           addNewRow: '#addNewRow',
           duration: '#duration',
           rowNumber: '.rowNumber',
           removeRow: '.removeRow',
           rowValueInput: '.rowValueInput',
           addFormulaBtnPr: '#addFormulaBtnPr',
           formulasList: '#formulasList',
           addFormulaInputPr: '#addFormulaInputPr',
           removeFhBtn: '.removeFhBtn'
        },
        addBtnToFormulasHelper: function (newFl) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'addBtnToFormulasHelper',
                method: 'POST',
                data: {'newFl': newFl}
            } ).then( function ( data )
            {console.log(data);
                if (true === data) {
                    $('<span class="justCreated"><button type="button" class="btn custom-addRowsToTable btn-xs fhBtn">' + newFl + '' +
                    '<span class="glyphicon glyphicon-remove removeFhBtn" aria-hidden="true"></span></button></span>').insertBefore('#addNewBtnSpan');
                    $('.justCreated' ).find('.removeFhBtn').hide('fast');
                    $('.justCreated' ).show('slow' ).removeClass('.justCreated');
                    $('#addNewFhBtnInput' ).val('');
                }

            });
        },
        checkInputOnFormula: function(formula, cell) {
            var tableContent = this.getTableContent(this.dom.sortable + ' li'),
                alwaysInTable = this.getTableContent(this.dom.alw + ' li'),
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
                (-1 !== formula.search(key)) ? cellsInFormula.push(key) : 0;
            });
            $.each(cellsInFormula, function (key, val) {
                (-1 !== cellsArr[val].search(cell)) ? res = false : 0;               

            });
            return res;
        }
    },
    kim: {
        URL: 'kim/',
        tableContent: ''
    },
    metalls: {
        URL: 'metalls/'
    },
    order: {
    }
};



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