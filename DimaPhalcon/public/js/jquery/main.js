'use strict';
$( document ).ready( function ()
{    
    var d = D$(),
        MAIN = d.main,
        TABS = d.tabs,
        ORDER = d.order,
        PRODUCT = d.product,
        KIM = d.kim,
        METALLS = d.metalls,
        MENU = d.menu;
    
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
    
    // MENU
    $( "#menuOpen" )
        .mouseenter(function() {
            MENU.onHoverElement({
                scope: this,
                css: { "marginTop": "0px" },
                speed: 200
            });
            $('span', this ).removeClass().addClass('glyphicon glyphicon-folder-open');
        })
        .mouseleave(function() {
            MENU.onHoverElement({
                scope: this,
                css: { "marginTop": "-8px" },
                speed: 200
            });
            $('span', this ).removeClass().addClass('glyphicon glyphicon-folder-close');
        })
        .click(function(){
            MENU.createFileManager();
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

    // create new order
    $('#addNewTabRight' ).click(function() {
        ORDER.createNewOrder();
    });

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

    // menu modal
    $('#fileManagerCatogoriesSelect' ).on('change', function() {
       var category = $('option:selected', this ).attr('name' );
        $.each($('.prManProductTableCategory'), function(){
            $(this ).parent().show();
            'categoriesAll' === category ? 0 : $(this).attr('name') !== category ? $(this ).parent().hide() : 0 ;
        });
    });
    
    /*$('body').on('click', '.openProductTab .openProductTabSelected', function(e) {
	e.stopPropagation();
	    console.log('here');
	$(this).removeClass('openProductTabSelected').addClass('openProductTab');
    });*/

    $(function(){
        var self;
        var formula;
        var cell;
        $('body').on('click', '.list-group-item', function(){
            $('#formulasList li' ).removeClass('list-group-item-success');
            PRODUCT.cancelInputFormula();
            self = this;
            formula = $('.formulaValue', self ).text();
            $(self ).toggleClass('list-group-item-success');
        });
        $('body').on('mouseover', '.rowValue', function() {
            if (undefined !== self) {
                if ( -1 === formula.search($( '.rowValueInput', this ).attr( 'data-cell' ))) {
                    if (PRODUCT.checkInputOnFormula(formula, $( '.rowValueInput', this ).attr( 'data-cell' ))) {
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
                if (PRODUCT.checkInputOnFormula(formula, $( this ).attr( 'data-cell' ))) {
                   $( this ).attr( 'data-formula', formula ).blur();
                    cell = $( this ).attr( 'data-cell' );
                    $( '#calx' ).calx();
                    $( self ).find('.glyphicon-retweet' ).remove();
                    $( self ).append( '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> ' + cell + '</span>' );
                    $( self ).removeClass( 'list-group-item-success' );
                    $(this).css('background', '');
                    self = undefined;
                    PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
                }                
            }
        });
    });
} );
