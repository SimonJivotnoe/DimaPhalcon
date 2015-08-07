function getTabs(param) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/getTabsList/' + param,
        method: 'GET'
    } ).then( function ( data )
    {
        app.tabs.dom.tabsList = data[3];
        app.kim.tableContent = data[4];
        if(0 !== data.length && 'all' === param){
            if ('' !== data[0]) {
                $(data[0]).insertBefore( '#addNewTab' );
                if (!data[1]) {
                    app.tabs.showPreferences();
                    app.addHandlers();
                } else {
                    app.tabs.getTabContent(data[2], data[1], 1);
                }
            } else {
                app.tabs.showPreferences();
                app.addHandlers();
            }
        } else if(0 === data.length && 'last' === param){
            app.tabs.addTab(1);
        } else if(0 !== data.length && 'last' === param){
            app.tabs.addTab(parseInt(data) +1);
        } else {
            app.tabs.showPreferences();
            app.addHandlers();
        }
    });
}

/*function getTabContent(productId, tabId, body) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/getTabContent/' + productId,
        method: 'GET'
    } ).then( function ( data )
    {
        var kim, metall;
        $('#preferences1').attr('class', 'tab-pane');
        $('.currentTab' ).attr('id', tabId);
        $('.currentTab').attr('class', 'tab-pane active currentTab');
        $('.currentTab' ).html(data);
        $('.removeRow' ).hide();
        app.tabs.dom.curTabId = $('.currentTab').attr('id');
        app.tabs.dom.curTabName = 'a[href="#' + app.tabs.dom.curTabId + '"] .tabName';
        app.tabs.dom.productId = productId;
        kim = $('.listOfKim option:selected' ).attr('kim');
        metall = $('.listOfMetalls option:selected' ).attr('metall');
        $('[data-cell="KIM1"]' ).val(kim);
        $('[data-cell="PR1"]' ).val(metall);
        $('#calx').calx();
        (body) ? $('body' ).fadeIn(350) : 0;

    });
}*/



/* PREFERENCES */
function addCategory(categoryName) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/categories/add',
        method: 'POST',
        data: {'categoryName': categoryName}
    } ).then( function ( data )
    {
        var objJSON = JSON.parse( data );
        $.each(objJSON, function(key, val){
            if ('ok' === val) {
                $('#addCategoryInput' ).val('');
                $('.bg-danger' ).fadeOut();
                getCategoriesList();
            } else {
                $('.bg-danger' ).fadeIn();
            }
        })
    } )
}

function getCategoriesList() {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/categories/getCategoriesList',
        method: 'GET'
    } ).then( function ( data )
    {
        $('#categoriesListTable tbody' ).html('<tr><th>Список категорий</th></tr>');
        $.each(data, function(key, val){
            $('#categoriesListTable tbody' ).append('<tr><td>' + val + '</td></tr>');
        })
    } )
}
