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
		PREFERENCES = d.preferences,
		VALID = d.validation,
		THEMES = d.themes,
		LOCATION = 'http://DimaPhalcon/DimaPhalcon/',
		defaultScreenSize = '60em',
		maxScreenSize = (window.screen.availWidth - 5) + 'px',
		minscreenSize = '5px';

	PREFERENCES.applyCss();
	$('#livemill').prop('muted', true);
	// SPLIT MONITOR SECTION
	// setting default value
	if (undefined === localStorage.split) {
		localStorage.split = defaultScreenSize;
	}
	if (undefined === localStorage['db-split']) {
		localStorage['db-split'] = defaultScreenSize;
	}
	TABS.splitMonitor();
	$('#creatingProductsWrapper, #databaseWrapper').splitPane();

	// custom splitting by dragging splitter
	$('#divider').on('mouseleave', function(){
		localStorage.split = $('#divider').css('left');
	});
	$('#db-divider').on('mouseleave', function(){
		localStorage['db-split'] = $('#db-divider').css('left');
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
	
	// PREFERENCES
	// GLOBAL
	
	PREFERENCES.insertFontSizes(['#globalFontSize'], 'body');
	
	$('#globalFontSize').change(function () {
		var css = PREFERENCES.checkStorageCSS('body');
		$('body').css('font-size', $('#globalFontSize :selected').text());
		css.body['font-size'] = $('#globalFontSize :selected').text();
		localStorage.customCSS = JSON.stringify(css);
	});
	
	//TABS
	
	PREFERENCES.insertFontSizes(['#fontSizeTabs'], '.nav-tabs');
	
	$('#fontSizeTabs').change(function () {
		var css = PREFERENCES.checkStorageCSS('.nav-tabs');
		$('#testTab').css('font-size', $('#fontSizeTabs :selected').text());
		css['.nav-tabs']['font-size'] = $('#fontSizeTabs :selected').text();
		localStorage.customCSS = JSON.stringify(css);
	});

	PREFERENCES.applyPreferences(MENU.getPreferencesSettings());
	
	// MENU
	$('#addThemeBtn' ).click(function () {
		if ($('#customThemeName').val()) {
			$.when(THEMES.addTheme()).then(function (data) {
				if (data) {
					$('#customThemeName').val('');
					THEMES.getThemesList();
				} else {
					VALID.showError('#customThemeName');
				}
			});
		}
	});
	
	$('#applyThemeBtn' ).click(THEMES.applyTheme);
	$('#deleteThemeBtn' ).click(THEMES.deleteTheme);

	$('#runPR').click(function () {
		$('#mainMenuWrapper').fadeOut();
		if (!MAIN.prRequested) {
			setTimeout(MENU.runProductCreation, 500);
		} else {
			setTimeout(MENU.runProductCreation, 300);
		}
	});
	
	$('#runDB').click(function () {
		$('#mainMenuWrapper').fadeOut();
		setTimeout(MENU.runDB, 300);
	});
	
	$('#runPreferences').click(function () {
		$('#mainMenuWrapper').fadeOut();
		setTimeout(MENU.runPreferences, 300);
	});
	
	// ICONS TOP MENU
	$( '#backIcon, #dbIcon, #prefIcon, #menuOpen, #prIcon' )
		.mouseenter(function() {
			/*MENU.onHoverElement({
				scope: this,
				css: { "marginTop": "0px" },
				speed: 200
			});*/
			if ('dbIcon' === $(this).attr('id')) {
				$('span', this ).removeClass().addClass('glyphicon glyphicon-folder-open centerIcon');
			}
		})
		.mouseleave(function() {
			if ('MENU' !== localStorage.siteSector) {
				/*MENU.onHoverElement({
					scope: this,
					css: { "marginTop": "-8px" },
					speed: 200
				});*/
				if ('dbIcon' === $(this).attr('id')) {
					$('span', this ).removeClass().addClass('glyphicon glyphicon-folder-close centerIcon');
				}
			}
		});
	$('#customThemesWrapper')
		.mouseenter(function() {
			MENU.onHoverElement({
				scope: this,
				css: { "marginLeft": "0px" },
				speed: 250
			});
			$('#showCustomThemes span', this ).removeClass().addClass('glyphicon glyphicon-backward');
		})
		.mouseleave(function() {
			if ('MENU' !== localStorage.siteSector) {
				MENU.onHoverElement({
					scope: this,
					css: { "marginLeft": "-200px" },
					speed: 200
				});
			}
			$('#showCustomThemes span', this ).removeClass().addClass('glyphicon glyphicon-forward');
		});
		
	$('#backIcon').click(function () {
		delete localStorage.siteSector;
		window.location.href = LOCATION;
	});

	$('#prefIcon').click(MENU.runPreferences);

	$('#dbIcon').click(function () {
		if ('DB' !== localStorage.siteSector) {
			localStorage.siteSector = 'DB';
			window.location.href = LOCATION;
		}
	});
	
	$('#menuOpen').click(function () {
		MENU.createFileManager();
	});
	
	$( '#prIcon').click(function () {
		if ('OR' !== localStorage.siteSector) {
			localStorage.siteSector = 'OR';
			window.location.href = LOCATION;
		}
	});
	
	$('#showItemFromFileManager').click(function() {
		var product = [];
		var order = [];
		$(this).hide();
		$.each($('.openProductTabSelected'), function (num, obj) {
			if ('product' === $(obj).attr('data-type')) {
				product.push($(obj).attr('data-id'));
			}
			if ('order' === $(obj).attr('data-type')) {
				order.push($(obj).attr('data-id'));
			}
		});
		$.when(TABS.openSavedProduct(product, 'new', false, false), ORDER.openSavedOrder(order, 'new', false, false)).done(function(){
			window.location.href = LOCATION;
		});
	});
	
	$('#FMconsolidatedOrdersBtn').click(function () {
		var orderId = [];
		//$(this).hide();
		$.each($('.consolidateOrderSelected'), function (num, obj) {
			orderId.push($(obj).attr('data-id'));
		});
		$.when( ORDER.createNewOrder(false, true) ).then(function(data){
			console.log(data);
			if (false !== data) {
				ORDER.addToConsolidateOrder(data, orderId);
			}
		});
	});
	
	// 
	$('#dbProductsListTab').click(function(){
			TABS.setActiveDefaultTab('tabsList', 'dbProductsListTab', 'curTabId');
			TABS.changeActiveTab('', '', 'changeActiveLeftTab');
			MENU.createFileManager('PR');
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
	$('#fileManagerOrdersTab').on('click', function(){
		if (false === $('#fileManagerOrdersTab').hasClass('active')) {
			MENU.getClientsTree();
			TABS.setActiveDefaultTab('tabsRightList', 'fileManagerOrdersTab', 'curTabRightId');
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
			if ($(this).attr('name') !== category && 'categoriesAll' !== category) {
				$(this ).parent().hide();
			}
		});
	});
	$('.FMorderFilter').change(function() {
		var compareObj = {},
			rows = $('#fileManagerOrdersTable tr:gt(0)' ),
			searchText = '';
		$.each($('.FMorderFilter'), function(num, obj){
			if ($('option:selected', obj).text()) {
				compareObj[$(obj).attr('data-section')] = $('option:selected', obj).text();
			}
		});
		searchText = _.values(compareObj).join('');
		if (!searchText) {
			rows.show();
		} else {
			rows.hide();
			$.each($('.FMorderFullInfo'), function(num, obj){
				var infoOnj = JSON.parse($(obj ).text()),
					compareText = '';
				$.each(compareObj, function(section, text){
					if (text === infoOnj[section]) {
						compareText += text;
					}
				});
				if (compareText === searchText) {
					$(obj ).closest('tr' ).show();
				}
			});
		}
	});
	
	$('#FMsearchInProducts').keyup(function() {
		var text = $(this).val(),
			rows = $('#fileManagerProductsTable tr:gt(0)');
		MENU.searchInTable(rows, text);
	});
	
	$('#FMsearchInOrders').keyup(function() {
		var text = $(this).val(),
			rows = $('#fileManagerOrdersTable tr:gt(0)');
		MENU.searchInTable(rows, text);
	});
	/*$(function(){
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
	});*/
	PREFERENCES.applyCss();
} );
