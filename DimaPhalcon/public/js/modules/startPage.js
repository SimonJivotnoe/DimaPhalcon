define(['jq', 'methods', 'URLs', 'PRODUCT'], function ($jq, methods, URLs, PRODUCT) {
	var startPage = {
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
                $.get(URLs.loadDBTemplate, function ( data ) {
                    $jq.sectionContent.html(PRODUCT.addProductsDbHandler($(data)));
                    $jq.databaseWrapper().splitPane();
                    $jq.startPageWrapper.hide();
                    $jq.topIconsWrapper.show();
                    methods.showBody();
                    $.when(PRODUCT.loadKimSection()).done(function () {
                        if (!MAIN.prRequested) {
                            PRODUCT.getLeftTabsList();
                        }
                    });
                });
            }
        },

        runSection: function (section) {
            if (section) {
                if (section !== localStorage.siteSector) {
                    localStorage.siteSector = section;
                    window.location.href = '/';
                }
            } else {
                delete localStorage.siteSector;
                window.location.href = '/';
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