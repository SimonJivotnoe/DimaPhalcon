'use strict';
$( document ).ready( function ()
{
    // split monitor
    $('div.split-pane').splitPane();

    /*----RECEIVE TABS LIST----*/
    getTabs('all');
    /*----RECEIVE TABS LIST END----*/

    /*----PREFERENCES_START----*/
    // cog spin on
    $('body').on('mouseover', '#preferences', function(){
        $(this ).find('.fa-cog').addClass('fa-spin');
    });
    // cog spin off
    $('body').on('mouseleave', '#preferences', function(){
        $(this ).find('.fa-cog').removeClass('fa-spin');
    });
    $('#preferences').on('click', function(){
        $('.bg-danger' ).fadeOut(10);
        $('#addCategoryInput' ).val('');
        getCategoriesList();
        tabs.changeActiveTab('', '');
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
    $('body').on('click', '[role=tab]', function() {
        var selectedTabId = $(this ).attr('aria-controls');
        if (selectedTabId !== 'preferences1' && tabs.curTabId !== selectedTabId && undefined !== selectedTabId) {
            var tabId = $(this ).find('.glyphicon-remove' ).attr('name');
            var prodId = $(this ).attr('name');
            tabs.tabsList[tabs.curTabId].active = '0';
            tabs.tabsList[selectedTabId].active = '1';
            tabs.changeActiveTab(tabId, selectedTabId);
            getTabContent(prodId, selectedTabId, 0);            
        }
    });
    /*----CURRENT TAB END----*/

    /*----CLOSING TAB START----*/
    $('body').on('click', '.closeTab', function (e){
        e.stopPropagation();
        var currentID = $(this).parent().attr('aria-controls');
        var idDb = $(this ).attr('name');        
        $(this ).attr('class', 'glyphicon glyphicon-remove');
        closeTab(idDb, currentID);
    });
    /*----CLOSING TAB END----*/

    /*----INSIDE TAB START----*/
    /* add rows to table */
    $('body').on('click', '#addNewRow', function(){
        var numbersOfRows = $('#duration' ).val();
        var tableContent = {};
        if (0 === $('#sortable li').size()) {
            for (var i = 0; i < numbersOfRows; i++) {
                temp = new RowTemplate();
                temp.temp['%ROW_NUMBER%'] = 'A' + (i+1);
                temp.temp['%DATA_CELL%'] = 'A' + (i+1);
                tableContent[i] = temp.temp;
            }
            var alwaysInTable = product.getTableContent(product.alw + ' li');
            product.createTable(tabs.productId, tableContent, alwaysInTable);
        } else {
            var arr = [];
            $.each($('#sortable .rowNumber'), function(key, val) {
                ('' !== $(val).text()) ? arr.push(parseInt($(val).text().substring(1))) : 0;
            });
            var max = 0;
            (0 !== arr.length) ? max = Math.max.apply(Math, arr) : 0;

            tableContent = product.getTableContent(product.sortable + ' li');
            for (var i = 0; i < numbersOfRows; i++) {
                var temp = new RowTemplate();
                temp.temp['%ROW_NUMBER%'] = 'A' + (max+1);
                temp.temp['%DATA_CELL%'] = 'A' + (max+1);
                tableContent[max] = temp.temp;
                max++;
            }
            var alwaysInTable = product.getTableContent(product.alw + ' li');
            product.createTable(tabs.productId, tableContent, alwaysInTable);
        }
    });

    /* remove tr */
    $('body').on('click', '.removeRow', function(){
        var rowName = $(this ).parent().find('.rowValueInput' ).attr('data-cell');
        var checkBinding = $('.list-group-item').find('.glyphicon:contains(' + rowName + ')');
        checkBinding.length ? checkBinding.remove() : 0 ;
        $(this ).parent().hide('drop' );
        $(this ).parent().find('.rowNumber' ).text('');
        $(this ).parent().find('.rowValueInput' ).attr('data-cell', '');
        setTimeout(function() { $(this ).parent().remove() }, 500);
    });

    /* SAVE CHANGES IN TABLE */
    $('body').on('mousewheel', '.rowValueInput', function(e) {
        var thisVal = Number($(this ).val());
        if (1 === e.deltaY) {
            $(this ).val((thisVal + 0.01).toFixed(2)).attr('value', (thisVal + 0.01).toFixed(2));
        } else if (-1 === e.deltaY) {
            $(this ).val((thisVal - 0.01).toFixed(2) ).attr('value', (thisVal - 0.01).toFixed(2));
        }
        $( '#calx' ).calx();
        product.saveTable();
    });

    $('body').on('keyup', '.rowNameInput', function(){
        $(this ).attr('value', $(this ).val());
        product.saveTable();
    });
    
    $('body').on('keydown', '.rowValueInput', function(e){
           switch (e.keyCode) {
               case 38: // UP
                product.catchKey(this, '+', 1);
                e.preventDefault();
                break; 
               case 40: // DOWN
                product.catchKey(this, '-', 1);
                e.preventDefault();
                break;
               case 191: // /
                product.catchKey(this, '+', 10);
                e.preventDefault();
                break;
               case 17: // Ctrl
                product.catchKey(this, '-', 10);
                e.preventDefault();
                break;
               case 190: // >
                product.catchKey(this, '+', 100);              
                e.preventDefault();
                break;
               case 18: // Alt
                product.catchKey(this, '-', 100);
                e.preventDefault();
                break;
               case 32: // Space
                e.preventDefault();
                break;    
           } 
    });

    $('body').on('keyup', '.rowValueInput', function(e){console.log(e.keyCode);
        var notToReact = [17,18,32,37,38,39,40,110,188,190,191];
        var text = $(this ).val();
        if(text.indexOf(',') !== -1) {
           text = text.replace(',','.');
           $(this ).val(text);
        }        
        $(this).attr('value', text);
         if (-1 === $.inArray(e.keyCode, notToReact)){
            var caretPos = this.selectionStart;
            if (96 === e.keyCode && '.' === text.charAt((text.length - 2))) {
                
            } else {
                $( '#calx' ).calx();
            text = '' + $(this ).val();
            $(this ).caret(caretPos);
            ('.' === text.charAt((text.length - 2))) ? $(this ).caret((text.length - 1)) : 0;
             product.saveTable();
            }
            
        }
    });
    /* SAVE CHANGES IN TABLE END*/

    /* EDIT & SAVE CATEGORIES LIST CONTENT */
    // set tab name
     $('body').on('change, keyup', '.nameOfProduct', function(){
         $(tabs.curTabName).text($(this ).val());
         ('' === $(this ).val()) ? $(tabs.curTabName).text('Новое изделие') : 0;
     });

    $('body').on('click', '#editCategoriesListContent', function(){
        $(this ).attr('class', 'glyphicon glyphicon-floppy-disk' ).attr('id', 'saveCategoriesListContent');
        $('.nameOfProduct, .listOfCategories' ).prop('disabled', false );
    });
    $('body').on('click', '#saveCategoriesListContent', function(){
        $(this ).attr('class', 'glyphicon glyphicon-pencil').attr('id', 'editCategoriesListContent');
        $('.nameOfProduct, .listOfCategories' ).prop('disabled', true );
        var prName = $('.nameOfProduct' ).val();
        var categoryId = $('.listOfCategories option:selected' ).attr('name');
        if ('' === prName) {
            prName = 'Новое изделие';
            $(tabs.curTabName).text('Новое изделие');
        }
        tabs.changeTabName(tabs.productId, prName, categoryId);
    });

    /* edit & save TableContent */
    $('body').on('click', '#editTableContent', function(){
        $(this ).attr('class', 'glyphicon glyphicon-floppy-disk' ).attr('id', 'saveTableContent');
        $('.removeRow' ).show();
        $( product.sortable ).sortable({
            revert: true
        });
        $( product.sortable ).sortable("enable");
        //$( "ul, li" ).disableSelection();
    });
    $('body').on('click', '#saveTableContent', function(){
        $(this ).attr('class', 'glyphicon glyphicon-pencil').attr('id', 'editTableContent');
        $('.removeRow' ).hide();
        product.saveTable();
        $( product.sortable ).sortable({
            revert: false
        });
        $(product.sortable).sortable('disable');
    });

    /* create formula */
    var currentCaretPos = 0;
    $('body').on('click', '#addFormulaInputPr', function(){
        var caretPos = caretPositionInFormulaInput();
        console.log(caretPos());
        $('.removeFhBtn').hide();
        $('#addFormulaInputPr' ).css('border-color', 'rgba(82, 168, 236, 0.8)');
        $('#formulasHelper' ).show('scale');
        if ('auto' === $('body').css('cursor')) {
            $('body').css('cursor', 'pointer');
            $(document).keydown(function (e) {
                if (!$('#addFormulaInputPr').is(":focus")  && 'pointer' === $('body').css('cursor')) {
                    if (e.keyCode === 8) {
                        var currentVal =  $('#addFormulaInputPr').val();
                        currentVal = removeChar(currentVal, currentCaretPos - 1);
                        $('#addFormulaInputPr').val(currentVal);
                        currentCaretPos--;
                        e.preventDefault();
                    }
                }
            });
            $('body').on('keypress',function(e) {
                if (!$('#addFormulaInputPr').is(":focus") && 'pointer' === $('body').css('cursor')) {
                    if (32 !== e.keyCode) {
                        addWhereCaret(currentCaretPos, String.fromCharCode(e.keyCode));
                        currentCaretPos++;
                    }
                }
            });
            $('body').on('click', '.rowNumber', function(){
                addWhereCaret(currentCaretPos, $(this ).text());
                currentCaretPos = currentCaretPos + $(this ).text().length;
            });
        }
    });
    $('body').on('keydown', '#addFormulaInputPr', function(e){
        if (32 === e.keyCode) {
            return false;
        }
    });
    
    $('body').on('mouseleave', '#addFormulaInputPr', function(){
        var caretPos = caretPositionInFormulaInput();
        currentCaretPos = caretPos();
    });
    /* add formulas helper to formula input */
    $('body').on('click', '.fhBtn', function(){
        var caretPos = caretPositionInFormulaInput();
        addWhereCaret(caretPos(), $(this ).text());
    });
    /* show remove formulas helper */
    $('body').on('mouseover', '.fhBtn', function() {
        $( '.removeFhBtn', this).show('fast');
    });
    /* hide remove formulas helper */
    $('body').on('mouseleave', '.fhBtn', function() {
        $( '.removeFhBtn', this).hide('fast');
    });
    /* remove formulas helper*/
    $('body').on('click', '.removeFhBtn', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var fhText = $(this ).parent().text();
        removeFormulasHelper(this, fhText);
        $(this ).parent().fadeOut('slow');
    });
    $('body').on('click', '#cancelFormulaBtnPr', function(){
        cancelInputFotmula();
    });
    $('body').on('click', product.addFormulaBtnPr, function(){
        if ('' !== product.formulaInputValue) {
            $('#formulasList' ).append('<li class="list-group-item"><span class="formulaValue">' + $('#addFormulaInputPr').val() + '</span></li>');
            cancelInputFotmula();
            $('#addFormulaInputPr').val('');
            product.addNewFormula($.trim($('#formulasList').html()));
        }
    });
    $('body').on('click', '.addNewFhBtn', function(){
        $('body').css('cursor', 'pointer');
        var newFl = $('#addNewFhBtnInput' ).val();
        addBtnToFormulasHelper(newFl);
    });
    $('body').on('click', '#addNewFhBtnInput', function(){
        $('#addFormulaInputPr, .rowNumber').off('click');
        $('body').off('keypress');
        $('body').off('click', '.rowNumber');
        $('body').css('cursor', 'auto');
    });

    $('body').on('mouseover', '.list-group-item', function(){
        $(this ).addClass('list-group-item-info');
    });
    $('body').on('mouseleave', '.list-group-item', function(){
        $(this ).removeClass('list-group-item-info');
    });
    $(function(){
        var self;
        var formula;
        var cell;
        $('body').on('click', '.list-group-item', function(){
            $('#formulasList li' ).removeClass('list-group-item-success');
            cancelInputFotmula();
            self = this;
            formula = $('.formulaValue', self ).text();
            $(self ).toggleClass('list-group-item-success');
            //$('.rowValueInput').prop('disabled', true);
        });
        $('body').on('mouseover', '.rowValue', function() {
            if (undefined !== self) {
                if ( -1 === formula.search($( '.rowValueInput', this ).attr( 'data-cell' ))) {
                    product.checkInputOnFormula(formula, $( '.rowValueInput', this ).attr( 'data-cell' ));
                    //$('.rowValueInput', this).css('background', '#419641');
                } /*else if(-1 !== formula.search($( '.rowValueInput', this ).attr( 'data-cell' ))){
                    $('.rowValueInput', this ).prop('disabled', true);
                }*/
            }
            
        });
        $('body').on('mouseleave', '.rowValue', function() {
            //$('.rowValueInput', this).css('background', '').prop('disabled', false);;
        });

        $('body').on('click', '.rowValueInput', function(){
            if (undefined !== self && false === $(this ).prop('disabled'))
            {
                $( this ).attr( 'data-formula', formula );
                cell = $( this ).attr( 'data-cell' );
                $( '#calx' ).calx();
                $(this ).css('color', '#419641');
                $(this ).parent().parent().find('.rowNameInput').css('color', '#419641');
                $(this ).parent().parent().css({'background' : '#419641', 'color' : '#fff'});
                $( self ).find('.glyphicon-retweet' ).remove();
                $( self ).append( '<span class="glyphicon glyphicon-retweet" aria-hidden="true"> ' + cell + '</span>' );
                $( self ).removeClass( 'list-group-item-success' );
                $(this).css('background', '');
                self = undefined;
                product.addNewFormula($.trim($('#formulasList').html()));
                product.saveTable();
            }
        });
    });

    $('body').on('mouseover', '.glyphicon-retweet', function(){
        $(this ).removeClass('glyphicon glyphicon-retweet' ).addClass('glyphicon glyphicon-resize-full');
    });
    $('body').on('mouseleave', '.glyphicon-resize-full', function(){
        $(this ).removeClass('glyphicon glyphicon-resize-full' ).addClass('glyphicon glyphicon-retweet');
    });
    $('body').on('click', '.glyphicon-resize-full', function(e){
        e.stopPropagation();
        e.preventDefault();
        var bindCell = $(this ).text();
        $('.rowValueInput[data-cell=' +bindCell + ']' )
                .removeAttr('color' ).val('' )
                .attr('value', '')
                .attr('data-formula', '')
                .css('color', '' );
        $('.rowValueInput[data-cell=' +bindCell + ']' ).parent().parent().find('.rowNameInput').css('color', '' );
        $('.rowValueInput[data-cell=' +bindCell + ']' ).parent().parent().css({'background' : '', 'color' : ''});
        $(this ).parent().removeClass('list-group-item-info');
        $(this ).remove();
        $( '#calx' ).calx();
        var tableContent = $.trim($('#sortable').html());
        var prId = $('a[href="#' + $('.currentTab').attr('id') + '"]').attr('name');
        product.addNewFormula($.trim($('#formulasList').html()), prId);
        var tableContent = product.getTableContent(product.sortable + ' li');
        var alwaysInTable = product.getTableContent(product.alw + ' li');
        product.createTable(tabs.productId, tableContent, alwaysInTable);
    });
} );

/*function activeTabInputVal(id, activeTabName) {
    if (false === id) {
        var id = $('ul .active a').attr('name');
        var activeTabName = $('ul .active .tabName').text();
        if ('New' == activeTabName) {
            activeTabName = '';
        }
    }
    $('body' ).find(id + ' .nameOfProduct' ).val(activeTabName);
}*/
