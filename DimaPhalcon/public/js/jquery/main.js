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
        MENU = d.menu,
        VALID = d.validation;

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

    /**
     *
     */
    $('#addKIM').on('click', function(){
        var kim = VALID.validateInputVal({
                val: $('#kimInput' ).val(),
                id: '#kimInput',
                digitsOnly: true
            }),
            kimHardInput = VALID.validateInputVal({
                val: $('#kimHardInput' ).val(),
                id: '#kimHardInput'
            }),
            kimArticle = VALID.validateInputVal({
                val: $('#kimArticle' ).val(),
                id: '#kimArticle',
                unique: true
            });
        if (kim && kimHardInput && kimArticle) {
            KIM.addKIMtoTable(kim, kimHardInput, kimArticle);
        }
    });
    
    // metalls table    
    $('#addMetall').on('click', function(){console.log(MAIN.metallTableContent);
        var metall = VALID.validateInputVal({
                val: $('#metallName' ).val(),
                id: '#metallName',
                unique: true
            }),
            price =  VALID.validateInputVal({
                val: $('#metallPrice' ).val(),
                id: '#metallPrice',
                digitsOnly: true
            }),
            mass =  VALID.validateInputVal({
                val: $('#metallMass' ).val(),
                id: '#metallMass',
                digitsOnly: true
            }),
            outPrice =  VALID.validateInputVal({
                val: $('#metallOutPrice' ).val(),
                id: '#metallOutPrice',
                digitsOnly: true
            }),
            article = VALID.validateInputVal({
                val: $('#metallArticle' ).val(),
                id: '#metallArticle',
                unique: true
            });
        if (metall && price && mass && outPrice && article) {
            METALLS.addMetallToTable({
                metall: metall,
                price: price,
                mass: mass,
                outPrice: outPrice,
                article: article
            });
        }
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
