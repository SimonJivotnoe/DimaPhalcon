$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};
var app = {
    BASE_URL: 'http://DimaPhalcon/DimaPhalcon/',
    tabs: {
        URL: 'tabs/',
        dom: {
            closeTab: '.closeTab',
            addCategoryInput: '#addCategoryInput',
            curTabId: '',
            productId: '',
            curTabName: '',
            tabsList: ''
        },        
        addTab: function (id) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'addNewTab/' + id,
                method: 'POST'
            } ).then( function ( data )
            {
                window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
            });
        },
        changeActiveTab: function (id, tabId) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'changeActiveTab' ,
                method: 'POST',
                data: {
                    id: id,
                    tabId: tabId
                }
            });
        },
        closeTabMethod: function (idDb, currentID) {
            var self = this,
                nextActiveTab = self.dom.curTabId,
                productId = self.dom.productId,
                elemInObj = Object.keys(self.dom.tabsList);    
            if (1 === elemInObj.length) {
                nextActiveTab = 'preferences1';
            } else {
                var ifActive = self.dom.tabsList[currentID].active;
                if ('1' === ifActive) {            
                    var index = elemInObj.indexOf(currentID);
                    if (index === elemInObj.length - 1) {
                        nextActiveTab = Object.keys(self.dom.tabsList)[elemInObj.length - 2];                
                    } else {
                        nextActiveTab = Object.keys(self.dom.tabsList)[index + 1];
                    }
                    productId = self.dom.tabsList[nextActiveTab].productId;
                    self.dom.tabsList[nextActiveTab].active = '1';
                }             
            }    
            delete self.dom.tabsList[currentID];
            $('[aria-controls=' + currentID + ']').hide('highlight');
            setTimeout(function() {
                $('[aria-controls=' + currentID + ']' ).parent().remove();
            }, 700);
            if ('preferences1' === nextActiveTab || undefined === nextActiveTab) {
                $('.currentTab').removeClass('active');
                $('#preferences, #preferences1').addClass('active');
                $('.bg-danger' ).fadeOut(10);
                $(self.dom.addCategoryInput ).val('');
                getCategoriesList();
            } else {
                $('[aria-controls=' + nextActiveTab +']').parent().addClass('active');
            }

            $.ajax( {
                url   : app.BASE_URL + self.URL + 'closeTab',
                method: 'POST',
                data: {
                    id: idDb,
                    tabId: currentID,
                    nextActiveTab: nextActiveTab
                }
            } ).then( function (  )
            {
                if ('preferences1' !== nextActiveTab) {
                    getTabContent(productId, nextActiveTab, 0);
                }
            });
        },
        changeTabName: function (prId, prName, categoryId) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'changeTabName',
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
        temp: {
            "%ROW_NUMBER%": "",
            "%ROW_NAME%": "",
            "%DATA_CELL%": "",
            "%DATA_FORMULA%": "",
            "%INPUT_VALUE%": ""
        },  
        createTable: function(tableContent, alwaysInTable) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'createTable',
                method: 'POST',
                data: {
                    prId: app.tabs.productId,
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
        getTableContent: function (dom) {
            var self = this,
                tableContent = {},
                i = 0,
                temp;
            $.each($(dom), function(key, val) {
                temp = _.clone(self.temp);
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
        saveTable: function () {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'changeTableContent',
                method: 'POST',
                data: {
                    prId: app.tabs.dom.productId,
                    tableContent: JSON.stringify(self.getTableContent(self.dom.sortable + ' li')),
                    alwaysInTable: JSON.stringify(self.getTableContent(self.dom.alw + ' li'))
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
        addNewFormula: function (formulas) {
            $.ajax( {
                url   : 'http://DimaPhalcon/DimaPhalcon/tabs/addNewFormula',
                method: 'POST',
                data: {
                    formulas: formulas,
                    prId : self.tabs.productId
                }
            } ).then( function ( data )
            {
                if (true === data) {

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
    }
};

/*var product = {
    self: this,
    sortable: '#sortable',
    alw: '#alwaysInTable',
    rowNumber: '.rowNumber',
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
        console.log(this.rowNumber);
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
        var tableContent = this.getTableContent(this.sortable + ' li'),
            alwaysInTable = this.getTableContent(this.alw + ' li'),
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
};*/

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