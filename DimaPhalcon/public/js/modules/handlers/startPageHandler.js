define(['jq', 'methods', 'URLs', 'startPage', 'dbHandler', 'mustache'], function ($jq, methods, URLs, startPage, dbHandler, Mustache) {

    var startPageHandler = function () {
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

        $jq.outBodyElements.on('dblclick', '.categoriesListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.editCategoryInput.val(MAIN.categoriesTableContent.data[id].name);
            MAIN.$selectedRow = $this;
            $jq.editCategoryModal.modal('show');
        });

        $jq.outBodyElements.on('dblclick', '.kimListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.editKimHardInput.val(MAIN.kimTableContent.data[id].name);
            $jq.editKimInput.val(MAIN.kimTableContent.data[id]['value']);
            $jq.editKimDescrInput.val(MAIN.kimTableContent.data[id].description);
            MAIN.$selectedRow = $this;
            $jq.editKimModal.modal('show');
        });

        $jq.outBodyElements.on('dblclick', '.metallListTable tbody tr', function () {
            var $this = $(this);
            var id = $this.attr('data-id');
            $jq.editMetallNameInput.val(MAIN.metallTableContent.data[id].name);
            $jq.editMetallPriceInput.val(MAIN.metallTableContent.data[id].price);
            $jq.editMetallMassInput.val(MAIN.metallTableContent.data[id].mass);
            $jq.editMetallOutPriceInput.val(MAIN.metallTableContent.data[id]['out_price']);
            MAIN.$selectedRow = $this;
            $jq.editMetallModal.modal('show');
        });

        $jq.addKimIcon.click(function () {
            dbHandler.kimIconsToDefault();
            dbHandler.launchAddNewModal();
        });

        $jq.editKimIcon.click(function () {
            dbHandler.kimIconsToDefault(['#deleteKimIcon']);
            dbHandler.editKim.call(this);
        });

        $jq.deleteKimIcon.click(function () {
            dbHandler.kimIconsToDefault(['#editKimIcon']);
            dbHandler.deleteKim.call(this);
        });

        $jq.backKimIcon.click(function () {
            dbHandler.kimIconsToDefault();
            dbHandler.unfocus();
        });

        $jq.backDBTreeIcon.click(function () {
            var $productsTreeDB = $jq.productsTreeDB();
            $('#dbProductsListList .innerBackLayout').show();
            MAIN.productsTreeDB.plugins = _.difference(MAIN.productsTreeDB.plugins, ['checkbox']);
            $productsTreeDB.jstree('destroy');
            $productsTreeDB.jstree(MAIN.productsTreeDB);
            methods.toggleMainButtons($jq.productsTreeDBButtons, $jq.mainIcons);
            methods.hideLayout();
        });
    }

    return startPageHandler;
});