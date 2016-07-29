define(['methods', 'startPage'], function (methods, startPage) {var
   init = function () {
       $(document).on({
           ajaxStart: methods.startWaitAnimation,
           ajaxStop: methods.stopWaitAnimation
       });
       var sector = localStorage.siteSector;
       startPage.handler();
       if (!sector) {
           localStorage.siteSector = 'MENU';
           startPage.runStartPage();
       } else {
           switch (sector) {
               case 'MENU':
                   startPage.runStartPage();
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
   };
   init();
});