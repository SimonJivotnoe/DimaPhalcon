(function () {var
    MAIN = {
        defaultScreenSize: '60em'
    },
    $jq = {
        body: $('body'),
        topIconsWrapper: $('#topIconsWrapper'),
        mainMenuWrapper: $('#mainMenuWrapper')
    },
    methods = {
        startWaitAnimation: function () { $jq.body.addClass('loading'); },
        stopWaitAnimation: function () { $jq.body.removeClass('loading'); },
        showBody: function() {
            //PREFERENCES.applyCss();
            if ($jq.body.is(":visible")) {return false;}
            $jq.body.fadeIn(350);
            return true;
        }
    },
    MENU = {
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
    },
   init = function () {
       var sector = localStorage.siteSector;
       if (!sector) {
           localStorage.siteSector = 'MENU';
           MENU.showMainMenu();
       } else {
           switch (sector) {
               case 'MENU':
                   MENU.showMainMenu();
                   break;
               case 'PR':
                   MENU.runPreferences();
                   break;
               case 'DB':
                   MENU.runDB();
                   break;
               case 'OR':
                   MENU.runProductCreation();
                   break;
               default:
                   $('#runPR').click();
           }
       }
       if (undefined === localStorage.split) {
           localStorage.split = MAIN.defaultScreenSize;
       }
       if (undefined === localStorage['db-split']) {
           localStorage['db-split'] = MAIN.defaultScreenSize;
       }
       $(document).on({
           ajaxStart: function() { methods.startWaitAnimation(); },
           ajaxStop: function() { methods.stopWaitAnimation(); }
       });
   };
   init();
}());