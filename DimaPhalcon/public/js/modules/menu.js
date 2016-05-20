define(['jq', 'methods'], function ($jq, methods) {
	var MENU = {
        showMainMenu: function () {
            MENU.activeClassValidation('#backIcon');
            localStorage.siteSector = 'MENU';
            methods.showBody();
            $jq.topIconsWrapper.hide();
            $jq.mainMenuWrapper.fadeIn();
        },
        activeClassValidation: function (id) {
            if (!$(id).hasClass('activeTopIcon')) {
                $('#menuIconsTop div')
                    .removeClass('activeTopIcon')
                    .addClass('hvr-pulse-grow');
                $(id).addClass('activeTopIcon').removeClass('hvr-pulse-grow');
                return true;
            }
            return false;
        }
    };
	
	return MENU;
});