define(['jq'], function ($jq) {
    var PRODUCT = {
        addProductsDbHandler: function(html) {
            html
                .find('#db-left-component').css('width', localStorage['db-split']).end()

                .find('#db-divider, #db-right-component').css('left', localStorage['db-split']).end()

                .find('#db-divider').on('mousemove', function(){
                    localStorage['db-split'] = $('#db-divider').css('left');
                }).end()

                .find('#dbProductsListList .productsTreeDB' ).on('changed.jstree', function(){
                    return false;
                }).end()

                .find('#fileManagerCatogoriesSelect' ).change(function() {
                    var category = $('option:selected', this ).attr('name' );
                    $.each($('.prManProductTableCategory'), function(){
                        $(this ).parent().show();
                        if ($(this).attr('name') !== category && 'categoriesAll' !== category) {
                            $(this ).parent().hide();
                        }
                    });
                }).end()

                .find('#dbProductsListTab').click(function(){
                    TABS.setActiveDefaultTab('tabsList', 'dbProductsListTab', 'curTabId');
                    TABS.changeActiveTab('', '', 'changeActiveLeftTab');
                    PRODUCT.createFileManager('PR');
                }).end()

                .find('.categoriesWrapper, .kimWrapper, .metallWrapper' ).click(function(){
                    focusedElem = $(this);
                    var scrollTable = focusedElem.find('table').attr('data-scroll');
                    scrollTables.scrollTop = focusedElem.find('.dataTables_scrollBody').scrollTop();
                    if (MAIN.scrollTables[scrollTable]) {
                        MAIN.scrollTables[scrollTable].destroy();
                        MAIN.scrollTables[scrollTable] = false;
                    }
                    methods.focus(scrollTable);
                } ).end()

                .find('#dbProductsListList .innerBackLayout').click(function(){
                    var $productsTreeDB = jq.$productsTreeDB();
                    $(this ).hide();
                    productsTreeDB.plugins.push('checkbox');
                    productsTreeDB.plugins = _.uniq(productsTreeDB.plugins);
                    $productsTreeDB.jstree('destroy');
                    $productsTreeDB.jstree(productsTreeDB);
                    methods.toggleMainButtons(jq.$mainIcons, jq.$productsTreeDBButtons);
                    methods.showLayout($('#settingsMetallsWrapper'));
                } ).end()

                .find('#addNewTab').on('click', function(){
                    TABS.getLastLeftTab();
                }).end()

                .find('#FMsearchInProducts').keyup(function() {
                    var text = $(this).val(),
                        rows = $('#fileManagerProductsTable tr:gt(0)');
                    MENU.searchInTable(rows, text, 'tr');
                }).end()

                .find('#tabs').on('dblclick', '#myTab li', function(){
                    localStorage['db-split'] === maxScreenSize ? localStorage['db-split'] = defaultScreenSize : localStorage['db-split'] = maxScreenSize;
                    $('#db-left-component').css('width', localStorage['db-split']);
                    $('#db-divider, #db-right-component').css('left', localStorage['db-split']);
                });
            return html;
        }
    };

    return PRODUCT;
});
