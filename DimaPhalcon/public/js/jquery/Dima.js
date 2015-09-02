;(function(global, $) {
    
    // 'new' an object
    var Dima = function(firstName, lastName, language) {
        return new Dima.init(firstName, lastName, language);   
    };

    // url's
    var URL = {
       BASE: 'http://DimaPhalcon/DimaPhalcon/',
       TABS: 'tabs/',
       CATEG: 'categories/',
       ORDER: 'order/'
    };

    var TABS = URL.BASE + URL.TABS;

    var CATEG = URL.BASE + URL.CATEG;

    var ORDER = URL.BASE + URL.ORDER;
    
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
            return false;
        }
        $('body' ).fadeIn(350);
        return true;
    }
    
    function addLeftTabsHandler(html) {
        var tabs = SELF.tabs;        
        
        // change current tab
        html.find('[role=tab]').click(function(){
            var selectedTabId = $(this ).attr('aria-controls'),
                tabId, prodId;
                
            '' !== MAIN.curTabId ? MAIN.tabsList[MAIN.curTabId].active = '0' : 0;
            
            if (MAIN.curTabId !== selectedTabId && undefined !== selectedTabId){
                tabId = $(this ).find('.glyphicon-remove' ).attr('name' );
                prodId = $(this ).attr('name');                
                MAIN.tabsList[selectedTabId].active = '1'; 
                tabs.getLeftTabContent(prodId, selectedTabId);
            }
            
            tabs.changeActiveTab(tabId, selectedTabId);
        });
        
        //close tab
        html.find('.closeTab').click(function (e){
            e.stopPropagation();
            var currentID = $(this).parent().attr('aria-controls' ),
                idDb = $(this ).attr('name');
            $(this ).attr('class', 'glyphicon glyphicon-remove');
            tabs.closeTabMethod(idDb, currentID);
        });
    }
    
    function addLeftTabContentHandler(html) {
        var tabs = SELF.tabs,
            order = SELF.order;
        
        return html;
    }
    
    function addRightTabContentHandler(html) {
        var tabs = SELF.tabs,
            order = SELF.order;        
        
        html
            .find('#checkAllInOrder').click(function () {
                order.checkAllInOrderDetails(true);
            }).end()
            
            .find('#uncheckAllInOrder').click(function () {
                order.checkAllInOrderDetails(false);
            }).end()
            
            .find('#changeDiscount').click(function () {
                order.changeDiscount({
                    discount: $(this).val(),
                    orderId: MAIN.orderId
                });
            });
        /*html.find('#uncheckAllInOrder').click(function () {
            order.checkAllInOrderDetails(false);
        });*/
        
        html.find('#changeDiscount').click(function () {
            order.changeDiscount({
                discount: $(this).val(),
                orderId: MAIN.orderId
            });
            
        });
        
        return html;
    }
    
    function addHandlers() {
        var tabs = app.tabs,
            tabsDom = app.tabs.dom,
            order = app.order;     
        
        //RIGHT PART
        
        /*----ORDERS START----*/
        $(tabsDom.createOrderBtn).on('click', function() {
            app.order.createNewOrder(tabsDom.productId);
        });

        

        $('body').on('click', '#checkAllInOrder', function () {
            order.checkAllInOrderDetails(true);
        });
        $('body').on('click', '#uncheckAllInOrder', function () {
            order.checkAllInOrderDetails(false);
        });
        $('body').on('change', '#quantityInOrder', function () {
            var quantity = parseInt($(this).val()),
                //orderId = $(this).attr('data-order'),
                productId = $(this).attr('data-product'),
                row = $(this).parents('.orderRow'),
                inPrice, outPrice, inSum, outSum;
            if (0 > quantity) {
                quantity = 1;
                $(this).val(quantity);
            }    
            inPrice = parseFloat(row.find('.inputPriceInOrder').text());
            outPrice = parseFloat(row.find('.outputPriceInOrder').text());
            inSum = quantity * inPrice;
            outSum = quantity * outPrice;
            row.find('.inputSumInOrder').html(inSum.toFixed(2)).
                    end().
                    find('.outputSumInOrder').html(outSum.toFixed(2));
            order.changeQuantity({
                    orderId: tabsDom.orderId,
                    productId: productId,
                    quantity: quantity
                }
            );
        });
        $('body').on('keyup', '.inputOrderDetails', function() {
            var obj = order.createJSONFromOrderDescription();
            order.changeOrderDetails({
                    orderId: tabsDom.orderId,
                    orderDescr: obj
                }
            );
        });
        $('body').on('keyup, click, change', '#orderEstimateInput, #orderDateInput', function() {
            var obj = order.createJSONFromOrderDescription();
            order.changeOrderDetails({
                    orderId: tabsDom.orderId,
                    orderDescr: obj
                }
            );
        });
        /*----ORDERS END----*/   
        
    }
    
    // prototype holds methods (to save memory space)
    Dima.prototype = {

        run: function() {
            SELF  = this;
            MAIN = SELF.main;
            this.tabs.getLeftTabsList();
            this.tabs.getRightTabsList();
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
                    MAIN.tabsList = data.tabsList;
                    MAIN.tableContent = data.kim;
                    
                    if (data.html) {
                        html = $(data.html);
                        addLeftTabsHandler(html);
                        html.insertBefore( '#addNewTab' );
                    }
                    if (data.active) {
                        _self.getLeftTabContent(data.productId, data.active);
                    } else {
                        _self.showPreferences();
                    }
                });
            },

            getLeftTabContent: function(productId, tabId) {
                var _self = this;
                $.ajax( {
                    url   : TABS + 'getLeftTabContent/' + productId,
                    method: 'GET'
                } ).then( function ( data )
                {
                    var kim, metall, metallOut;
                    $('#preferences1').removeClass('active');
                    $('.currentTab' )
                        .attr('id', tabId)
                        .addClass('active')
                        .html(addLeftTabContentHandler($(data)));
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
                    showBody();
                });
            },
            
            changeActiveTab: function (id, tabId) {
                var _self = this;
                $.ajax({
                    url: TABS + 'changeActiveTab',
                    method: 'POST',
                    data: {
                        id: id,
                        tabId: tabId
                    }
                }).then(function (data)
                {
                    //console.log(data);
                });
            },
            
            closeTabMethod: function (idDb, currentID) {
                var _self = this,
                        nextActiveTab = MAIN.curTabId,
                        productId = MAIN.productId,
                        elemInObj = Object.keys(MAIN.tabsList),
                        ifActive, index;
                if (2 === elemInObj.length) {
                    nextActiveTab = 'preferences1';
                } else {
                    ifActive = MAIN.tabsList[currentID].active;
                    if ('1' === ifActive) {
                        index = elemInObj.indexOf(currentID);
                        if (index === elemInObj.length - 1) {
                            nextActiveTab = Object.keys(MAIN.tabsList)[elemInObj.length - 2];
                        } else {
                            nextActiveTab = Object.keys(MAIN.tabsList)[index + 1];
                        }
                        productId = MAIN.tabsList[nextActiveTab].productId;
                        MAIN.tabsList[nextActiveTab].active = '1';
                    }
                }
                delete MAIN.tabsList[currentID];
                $('[aria-controls=' + currentID + ']').hide('highlight');
                setTimeout(function () {
                    $('[aria-controls=' + currentID + ']').parent().remove();
                }, 700);
                if ('preferences1' === nextActiveTab || undefined === nextActiveTab) {
                    $('.currentTab').removeClass('active');
                    $('#preferences, #preferences1').addClass('active');
                    _self.loadPreferences();
                } else {
                    $('[aria-controls=' + nextActiveTab + ']').parent().addClass('active');
                }

                $.ajax({
                    url: TABS + 'closeTab',
                    method: 'POST',
                    data: {
                        id: idDb,
                        tabId: currentID,
                        nextActiveTab: nextActiveTab
                    }
                }).then(function (  )
                {
                    if ('preferences1' !== nextActiveTab) {
                        _self.getLeftTabContent(productId, nextActiveTab);
                    }
                });
            },
            
            getLastLeftTab: function() {
                var _self = this,
                    html;
                $.ajax( {
                    url   : TABS + 'getLastLeftTab',
                    method: 'GET'
                } ).then( function ( data )
                {console.log(data);
                    _self.addNewLeftTab(data);
                });
            },
            
            addNewLeftTab: function(id) {
                var _self = this,
                    html;
                $.ajax( {
                    url   : TABS + 'addNewLeftTab/' + id,
                    method: 'POST'
                } ).then( function ( data )
                {
                    window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
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
                        $('#kimTab').removeClass('active');
                        $('.currentTabRight' )
                            .attr('id', tabId)
                            .addClass('active');
                        var b = addRightTabContentHandler($(data.html));console.log(b);    
                        $('#orderDetailsWrapper').html(addRightTabContentHandler($(data.html)));
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
            },
            
            changeDiscount: function (obj) {
                var _self = this;
                $.ajax({
                    url: ORDER + 'changeDiscount',
                    method: 'POST',
                    data: obj
                }).then(function (data) {
                        console.log(data);
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