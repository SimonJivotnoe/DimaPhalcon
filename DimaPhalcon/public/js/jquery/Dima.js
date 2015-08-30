;(function(global, $) {
    
    // 'new' an object
    var Dima = function(firstName, lastName, language) {
        return new Dima.init(firstName, lastName, language);   
    }

    // url's
    var URL = {
       BASE: 'http://DimaPhalcon/DimaPhalcon/',
       TABS: 'tabs/'
    };

    var SELF;
    // prototype holds methods (to save memory space)
    Dima.prototype = {

        run: function() {
            SELF  = this;
            this.tabs.getRightTabs();
            $('body').show();
        },

        // tabs section
        tabs: {

            URL: URL.BASE + URL.TABS,

            getRightTabs: function ()
            {
                var _self = this;
                $.ajax( {
                    url   : _self.URL + 'getRightTabs',
                    method: 'GET'
                } ).then( function ( data )
                {
                    if(!data.tabs) {
                        app.kim.getKIMTable();
                        app.metalls.getMetallsTable();
                        return true;
                    }

                    $(data.html).insertBefore( '#addNewTabRight' );
                    SELF.main.tabsRightList = data.obj;
                    _self.getRightTabContentOrderDetails(data.orderId, data.tabId);
                    _self.getRightTabContentTable(data.orderId);
                });
            },

            getRightTabContentOrderDetails: function (orderId, tabId) {
                var _self = this,
                    main = SELF.main;console.log(arguments.callee);
                $.ajax( {
                    url   : _self.URL + 'getRightTabContentOrderDetails/',
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
                        main.curTabRightId = tabId;
                        main.curTabRightName = 'a[href="#' + main.curTabRightId + '"] .tabName';
                        main.orderId = orderId;
                    }
                });
            },

            getRightTabContentTable: function (orderId) {
                var _self = this;
                $.ajax( {
                    url   : _self.URL + 'getRightTabContentTable/',
                    method: 'GET',
                    data: {orderId: orderId}
                } ).then( function ( data )
                {
                    var html;
                    $('#orderTableWrapper').html(data.html);
                });
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
        
    }
    
    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    Dima.init.prototype = Dima.prototype;
    
    // attach our Dima to the global object, and provide a shorthand '$G' for ease our poor fingers
    global.Dima = global.D$ = Dima;
    
}(window, jQuery));