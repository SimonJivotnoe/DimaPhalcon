define([
	'jq',
	'methods',
	'URLs',
	'PRODUCT',
	'DB',
	'TABS',
	'TREE',
	'CATEGORIES',
	'KIM',
	'METALLS',
    'NEW_PRODUCT'
], function (
		$jq,
		methods,
		URLs,
		PRODUCT,
		DB,
		TABS,
		TREE,
		CATEGORIES,
		KIM,
		METALLS,
		NEW_PRODUCT
) {
	var startPage = {
        runStartPage: function () {
            startPage.activeClassValidation('#backIcon');
            localStorage.siteSector = 'MENU';
            methods.showBody();
            $jq.topIconsWrapper.hide();
            $jq.startPageWrapper.fadeIn();
        },

        runSection: function (section) {
            if (section) {
                if (section !== localStorage.siteSector) {
                    localStorage.siteSector = section;
                    window.location.href = '/';
                }
            } else {
                delete localStorage.siteSector;
                window.location.href = '';
            }
        },
		
		runPreferences: function () {
			if (startPage.activeClassValidation('#prefIcon')) {
				localStorage.siteSector = 'PR';
				$.ajax( {
					url   : 'templates/preferences.html',
					method: 'GET'
				} ).then( function ( data )
				{
					$jq.sectionContent.html(addPreferencesHandler($(data)));
					PREFERENCES.insertFontSizes(['#globalFontSize'], 'body');
					PREFERENCES.insertFontSizes(['#fontSizeTabs'], '.nav-tabs');
					PREFERENCES.applyPreferences(MENU.getPreferencesSettings());
					THEMES.getThemesList();
					$('#startPageWrapper').hide();
					$('#topIconsWrapper').show();
					showBody();
				});
			}
		},
		
        runDB: function () {
            if (startPage.activeClassValidation('#dbIcon')) {
                localStorage.siteSector = 'DB';
                $('#backKimIcon, #backDBTreeIcon').removeClass('hvr-pulse-grow');
                $.get(URLs.loadDBTemplate, function (html) {
                    //$jq.sectionContent.html(PRODUCT.addProductsDbHandler($(data)));
                    $jq.sectionContent.html(html);
					//$.map([DB, TABS, TREE, CATEGORIES, KIM, METALLS, NEW_PRODUCT], function (MODULE) { MODULE.handler(); });
					DB.handler();
					//TABS.handler();
					TREE.handler();
                    CATEGORIES.handler();
                    KIM.handler();
                    METALLS.handler();
					NEW_PRODUCT.handler();
                    $jq.startPageWrapper.hide();
                    $jq.topIconsWrapper.show();
                    methods.showBody();
                    PRODUCT.loadKimSection();
                    PRODUCT.getTabs();
                    //PRODUCT.getLeftTabsList();
                    $('#myTab, #leftTabsContent').fadeIn('slow');
                });
            }
        },
		
		runProductCreation: function () {
			if (startPage.activeClassValidation('#prIcon')) {
				localStorage.siteSector = 'OR';
				$.ajax({
					url: 'templates/creatingOrder.html',
					method: 'GET'
				}).then(function (data)
				{
					$jq.sectionContent.html(addOrderCreationHandler($(data)));
					$('#creatingOrderWrapper').splitPane();
					$('#startPageWrapper').hide();
					$('#topIconsWrapper').show();
					showBody();
					if (!MAIN.orRequested) {
						TABS.getRightTabsList();
						CLIENTS.getClientsDetails();
						PRODUCT.getProductsTree();
					}
				});
			}
		},
		
        activeClassValidation: function (id) {
            if (!$(id).hasClass('activeTopIcon')) {
                $jq.menuIconsTop.find('div')
                    .removeClass('activeTopIcon')
                    .addClass('hvr-pulse-grow');
                $(id).addClass('activeTopIcon').removeClass('hvr-pulse-grow');
                return true;
            }
            return false;
        }
    };
	
	return startPage;
});