define(['jq', 'methods', 'startPage', 'appHandler'], function ($jq, methods, startPage, appHandler) {var
   init = function () {
       appHandler();
       var sector = localStorage.siteSector;
       if (!sector) {
           localStorage.siteSector = 'MENU';
           startPage.runStartPage();
       } else {
           switch (sector) {
               case 'MENU':
                   startPage.runStartPage();
                   break;
               case 'PR':
                   startPage.runPreferences();
                   break;
               case 'DB':
                   startPage.runDB();
                   break;
               case 'OR':
                   startPage.runProductCreation();
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
});