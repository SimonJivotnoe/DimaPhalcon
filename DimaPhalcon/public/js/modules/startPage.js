define([
	'jq',
	'methods',
	'URLs',
	'DB',
	'TABS',
	'TREE',
	'CATEGORIES',
	'KIM',
	'METALLS',
    'NEW_PRODUCT',
    'OR',
    'PRODUCTS_TREE',
	'CLIENTS'
], function (
		$jq,
		methods,
		URLs,
		DB,
		TABS,
		TREE,
		CATEGORIES,
		KIM,
		METALLS,
		NEW_PRODUCT,
		OR,
		PRODUCTS_TREE,
		CLIENTS
) {
	var startPage = {
        runSection: function (section) {
            if (section) {
                if (section !== localStorage.siteSector) {
                    localStorage.siteSector = section;
					window.location.href = '';
                }
            } else {
                delete localStorage.siteSector;
				window.location.href = '';
            }
        },
		
        runStartPage: function () {
            startPage.activeClassValidation('#backIcon');
            localStorage.siteSector = 'MENU';
            methods.showBody();
            $jq.topIconsWrapper.hide();
            $jq.startPageWrapper.fadeIn();
        },

		
        runDB: function () {
            if (startPage.activeClassValidation('#dbIcon')) {
                localStorage.siteSector = 'DB';
                $('#backKimIcon, #backDBTreeIcon').removeClass('hvr-pulse-grow');
                $.get(URLs.loadDBTemplate, function (html) {
                    $jq.sectionContent.html(html);
					$.each([DB, TABS, TREE, CATEGORIES, KIM, METALLS, NEW_PRODUCT], function () { this.handler(); });
                    $jq.startPageWrapper.hide();
                    $jq.topIconsWrapper.show();
                    methods.showBody();
					NEW_PRODUCT.getFormulasHelper();
					CATEGORIES.getCategories();
					KIM.getKIM();
					METALLS.getMetalls();
                    TABS.getTabs();
					TREE.getDBTree();
                    $('#myTab, #leftTabsContent').fadeIn('slow');
                });
            }
        },
		
		runProductCreation: function () {
			if (startPage.activeClassValidation('#prIcon')) {
				localStorage.siteSector = 'OR';
				$.get(URLs.loadProductCreationTemplate, function (html) {
					$jq.sectionContent.html(html);
					$.each([OR, PRODUCTS_TREE, CLIENTS], function () { this.handler(); });
					$jq.startPageWrapper.hide();
                    $jq.topIconsWrapper.show();
					methods.showBody();
					PRODUCTS_TREE.getProductsTree();
					CLIENTS.getClientsTree();
					CLIENTS.getClientsDetails();
				});
				/*$.ajax({
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
				});*/
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
        },
		handler: function () {
			// TOP BUTTONS
			$jq.backIcon.click( function () { startPage.runSection(); });

			$jq.prefIcon.click(function () {
				startPage.runSection('PR');
			});

			$jq.dbIcon.click(function () {
				startPage.runSection('DB');
			});

			$jq.prIcon.click(function () {
				startPage.runSection('OR');
			});

			// START PAGE
			$jq.runPreferences.click(function () {
				$jq.startPageWrapper.fadeOut();
				setTimeout(startPage.runPreferences, 300);
			});

			$jq.runDB.click(function () {
				$jq.startPageWrapper.fadeOut();
				setTimeout(startPage.runDB, 300);
			});

			$jq.runPR.click(function () {
				$jq.startPageWrapper.fadeOut();
				if (!MAIN.prRequested) {
					setTimeout(startPage.runProductCreation, 500);
				} else {
					setTimeout(startPage.runProductCreation, 300);
				}
			});
		}
    };
	
	return startPage;
});