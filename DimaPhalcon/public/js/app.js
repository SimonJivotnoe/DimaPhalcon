define([
    'jq',
    'methods',
    'startPage',
    'appHandler',
    'newProductHandler',
    'startPageHandler',
    'dbTabsHandler'
], function (
    $jq,
    methods,
    startPage,
    appHandler,
    newProductHandler,
    startPageHandler,
    dbTabsHandler
) {var
   init = function () {
       $(document).on({
           ajaxStart: methods.startWaitAnimation,
           ajaxStop: methods.stopWaitAnimation
       });
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
                   newProductHandler();
                   dbTabsHandler();
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
   };
   init();
});