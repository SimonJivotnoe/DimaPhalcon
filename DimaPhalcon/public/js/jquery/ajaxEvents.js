function getTabs(param) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/getTabsList/' + param,
        method: 'GET'
    } ).then( function ( data )
    {
        app.tabs.dom.tabsList = data[3];
        if(0 !== data.length && 'all' === param){            
            if ('' !== data[0]) {
                $(data[0]).insertBefore( '#addNewTab' );
                if (!data[1]) {
                    showPreferences();
                } else {
                    getTabContent(data[2], data[1], 1);
                }
            } else {
                showPreferences();
            }
        } else if(0 === data.length && 'last' === param){
            app.tabs.addTab(1);
        } else if(0 !== data.length && 'last' === param){
            app.tabs.addTab(parseInt(data) +1);
        } else {
            showPreferences();
        }
    });
}

function getTabContent(productId, tabId, body) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/getTabContent/' + productId,
        method: 'GET'
    } ).then( function ( data )
    {
        $('#preferences1').attr('class', 'tab-pane');
        $('.currentTab' ).attr('id', tabId);
        $('.currentTab').attr('class', 'tab-pane active currentTab');
        $('.currentTab' ).html(data);
        $('.removeRow' ).hide();
        app.tabs.dom.curTabId = $('.currentTab').attr('id');
        app.tabs.dom.curTabName = 'a[href="#' + app.tabs.dom.curTabId + '"] .tabName';
        app.tabs.dom.productId = productId;
        //app.tabs.dom.tableContent = $.trim($('#sortable').html());
        $(function() {
            $('#calx').calx();
        });
        if (body) {
            $('body' ).fadeIn(350);
        }
    });
}

function addBtnToFormulasHelper(newFl) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/addBtnToFormulasHelper',
        method: 'POST',
        data: {'newFl': newFl}
    } ).then( function ( data )
    {
        if (true === data) {
            $('<span class="justCreated"><button type="button" class="btn btn-warning btn-xs fhBtn">' + newFl + '' +
            '<span class="glyphicon glyphicon-remove removeFhBtn" aria-hidden="true"></span></button></span>').insertBefore('#addNewBtnSpan');
            $('.justCreated' ).find('.removeFhBtn').hide('fast');
            $('.justCreated' ).show('slow' ).removeClass('.justCreated');
            $('#addNewFhBtnInput' ).val('');
        }

    });
}

function removeFormulasHelper(self, fhText) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/removeBtnFromFormulasHelper',
        method: 'POST',
        data: {'fhText': fhText}
    } ).then( function ( data )
    {
        $(self ).parent().fadeOut('slow');

    });
}

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
