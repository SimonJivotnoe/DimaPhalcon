'use strict';
$( document ).ready( function ()
{    
    var d = D$(),
        MAIN = d.main,
        TABS = d.tabs,
        ORDER = d.order,
        PRODUCT = d.product,
        KIM = d.kim,
        METALLS = d.metalls;
    
    // split monitor
    if (undefined === localStorage.split) {
        localStorage.split = '60em';
    }
    $('#left-component').css('width', localStorage.split);
    $('#divider, #right-component').css('left', localStorage.split);
    $('div.split-pane').splitPane();
    $('#divider').on('mouseleave', function(){
        localStorage.split = $('#divider').css('left');
    });
    
    
    /*----PREFERENCES_START----*/
    
    // handlers
    // cog spin on-off
    $('#preferences')
        .mouseover(function(){
            $('.fa-cog').addClass('fa-spin');
        })
        .mouseleave(function(){
            $('.fa-cog').removeClass('fa-spin');
        })
        .click(function(){
            TABS.loadPreferences();
            TABS.changeActiveTab('', '', 'changeActiveLeftTab');
        });

    // add new category
    $('#addCategoryBtn').on('click', function(){
        var newCategoryName = $('#addCategoryInput' ).val();
        ('' !== newCategoryName) ? TABS.addCategory(newCategoryName) : 0;
    });
        
    /*----PREFERENCES_END----*/

    /*----NEW_TAB_START----*/
    
    // creating new tab clicking on +
    $('#addNewTab').on('click', function(){
        TABS.getLastLeftTab();
    });
    
    /*----NEW_TAB_END----*/

    // RIGHT PART
    // kim tab
    // kim table
    $('#kim').on('click', function(){
        if (false === $('#kim').hasClass('active')) {
            TABS.showKim();
            TABS.changeActiveTab('', '', 'changeActiveRightTab');
        }        
    });

    $('#addKIM').on('click', function(){
        var kim = $('#kimInput' ).val(),
            kimHardInput = $('#kimHardInput' ).val();
        kim = KIM.validation(kim);
        KIM.addKIMtoTable(kim, kimHardInput);
    });
    
    // metalls table    
    $('#addMetall').on('click', function(){
        var data = {
            metall: $('#metallName' ).val(),
            price: KIM.validation($('#metallPrice' ).val()),
            mass: KIM.validation($('#metallMass' ).val()),
            outPrice: KIM.validation($('#metallOutPrice' ).val())
        };
        METALLS.addMetallToTable(data);
    });  
    /*----INSIDE TAB START----*/

    /* SAVE CHANGES IN TABLE */

    /* create formula */
    var currentCaretPos = 0;
    /*$('body').on('click', '#addFormulaInputPr', function(){
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
    });*/
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
    $('body').on('click', app.product.dom.removeFhBtn, function(e) {
        e.stopPropagation();
        e.preventDefault();
        var fhText = $(this ).parent().text();
        app.product.removeFormulasHelper(this, fhText);
        $(this ).parent().fadeOut('slow');
    });
    $('body').on('click', '#cancelFormulaBtnPr', function(){
        cancelInputFotmula();
    });
    $('body').on('click', app.product.dom.addFormulaBtnPr, function(){
        if ('' !== app.product.formulaInputValue) {
            $( app.product.dom.formulasList )
                    .append('<li class="list-group-item formula"><span class="formulaValue">'
                    + $( app.product.dom.addFormulaInputPr ).val() + '</span></li>');
            cancelInputFotmula();
            $( app.product.dom.addFormulaInputPr ).val('');
            app.product.addNewFormula(app.product.getFormulasList);
        }
    });
    $('body').on('click', '.addNewFhBtn', function(){
        $('body').css('cursor', 'pointer');
        var newFl = $('#addNewFhBtnInput' ).val();
        app.product.addBtnToFormulasHelper(newFl);
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
        });
        $('body').on('mouseover', '.rowValue', function() {
            if (undefined !== self) {
                if ( -1 === formula.search($( '.rowValueInput', this ).attr( 'data-cell' ))) {
                    if (app.product.checkInputOnFormula(formula, $( '.rowValueInput', this ).attr( 'data-cell' ))) {
                        $('.rowValueInput', this).css(
                                {
                                    'background': 'hsl(145, 38%, 53%)',
                                    'cursor': 'pointer'
                                });
                    } else {
                        $('.rowValueInput', this).prop('disabled', true);
                    }                   
                } else {
                    $('.rowValueInput', this).prop('disabled', true);
                }
            }
            
        });
        $('body').on('mouseleave', '.rowValue', function() {
            $('.rowValueInput', this).css('background', '').prop('disabled', false);
        });

        $('body').on('click', '.rowValueInput', function(){
            if (undefined !== self && false === $(this ).prop('disabled'))
            {
                if (app.product.checkInputOnFormula(formula, $( this ).attr( 'data-cell' ))) {
                   $( this ).attr( 'data-formula', formula ).blur();
                    cell = $( this ).attr( 'data-cell' );
                    $( '#calx' ).calx();
                    $( self ).find('.glyphicon-retweet' ).remove();
                    $( self ).append( '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> ' + cell + '</span>' );
                    $( self ).removeClass( 'list-group-item-success' );
                    $(this).css('background', '');
                    self = undefined;
                    app.product.addNewFormula(app.product.getFormulasList, true);
                }                
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
        app.product.addNewFormula(app.product.getFormulasList, false);
        var tableContent = app.product.getTableContent(app.product.dom.sortable + ' li');
        var alwaysInTable = app.product.getTableContent(app.product.dom.alw + ' li');
        app.product.createTable(tableContent, alwaysInTable);
    });  

} );
