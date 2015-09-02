;(function(global, $) {
    
    // 'new' an object
    var Dima = function(firstName, lastName, language) {
        return new Dima.init(firstName, lastName, language);   
    };

    // url's
    var URL = {
       BASE: 'http://DimaPhalcon/DimaPhalcon/',
       TABS: 'tabs/',
       CATEG: 'categories/'
    };

    var TABS = URL.BASE + URL.TABS;

    var CATEG = URL.BASE + URL.CATEG;

    var SELF;

    var MAIN;

    // logging errors
    function log(php) {
        if('undefined' != typeof(console))
        {
            console.error('ERROR in ' + php);
        }        
    }

    function showBody() {
        if ($('body').is(":visible")) {
            return true;
        }
        $('body' ).fadeIn(350);
        return false;
    }

    // prototype holds methods (to save memory space)
    Dima.prototype = {

        run: function() {
            SELF  = this;
            MAIN = SELF.main;
            this.tabs.getLeftTabsList();
            this.tabs.getRightTabsList();
            showBody();
        },

        // tabs section
        tabs: {

            getLeftTabsList: function() {
                var _self = this,
                    html;
                $.ajax( {
                    url   : TABS + 'getLeftTabsList',
                    method: 'GET'
                } ).then( function ( data )
                {console.log(data);
                    html = $(data.html);

                    MAIN.tabsList = data.tabsList;
                    MAIN.tableContent = data.kim;
                    
                    if (false !== data.active) {
                        html.insertBefore( '#addNewTab' );
                        _self.getLeftTabContent(data.productId, data.active);
                    } else {
                        _self.showPreferences();
                    }
                });
            },

            getLeftTabContent: function(productId, tabId) {
                var _self = this;
                $.ajax( {
                    url   : TABS + 'getTabContent/' + productId,
                    method: 'GET'
                } ).then( function ( data )
                {
                    var kim, metall, metallOut;
                    $('#preferences1').removeClass('active');
                    $('.currentTab' )
                        .attr('id', tabId)
                        .addClass('active')
                        .html(data);
                    $('.removeRow' ).hide();
                    MAIN.curTabId = tabId;
                    MAIN.curTabName = 'a[href="#' + MAIN.curTabId + '"] .tabName';
                    MAIN.productId = productId;
                    kim = $('.listOfKim option:selected' ).attr('kim');
                    metall = $('.listOfMetalls option:selected' ).attr('metall');
                    metallOut = $('.listOfMetalls option:selected' ).attr('metallOut');
                    $('[data-cell="KIM1"]' ).val(kim);
                    $('[data-cell="PR1"]' ).val(metall);
                    $('[data-cell="PR2"]' ).val(metallOut);
                    $('#calx').calx();
                    /*if (body) {
                        app.addHandlers();

                        $('body' ).fadeIn(350);
                    }*/
                    showBody();
                });
            },

            getRightTabsList: function ()
            {
                var _self = this;
                $.ajax( {
                    url   : TABS + 'getRightTabsList',
                    method: 'GET'
                } ).then( function ( data )
                {
                    if(!data.tabs) {
                        app.kim.getKIMTable();
                        app.metalls.getMetallsTable();
                        return true;
                    }

                    $(data.html).insertBefore( '#addNewTabRight' );
                    MAIN.tabsRightList = data.obj;
                    _self.getRightTabContentOrderDetails(data.orderId, data.tabId);
                    _self.getRightTabContentTable(data.orderId);
                });
            },

            getRightTabContentOrderDetails: function (orderId, tabId) {
                var _self = this;
                $.ajax( {
                    url   : TABS + 'getRightTabContentOrderDetails/',
                    method: 'GET',
                    data: {orderId: orderId}
                } ).then( function ( data )
                {
                    if (true === data.success) {
                        var html = $(data.html);
                        $('#kimTab').removeClass('active');
                        $('.currentTabRight' )
                            .attr('id', tabId)
                            .addClass('active');
                        html.find('#checkAllInOrder' ).click(function () {
                            SELF.order.checkAllInOrderDetails(true);
                        });
                        html.find('#uncheckAllInOrder' ).click(function () {
                            SELF.order.checkAllInOrderDetails(false);
                        });
                        $('#orderDetailsWrapper').html(html);
                        MAIN.curTabRightId = tabId;
                        MAIN.curTabRightName = 'a[href="#' + MAIN.curTabRightId + '"] .tabName';
                        MAIN.orderId = orderId;
                        return this;
                    }
                    log(data.error);
                });
            },

            getRightTabContentTable: function (orderId) {
                var _self = this;
                $.ajax( {
                    url   : TABS + 'getRightTabContentTable/',
                    method: 'GET',
                    data: {orderId: orderId}
                } ).then( function ( data )
                {
                    var html;
                    $('#orderTableWrapper').html(data.html);
                });
            },

            loadPreferences: function() {
                var _self = this;
                MAIN.tabsList['preferences1'].active = '1';
                MAIN.curTabId = 'preferences1';
                $('.bg-danger' ).fadeOut(10);
                $(MAIN.addCategoryInput ).val('');
                _self.getCategoriesList();
            },

            showPreferences: function (){
                var _self = this;
                $('#preferences, #preferences1').addClass('active');
                _self.loadPreferences();
                showBody();
            },

            addCategory: function(categoryName) {
                var _self = this,
                    objJSON;
                $.ajax( {
                    url   :  CATEG +'add',
                    method: 'POST',
                    data: {categoryName: categoryName}
                } ).then( function ( data )
                {
                    objJSON = JSON.parse( data );
                    $.each(objJSON, function(key, val){
                        if ('ok' === val) {
                            $('#addCategoryInput' ).val('');
                            $('.bg-danger' ).fadeOut();
                            _self.getCategoriesList();
                        } else {
                            $('.bg-danger' ).fadeIn();
                        }
                    });
                } );
            },

            getCategoriesList: function() {
                var _self = this;
                $.ajax( {
                    url   : CATEG + 'getCategoriesList',
                    method: 'GET'
                } ).then( function ( data )
                {
                    $('#categoriesListTable tbody' ).html('<tr><th>Список категорий</th></tr>');
                    $.each(data, function(key, val){
                        $('#categoriesListTable tbody' ).append('<tr><td>' + val + '</td></tr>');
                    })
                } )
            }
        },

        // order section
        order: {
            checkAllInOrderDetails:  function(param) {
                $.each($('#orderDetails input'), function (key, val) {
                    $(val).prop('checked', param);
                });
            }
        }
        
    };
    
    // the actual object is created here, allowing us to 'new' an object without calling 'new'
    Dima.init = function(firstName, lastName, language) {
        
        var self = this;
        self.main = {};
        self.firstName = firstName || '';
        self.lastName = lastName || '';
        self.language = language || 'en';
        
        self.run();
        
    };
    
    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    Dima.init.prototype = Dima.prototype;
    
    // attach our Dima to the global object, and provide a shorthand '$G' for ease our poor fingers
    global.Dima = global.D$ = Dima;
    
}(window, jQuery));