'use strict';
$( document ).ready( function ()
{
	var d = D$(),
		MAIN = d.main,
		TABS = d.tabs,
		ORDER = d.order,
		PRODUCT = d.product,
		CATEGORIES = d.categories,
		KIM = d.kim,
		METALLS = d.metalls,
		MENU = d.menu,
		VALID = d.validation,
		defaultScreenSize = '60em',
		maxScreenSize = (window.screen.availWidth - 5) + 'px',
		minscreenSize = '5px';

	// SPLIT MONITOR SECTION
	// setting default value
	if (undefined === localStorage.split) {
		localStorage.split = defaultScreenSize;
	}
	TABS.splitMonitor();
	$('div.split-pane').splitPane();

	// custom splitting by dragging splitter
	$('#divider').on('mouseleave', function(){
		localStorage.split = $('#divider').css('left');
	});

	// show / restore default by double clicking on right tab
	$('#tabsRight').on('dblclick', '#rightTabs li', function(){
		localStorage.split === minscreenSize ? localStorage.split = defaultScreenSize : localStorage.split = minscreenSize;
		TABS.splitMonitor();
	});

	// show / restore default by double clicking on left tab
	$('#tabs').on('dblclick', '#myTab li', function(){
		localStorage.split === maxScreenSize ? localStorage.split = defaultScreenSize : localStorage.split = maxScreenSize;
		TABS.splitMonitor();
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
	$('#showItemFromFileManager').click(function() {
		$(this).hide();
		$.when($.each($('.openProductTabSelected'), function (num, obj) {
			if ('product' === $(obj).attr('data-type')) {
				TABS.openSavedProduct($(obj).attr('data-id'), 'new', false, false);
			}
			if ('order' === $(obj).attr('data-type')) {
				ORDER.openSavedOrder($(obj).attr('data-id'), 'new', false, false);
			}
		})).done(function(){
			window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
		});
	});
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

	// creating new left tab by clicking on +
	$('#addNewTab').on('click', function(){
		TABS.getLastLeftTab();
	});

	// RIGHT PART

	// create new order
	$('#addNewTabRight' ).click(function() {
		ORDER.createNewOrder();
	});

	// KIM TAB
	$('#kim').on('click', function(){
		if (false === $('#kim').hasClass('active')) {
			TABS.showKim();
			TABS.changeActiveTab('', '', 'changeActiveRightTab');
		}
	});

	/**
	 *
	 */
	$('#addCategoryBtn').click(function(){
		var category = VALID.validateInputVal({
				val: $('#addCategoryInput' ).val(),
				id: '#addCategoryInput',
				unique: true
			}),
			article = VALID.validateInputVal({
				val: $('#addCategoryArticleInput' ).val(),
				id: '#addCategoryArticleInput',
				unique: true
			});
		if (category && article) {
			CATEGORIES.addCategory(category, article);
		}
	});

	/**
	 *
	 */
	$('#addKIM').click(function(){
		var kim = VALID.validateInputVal({
				val: $('#kimInput' ).val(),
				id: '#kimInput',
				digitsOnly: true
			}),
			kimHardInput = VALID.validateInputVal({
				val: $('#kimHardInput' ).val(),
				id: '#kimHardInput'
			});

		if (kim && kimHardInput) {
			KIM.addKIMtoTable(kim, kimHardInput);
		}
	});

	// metalls table
	$('#addMetall').on('click', function(){;
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
			if (undefined !== self){
				$( '.rowValueInput', this ).css( 'background', '' ).prop( 'disabled', false );
			}
		});

		$('body').on('click', '.rowValueInput', function(){
			if (undefined !== self && false === $(this ).prop('disabled'))
			{
				if (PRODUCT.checkInputOnFormula(formula, $( this ).attr( 'data-cell' ))) {
				   $( this ).attr( 'data-formula', formula ).blur();
					cell = $( this ).attr( 'data-cell' );
					$( '#calx' ).calx();
					$( self ).find('.glyphicon-retweet' ).remove();
					$( '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> ' + cell + '</span>' ).insertBefore($(self).find('.removeFormula'));
					$( self ).removeClass( 'list-group-item-success' );
					$(this).css('background', '');
					self = undefined;
					PRODUCT.addNewFormula(PRODUCT.getFormulasList, true);
				}
			}
		});
	});
} );
