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
        createTable: function(tableContent, alwaysInTable) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'createTable',
                method: 'POST',
                data: {
                    prId: app.tabs.dom.productId,
                    tableContent: JSON.stringify(tableContent),
                    alwaysInTable: JSON.stringify(alwaysInTable)
                }
            } ).then( function ( data )
            {
                $(self.dom.sortable ).html(data[0]);
                $(self.dom.alw ).html(data[1]);
                $(self.dom.removeRow ).hide();
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
            this.saveTable(self.tabs.productId);
        },        
        formulaInputValue: function() {
            return $('#addFormulaInputPr').val();
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
        removeFormulasHelper: function(dom, fhText) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'removeBtnFromFormulasHelper',
                method: 'POST',
                data: {'fhText': fhText}
            } ).then( function ( data )
            {
                $(dom ).parent().fadeOut('slow');

            });
        },
        addNewFormula: function (formulas, binding) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'addNewFormula',
                method: 'POST',
                data: {
                    formulas: formulas,
                    prId : app.tabs.dom.productId
                }
            } ).then( function ( data )
            {console.log(data);
                if (true === binding) {
                   self.saveTable();         
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
        },
        getFormulasList: function() {
            var formulasList = {},
                formula,
                cell;
            $.each($('.formula'), function(key, val) {
                formula = $('.formulaValue', val ).text();
                cell = $.trim($('.cellBind', val ).text());
                formulasList[key] = {
                    formula: formula,
                    cell: cell
                };
            });
            return JSON.stringify(formulasList);
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