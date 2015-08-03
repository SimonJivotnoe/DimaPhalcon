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
                    app.tabs.getTabContent(productId, nextActiveTab, 0);
                }
            });
        },
        changeTabName: function (prName, categoryId, kimId, metallId) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'changeTabName',
                method: 'POST',
                data: {
                    prId: self.dom.productId,
                    prName : prName,
                    categoryId : categoryId,
                    kimId: kimId,
                    metallId: metallId
                }
            } ).then( function ( data )
            {
                console.log(data);
            });
        },
        getTabContent: function(productId, tabId, body) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'getTabContent/' + productId,
                method: 'GET'
            } ).then( function ( data )
            {
                var kim, metall;
                $('#preferences1').attr('class', 'tab-pane');
                $('.currentTab' ).attr('id', tabId);
                $('.currentTab').attr('class', 'tab-pane active currentTab');
                $('.currentTab' ).html(data);
                $('.removeRow' ).hide();
                self.dom.curTabId = $('.currentTab').attr('id');
                self.dom.curTabName = 'a[href="#' + self.dom.curTabId + '"] .tabName';
                self.dom.productId = productId;
                kim = $('.listOfKim option:selected' ).attr('kim');
                metall = $('.listOfMetalls option:selected' ).attr('metall');
                $('[data-cell="KIM1"]' ).val(kim);
                $('[data-cell="PR1"]' ).val(metall);
                $('#calx').calx();
                if (body) {
                    /*----PREFERENCES_START----*/
                    // cog spin on
                    $('#preferences').on('mouseover', function(){
                        $('.fa-cog').addClass('fa-spin');
                    });
                    // cog spin off
                    $('#preferences').on('mouseleave', function(){
                        $('.fa-cog').removeClass('fa-spin');
                    });
                    $('#preferences').on('click', function(){
                        $('.bg-danger' ).fadeOut(10);
                        $('#addCategoryInput' ).val('');
                        getCategoriesList();
                        self.changeActiveTab('', '');
                    });
                    // add new category
                    $('#addCategoryBtn').on('click', function(){
                        var newCategoryName = $('#addCategoryInput' ).val();
                        ('' !== newCategoryName) ? addCategory(newCategoryName) : 0;
                    });
                    /*----PREFERENCES_END----*/

                    /*----NEW_TAB_START----*/
                    /* creating new tab clicking on + */
                    $('#addNewTab').on('click', function(){
                        getTabs('last');
                    });
                    /*----NEW_TAB_END----*/

                    /*----CURRENT TAB START----*/
                    $('#myTab [role=tab]').on('click', function() {
                        var selectedTabId = $(this ).attr('aria-controls');
                        if (selectedTabId !== 'preferences1' && self.dom.curTabId !== selectedTabId && undefined !== selectedTabId) {
                            var tabId = $(this ).find('.glyphicon-remove' ).attr('name' ),
                                prodId = $(this ).attr('name');
                            '' !== self.dom.curTabId ? self.dom.tabsList[self.dom.curTabId].active = '0' : 0;
                            self.dom.tabsList[selectedTabId].active = '1';
                            self.changeActiveTab(tabId, selectedTabId);
                            self.getTabContent(prodId, selectedTabId, 0);
                        }
                    });
                    /*----CURRENT TAB END----*/

                    /*----CLOSING TAB START----*/
                    $(self.dom.closeTab).on('click', function (e){
                        e.stopPropagation();
                        var currentID = $(this).parent().attr('aria-controls' ),
                            idDb = $(this ).attr('name');
                        $(this ).attr('class', 'glyphicon glyphicon-remove');
                        self.closeTabMethod(idDb, currentID);
                    });
                    /*----CLOSING TAB END----*/

                    //RIGHT PART

                    $('body' ).fadeIn(350);
                }

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
        tableContent: '',
        addKIMtoTable: function(kim, kimHard) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'addKIMtoTable',
                method: 'POST',
                data: {
                    kim: kim,
                    kimHard : kimHard
                }
            } ).then( function ( data )
            {
                if (true === data) {
                    $('#kimInput, #kimHardInput' ).val('');
                    self.getKIMTable();
                    self.getKimList();
                } else {

                }
            });
        },
        getKIMTable: function() {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'getKIMTable',
                method: 'GET'
            } ).then( function ( data )
            {
                self.tableContent = data[1];
                $('#tbodyKIM' ).html(data[0]);

                //kim
                $('#tbodyKIM tr').on('mouseover', function() {
                    var obj = {
                        pencilRemove: 'triggerKimPencil',
                        pencilAdd:'editKimPencil',
                        removeRemove: 'triggerRemoveKim',
                        removeAdd: 'removeKim'
                    };
                    app.fn.kimEditOver(obj, this);
                });

                $('#tbodyKIM tr').on('mouseleave', function() {
                    var obj = {
                        pencilRemove: 'editKimPencil',
                        pencilAdd:'triggerKimPencil',
                        removeRemove: 'removeKim',
                        removeAdd: 'triggerRemoveKim'
                    };
                    app.fn.kimEditOver(obj, this);
                });
            });
        },
        validation: function(val) {
            var res;
            res = val.replace(/[A-Za-z]+/g, '' ).replace(/,/g, '.');
            return res;
        },
        editKim: function (kimId, kim, kimHard, save) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'editKim',
                method: 'POST',
                data: {
                    kimId: kimId,
                    kim: kim,
                    kimHard : kimHard
                }
            } ).then( function ( data )
            {
                if (true === data) {
                    self.getKIMTable();
                    self.getKimList();
                } else {
                    $(save )
                        .parents('tr')
                        .find('.kimHardName, .kimName')
                        .css({
                            'border': '3px solid hsl(0, 69%, 22%)',
                            'border-radius': '2px'
                        });
                }
            });
        },
        getKimList: function() {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'getKimList',
                method: 'GET',
                data: {
                    prId: app.tabs.dom.productId
                }
            } ).then( function ( data ) {
                $('.listOfKim' ).html(data);
                var kim = $('.listOfKim option:selected' ).attr('kim');
                $('[data-cell="KIM1"]' ).val(kim);
                $('#calx').calx();
            });
        },
        removeKim: function (kimId) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'removeKim',
                method: 'POST',
                data: {
                    kimId: kimId
                }
            } ).then( function ( data ) {
                console.log(data);
                if (true === data) {
                    self.getKIMTable();
                    self.getKimList();
                }
            });
        }
    },
    metalls: {
        URL: 'metalls/',
        getMetallsTable: function() {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'getMetallsTable',
                method: 'GET'
            } ).then( function ( data )
            {
                $('#tbodyMetalls' ).html(data);

                //METALLS
                //add metall
                $('#addMetall').on('click', function(){
                    var data = {
                        metall: $('#metallName' ).val(),
                        price: app.fn.inputValidator($('#metallPrice' ).val()),
                        mass: app.fn.inputValidator($('#metallMass' ).val()),
                        outPrice: app.fn.inputValidator($('#metallOutPrice' ).val())
                    };
                    app.metalls.addMetallToTable(data);
                });

                $('#tbodyMetalls tr').on('mouseover', function() {
                    var obj = {
                        pencilRemove: 'triggerMetallPencil',
                        pencilAdd:'editMetallPencil',
                        removeRemove: 'triggerRemoveMetall',
                        removeAdd: 'removeMetall'
                    };
                    app.fn.kimEditOver(obj, this);
                });

                $('#tbodyMetalls tr').on('mouseleave', function() {
                    var obj = {
                        pencilRemove: 'editMetallPencil',
                        pencilAdd:'triggerMetallPencil',
                        removeRemove: 'removeMetall',
                        removeAdd: 'triggerRemoveMetall'
                    };
                    app.fn.kimEditOver(obj, this);
                });

                $('body').on('click', '.editMetallPencil', function(){
                    $(this )
                        .attr('class', 'glyphicon glyphicon-floppy-disk saveEditMetall' )
                        .css('margin-left', '0');
                    $(this )
                        .parents('tr')
                        .find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
                        .attr('contenteditable', 'true')
                        .css({
                            'border': '1px solid hsl(195, 79%, 43%)',
                            'border-radius': '2px'
                        });
                });

                $('body').on('click', '.saveEditMetall', function(){
                    var obj = {
                        metallId: $(this ).attr('name'),
                        metallName: $(this ).parents('tr').find('.metallName' ).text(),
                        metallPrice: app.fn.inputValidator($(this ).parents('tr').find('.metallPrice' ).text()),
                        metallMass: app.fn.inputValidator($(this ).parents('tr').find('.metallMass' ).text()),
                        metallOutPrice: app.fn.inputValidator($(this ).parents('tr').find('.metallOutPrice' ).text())
                    };
                    var self = this;
                    app.metalls.editMetall(obj, self);
                });

                $('body').on('click', '.removeMetall', function(){
                    var metallId = $(this ).attr('name');
                    self.removeMetall(metallId);
                });

            });
        },        
        getMetallsList: function() {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'getMetallsList',
                method: 'GET',
                data: {
                    prId: app.tabs.dom.productId
                }
            } ).then( function ( data ) {
                console.log(data);
                $('.listOfMetalls' ).html(data);
                var metall = $('.listOfMetalls option:selected' ).attr('metall');
                $('[data-cell="PR1"]' ).val(metall);
                $('#calx').calx();
            });
        },
        addMetallToTable: function (dates) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'addMetallToTable',
                method: 'POST',
                data: dates
            } ).then( function ( data )
            {
                if (true === data) {
                    $('#metallName, #metallPrice, #metallMass, #metallOutPrice').val('');
                    self.getMetallsTable();
                    self.getMetallsList();
                }
            });
        },
        editMetall: function(obj, scope) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'editMetall',
                method: 'POST',
                data: obj
            } ).then( function ( data )
            {
               if (true === data) {
                    self.getMetallsTable();
                    self.getMetallsList();
                } else {
                    $(scope)
                        .parents('tr')
                        .find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
                        .css({
                            'border': '3px solid hsl(0, 69%, 22%)',
                            'border-radius': '2px'
                        });
                }
            });
        },
        removeMetall: function(metallId) {
            var self = this;
            $.ajax( {
                url   : app.BASE_URL + self.URL + 'removeMetall',
                method: 'POST',
                data: {
                    metallId: metallId
                }
            } ).then( function ( data ) {
                console.log(data);
                if (true === data) {
                    self.getMetallsTable();
                    self.getMetallsList();
                }
            });
        }
    },
    fn: {
        kimEditOver: function(obj, scope) {
            $('.glyphicon-pencil', scope)
                .removeClass(obj.pencilRemove)
                .addClass(obj.pencilAdd);
            $('.glyphicon-remove', scope)
                .removeClass(obj.removeRemove)
                .addClass(obj.removeAdd);
        },
        kimEditLeave: function () {

        },
        inputValidator: function(val) {
            var res;
            res = val.replace(/[A-Za-z]+/g, '' ).replace(/,/g, '.');
            return res;
        }
    }
};

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