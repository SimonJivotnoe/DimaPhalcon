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
       ORDER: 'order/',
       KIM: 'kim/',
       METALLS: 'metalls/'
    };

    var URL_TABS = URL.BASE + URL.TABS;

    var URL_CATEG = URL.BASE + URL.CATEG;

    var URL_ORDER = URL.BASE + URL.ORDER;
    
    var URL_KIM = URL.BASE + URL.KIM;
    
    var URL_METALLS = URL.BASE + URL.METALLS;

    // alias to this Class
    var SELF;

    // alias to self.main
    var MAIN;

    // alias to self.tabs
    var TABS;
    
    // alias to self.order
    var ORDER;
    
    // alias to self.kim
    var KIM;
    
    // alias to self.metalls
    var METALLS;
    
    var orderPlaceholder = {
        "%FIO%": "",
        "%PROJECT_NAME%": "",
        "%APPEAL%": "",
        "%PROJECT_DESCR%": "",
        "%COMPANY_NAME%": "",
        "%ADDRES%": "",
        "%ACC_NUMBER%": "",
        "%CITY%": "",
        "%ESTIMATE%": "",
        "%DATE%": ""
    };

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
    
    function kimEditOver(obj, scope) {
        $('.glyphicon-pencil', scope)
            .removeClass(obj.pencilRemove)
            .addClass(obj.pencilAdd);
        $('.glyphicon-remove', scope)
            .removeClass(obj.removeRemove)
            .addClass(obj.removeAdd);
    }
    
    function addLeftTabsHandler(html) {

        html
            // change current tab
            .find('[role=tab]').click(function(){
                var selectedTabId = $(this ).attr('aria-controls'),
                    tabId, prodId;

                '' !== MAIN.curTabId ? MAIN.tabsList[MAIN.curTabId].active = '0' : 0;

                if (MAIN.curTabId !== selectedTabId && undefined !== selectedTabId){
                    tabId = $(this ).find('.glyphicon-remove' ).attr('name' );
                    prodId = $(this ).attr('name');
                    MAIN.tabsList[selectedTabId].active = '1';
                    TABS.getLeftTabContent(prodId, selectedTabId);
                }

                TABS.changeActiveTab(tabId, selectedTabId);
            }).end()
        
            //close tab
            .find('.closeTab').click(function (e){
                e.stopPropagation();
                var currentID = $(this).parent().attr('aria-controls' ),
                    idDb = $(this ).attr('name');
                $(this ).attr('class', 'glyphicon glyphicon-remove');
                TABS.closeTabMethod(idDb, currentID);
            });
    }
    
    function addLeftTabContentHandler(html) {

        html
            // edit & save categories list content
            .filter('.blockNameAndCat')
                .mouseover(function(){
                    $('#editCategoriesListContent' ).show();
                })
                .mouseleave(function(){
                    $('#editCategoriesListContent' ).css('display', 'none');
                } ).end()
            .filter('.tableContent')
                .mouseover(function(){
                    $('#editTableContent' ).show();
                })
                .mouseleave(function(){
                    $('#editTableContent' ).css('display', 'none');
                });

        return html;
    }
    
    function addRightTabsHandler(html) {
        return html;
    }
    
    function addRightTabContentHandler(html) {       
        
        html
            .find('#checkAllInOrder').click(function () {
                ORDER.checkAllInOrderDetails(true);
            }).end()

            .find('#uncheckAllInOrder').click(function () {
                ORDER.checkAllInOrderDetails(false);
            }).end()
            
            .find('#changeDiscount').click(function () {
                ORDER.changeDiscount({
                    discount: $(this).val(),
                    orderId: MAIN.orderId
                });
            }).end()

            .find('.inputOrderDetails' ).keyup(function() {
                var obj = ORDER.createJSONFromOrderDescription();
                ORDER.changeOrderDetails(
                    {
                        orderId: MAIN.orderId,
                        orderDescr: obj
                    }
                );
            }).end()

            .find('#orderEstimateInput, #orderDateInput').on('keyup, click, change', function() {
                var obj = ORDER.createJSONFromOrderDescription();
                ORDER.changeOrderDetails(
                    {
                        orderId: MAIN.orderId,
                        orderDescr: obj
                    }
                );
            });
        
        return html;
    }
    
    function addKimTableHandler(html) {
        
        html
            .find('#tbodyKIM tr')
                .mouseover(function () {
                    var obj = {
                        pencilRemove: 'triggerKimPencil',
                        pencilAdd: 'editKimPencil',
                        removeRemove: 'triggerRemoveKim',
                        removeAdd: 'removeKim'
                    };
                    kimEditOver(obj, this);
                })
                .mouseleave(function () {
                    var obj = {
                        pencilRemove: 'editKimPencil',
                        pencilAdd: 'triggerKimPencil',
                        removeRemove: 'removeKim',
                        removeAdd: 'triggerRemoveKim'
                    };
                    kimEditOver(obj, this);
                });
        
        return html;
    }
    
    // prototype holds methods (to save memory space)
    Dima.prototype = {

        run: function() {
            SELF  = this;
            MAIN = SELF.main,
            TABS = SELF.tabs;
            ORDER = SELF.order;
            KIM = SELF.kim;
            METALLS = SELF.metalls;
            TABS.getLeftTabsList();
            TABS.getRightTabsList();
        },

        // tabs section
        tabs: {
            getLeftTabsList: function() {
                $.ajax( {
                    url   : URL_TABS + 'getLeftTabsList',
                    method: 'GET'
                } ).then( function ( data )
                {
                    var html;
                    
                    MAIN.tabsList = data.tabsList;
                    MAIN.tableContent = data.kim;
                    
                    if (data.html) {
                        html = $(data.html);
                        addLeftTabsHandler(html);
                        html.insertBefore( '#addNewTab' );
                    }
                    if (data.active && data.html) {
                        TABS.getLeftTabContent(data.productId, data.active);
                    } else {
                        TABS.showPreferences();
                    }
                });
            },

            getLeftTabContent: function(productId, tabId) {
                $.ajax( {
                    url   : URL_TABS + 'getLeftTabContent/' + productId,
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
                $.ajax({
                    url: URL_TABS + 'changeActiveTab',
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
                var nextActiveTab = MAIN.curTabId,
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
                    TABS.loadPreferences();
                } else {
                    $('[aria-controls=' + nextActiveTab + ']').parent().addClass('active');
                }

                $.ajax({
                    url: URL_TABS + 'closeTab',
                    method: 'POST',
                    data: {
                        id: idDb,
                        tabId: currentID,
                        nextActiveTab: nextActiveTab
                    }
                }).then(function (  )
                {
                    if ('preferences1' !== nextActiveTab) {
                        TABS.getLeftTabContent(productId, nextActiveTab);
                    }
                });
            },
            
            getLastLeftTab: function() {
                var html;
                $.ajax( {
                    url   : URL_TABS + 'getLastLeftTab',
                    method: 'GET'
                } ).then( function ( data )
                {
                    TABS.addNewLeftTab(data);
                });
            },
            
            addNewLeftTab: function(id) {
                $.ajax( {
                    url   : URL_TABS + 'addNewLeftTab/' + id,
                    method: 'POST'
                } ).then( function ( data )
                {
                    window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
                });
            },

            getRightTabsList: function ()
            {
                $.ajax( {
                    url   : URL_TABS + 'getRightTabsList',
                    method: 'GET'
                } ).then( function ( data )
                {console.log(data);
                    if(!data.tabs) {
                        KIM.getKIMTable();
                        METALLS.getMetallsTable();
                        return true;
                    }

                    $(addRightTabsHandler($(data.html))).insertBefore( '#addNewTabRight' );
                    MAIN.tabsRightList = data.obj;
                    TABS.getRightTabContentOrderDetails(data.orderId, data.tabId);
                    TABS.getRightTabContentTable(data.orderId);
                });
            },

            getRightTabContentOrderDetails: function (orderId, tabId) {
                $.ajax( {
                    url   : URL_TABS + 'getRightTabContentOrderDetails/',
                    method: 'GET',
                    data: {orderId: orderId}
                } ).then( function ( data )
                {
                    if (true === data.success) {
                        $('#kimTab, #kim').removeClass('active');
                        $('.currentTabRight' )
                            .attr('id', tabId)
                            .addClass('active');
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
                $.ajax( {
                    url   : URL_TABS + 'getRightTabContentTable/',
                    method: 'GET',
                    data: {orderId: orderId}
                } ).then( function ( data )
                {
                    var html;
                    
                    $('#orderTableWrapper').html(data.html);
                });
            },

            loadPreferences: function() {
                MAIN.tabsList['preferences1'].active = '1';
                MAIN.curTabId = 'preferences1';
                $('.bg-danger' ).fadeOut(10);
                $(MAIN.addCategoryInput ).val('');
                TABS.getCategoriesList();
            },

            showPreferences: function (){
                $('#preferences, #preferences1').addClass('active');
                TABS.loadPreferences();
                showBody();
            },

            addCategory: function(categoryName) {
                var objJSON;
                $.ajax( {
                    url   :  URL_CATEG +'add',
                    method: 'POST',
                    data: {categoryName: categoryName}
                } ).then( function ( data )
                {
                    objJSON = JSON.parse( data );
                    $.each(objJSON, function(key, val){
                        if ('ok' === val) {
                            $('#addCategoryInput' ).val('');
                            $('.bg-danger' ).fadeOut();
                            TABS.getCategoriesList();
                        } else {
                            $('.bg-danger' ).fadeIn();
                        }
                    });
                } );
            },

            getCategoriesList: function() {
                $.ajax( {
                    url   : URL_CATEG + 'getCategoriesList',
                    method: 'GET'
                } ).then( function ( data )
                {
                    $('#categoriesListTable tbody' ).html('<tr><th>Список категорий</th></tr>');
                    $.each(data, function(key, val){
                        $('#categoriesListTable tbody' ).append('<tr><td>' + val + '</td></tr>');
                    });
                } );
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
                $.ajax({
                    url: URL_ORDER + 'changeDiscount',
                    method: 'POST',
                    data: obj
                }).then(function (data) {
                    console.log(data);
                });
            },

            changeOrderDetails: function(obj) {
                $.ajax( {
                    url   : URL_ORDER + 'changeOrderDetails',
                    method: 'POST',
                    data: obj
                } ).then( function ( data ) {
                    console.log(data);
                });
            },

            createJSONFromOrderDescription: function() {
                var obj = orderPlaceholder,
                    arr = _.keys(obj), i = 0;
                $.each($('.inputOrderDetails'), function(key, val){
                    obj[arr[i]] = $(val).text();
                    i++;
                });
                obj["%ESTIMATE%"] = $('#orderEstimateInput' ).val();
                obj["%DATE%"] = $('#orderDateInput' ).val();
                return obj;
            }
        },
        
        // kim section
        kim: {            
            getKIMTable: function () {
                var self = this;
                $.ajax({
                    url: URL_KIM + 'getKIMTable',
                    method: 'GET'
                }).then(function (data)
                {
                    MAIN.kimTableContent = data.kimTableContent;
                    $('#tbodyKIM').html(addKimTableHandler($(data.html)));
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