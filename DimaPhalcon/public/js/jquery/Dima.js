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
    
    var LOCATION = 'http://DimaPhalcon/DimaPhalcon/';

    // alias to this Class
    var SELF;

    // alias to self.main
    var MAIN;

    // alias to self.tabs
    var TABS;

    // alias to self.product
    var PRODUCT;

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
    function changeActiveTab(obj) {
        var scope = obj.scope,
            selectedTabId = $(scope ).attr('aria-controls'),
            curTabId = obj.curTabId,
            tabsList = obj.tabsList,
            tabId, prodId;
        console.log(MAIN[tabsList][MAIN[curTabId]]);
        '' !== MAIN[curTabId] ? MAIN[tabsList][MAIN[curTabId]].active = '0' : 0;

        if (MAIN[curTabId] !== selectedTabId && undefined !== selectedTabId){
            tabId = $(scope ).find('.glyphicon-remove' ).attr('name' );
            prodId = $(scope ).attr('name');
            MAIN[tabsList][selectedTabId].active = '1';
            if (obj.hasOwnProperty('order')) {
                TABS.getRightTabContentOrderDetails(prodId, selectedTabId);
                TABS.getRightTabContentTable(prodId);
            } else {
                TABS[obj.getTabContent](prodId, selectedTabId);
            }
            //TABS[obj.changeActiveTab](tabId, selectedTabId);
        }
    }
    function addLeftTabsHandler(html) {

        html
            // change current tab
            .find('[role=tab]').click(function(){
                changeActiveTab({
                    scope: this,
                    curTabId: 'curTabId',
                    tabsList: 'tabsList',
                    getTabContent: 'getLeftTabContent',
                    changeActiveTab: 'changeActiveTab'
                });
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
                } ).end()

            .find('#editCategoriesListContent' ).click(function(){
                $(this ).attr('class', 'glyphicon glyphicon-floppy-disk' ).attr('id', 'saveCategoriesListContent');
                $('.nameOfProduct, .listOfCategories, .listOfKim, .listOfMetalls' ).prop('disabled', false );
            } ).end()

            .find('#saveCategoriesListContent' ).click(function(){
                $(this ).attr('class', 'glyphicon glyphicon-pencil leftTable').attr('id', 'editCategoriesListContent');
                $('.nameOfProduct, .listOfCategories, .listOfKim, .listOfMetalls' ).prop('disabled', true );
                var prName = $('.nameOfProduct' ).val(),
                    categoryId = $('.listOfCategories option:selected' ).attr('name' ),
                    kimId = $('.listOfKim option:selected' ).attr('name' ),
                    metallId = $('.listOfMetalls option:selected' ).attr('name');
                if ('' === prName) {
                    prName = 'Новое изделие';
                    $(MAIN.curTabName).text('Новое изделие');
                }
                TABS.changeTabName(prName, categoryId, kimId, metallId);
                PRODUCT.saveTable();
            }).end()
            
            .find('#createOrderBtn').click(function () {
                ORDER.createNewOrder(MAIN.productId);
            });

        return html;
    }
    
    function addRightTabsHandler(html) {

        html
            .find('[role=tab]').click(function(){
                changeActiveTab({
                    scope: this,
                    order: true,
                    curTabId: 'curTabRightId',
                    tabsList: 'tabsRightList',
                    getTabContent: 'getLeftTabContent',
                    changeActiveTab: 'changeActiveRightTab'
                });
            })
        return html;
    }
    
    function addRightTabContentOrderHandler(html) {
        
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

    function addRightTabContentTableHandler(html) {

        html
            .find('#quantityInOrder' ).change(function () {
                var quantity = parseInt($(this).val()),
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
                ORDER.changeQuantity({
                        orderId: MAIN.orderId,
                        productId: productId,
                        quantity: quantity
                    }
                );
            });

        return html;
    }

    function addKimTableHandler(html) {
        //console.log(html.find('.editKimPencil'));
        html
            .filter('tr')
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
                }).end()
                
            .on('click', '.removeKim', function(){
                var kimId = $(this ).attr('name');;
                KIM.removeKim(kimId);
            })
            
            .on('click', '.editKimPencil', function(){
                $(this )
                    .attr('class', 'glyphicon glyphicon-floppy-disk saveEditKim' )
                    .css('margin-left', '0');
                $(this )
                    .parents('tr')
                    .find('.kimHardName, .kimName')
                    .attr('contenteditable', 'true')
                    .css({
                        'border': '1px solid hsl(195, 79%, 43%)',
                        'border-radius': '2px'
                    });
            })
            
            .on('click', '.saveEditKim', function(){
                var kimId = $(this ).attr('name'),
                    kim = KIM.validation($(this ).parents('tr').find('.kimName' ).text()),
                    kimHard = $(this ).parents('tr').find('.kimHardName' ).text(),
                    self = this;
                KIM.editKim(kimId, kim, kimHard, self);
            });
            
        return html;
    }
    
    function addMetallsTableHandler(html) {
        
        html
            .filter('tr')
                .mouseover(function () {
                    var obj = {
                        pencilRemove: 'triggerMetallPencil',
                        pencilAdd: 'editMetallPencil',
                        removeRemove: 'triggerRemoveMetall',
                        removeAdd: 'removeMetall'
                    };
                    kimEditOver(obj, this);
                })
                .mouseleave(function () {
                    var obj = {
                        pencilRemove: 'editMetallPencil',
                        pencilAdd: 'triggerMetallPencil',
                        removeRemove: 'removeMetall',
                        removeAdd: 'triggerRemoveMetall'
                    };
                    kimEditOver(obj, this);
                }).end()
                
            .on('click', '.editMetallPencil', function () {
                $(this)
                        .attr('class', 'glyphicon glyphicon-floppy-disk saveEditMetall')
                        .css('margin-left', '0');
                $(this)
                        .parents('tr')
                        .find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
                        .attr('contenteditable', 'true')
                        .css({
                            'border': '1px solid hsl(195, 79%, 43%)',
                            'border-radius': '2px'
                        });
            })
            
            .on('click', '.saveEditMetall', function(){
                var obj = {
                    metallId: $(this ).attr('name'),
                    metallName: $(this ).parents('tr').find('.metallName' ).text(),
                    metallPrice: KIM.validation($(this ).parents('tr').find('.metallPrice' ).text()),
                    metallMass: KIM.validation($(this ).parents('tr').find('.metallMass' ).text()),
                    metallOutPrice: KIM.validation($(this ).parents('tr').find('.metallOutPrice' ).text())
                };
                var self = this;
                METALLS.editMetall(obj, this);
            })
            .on('click', '.removeMetall', function () {
                var metallId = $(this).attr('name');
                METALLS.removeMetall(metallId);
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
            PRODUCT = SELF.product;
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

            changeActiveRightTab: function (id, tabId) {
                   console.log('here');
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
                    window.location.href = LOCATION;
                });
            },

            getRightTabsList: function ()
            {
                $.ajax( {
                    url   : URL_TABS + 'getRightTabsList',
                    method: 'GET'
                } ).then( function ( data )
                {
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
                console.log(orderId);
                console.log(tabId);
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
                        $('#orderDetailsWrapper').html(addRightTabContentOrderHandler($(data.html)));
                        
                        MAIN.curTabRightId = 'or' + tabId;
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
                    $('#orderTableWrapper').html(addRightTabContentTableHandler($(data.html)));
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

        // product section
        product: {

        },

        // order section
        order: {
            createNewOrder: function (productId) {
                $.ajax({
                    url: URL_ORDER + 'createNewOrder',
                    method: 'POST',
                    data: {
                        productId: productId
                    }
                }).then(function (data)
                {
                    if (false !== data) {
                        window.location.href = LOCATION;
                    }
                });
            },
            
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

            changeQuantity: function (obj) {
                $.ajax( {
                    url   : URL_ORDER + 'changeQuantity',
                    method: 'POST',
                    data: obj
                } ).then( function ( data ) {

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
                $.ajax({
                    url: URL_KIM + 'getKIMTable',
                    method: 'GET'
                }).then(function (data)
                {
                    MAIN.kimTableContent = data.kimTableContent;
                    $('#tbodyKIM').html(addKimTableHandler($(data.html)));
                });
            },
            
            getKimList: function () {
                $.ajax({
                    url: URL_KIM + 'getKimList',
                    method: 'GET',
                    data: {
                        prId: MAIN.productId
                    }
                }).then(function (data) {
                    $('.listOfKim').html(data);
                    var kim = $('.listOfKim option:selected').attr('kim');
                    $('[data-cell="KIM1"]').val(kim);
                    $('#calx').calx();
                });
            },
            
            addKIMtoTable: function (kim, kimHard) {
                $.ajax({
                    url: URL_KIM + 'addKIMtoTable',
                    method: 'POST',
                    data: {
                        kim: kim,
                        kimHard: kimHard
                    }
                }).then(function (data)
                {
                    if (true === data) {
                        $('#kimInput, #kimHardInput').val('');
                        KIM.getKIMTable();
                        KIM.getKimList();
                    } else {

                    }
                });
            },
            
            editKim: function (kimId, kim, kimHard, save) {
                var self = this;
                $.ajax( {
                    url   : URL_KIM + 'editKim',
                    method: 'POST',
                    data: {
                        kimId: kimId,
                        kim: kim,
                        kimHard : kimHard
                    }
                } ).then( function ( data )
                {
                    if (true === data) {
                        KIM.getKIMTable();
                        KIM.getKimList();
                    } else {
                        $(save )
                            .parents('tr')
                            .find('.kimHardName, .kimName')
                            .css({
                                'border': '3px solid hsl(0, 69%, 22%)',
                                'border-radius': '2px'
                            });
                    }
                });
            },
            
            removeKim: function (kimId) {
                $.ajax({
                    url   : URL_KIM + 'removeKim',
                    method: 'POST',
                    data: {
                    kimId: kimId
                    }
                }).then(function (data)
                {
                    console.log(data);
                    if (true === data) {
                        KIM.getKIMTable();
                        KIM.getKimList();
                    }
                });
            },
                        
            validation: function (val) {
                var res;
                res = val.replace(/[A-Za-z]+/g, '').replace(/,/g, '.');
                return res;
            }
        },
        
        // metalls section        
        metalls: {
            getMetallsTable: function() {
                var self = this;
                $.ajax({
                    url: URL_METALLS + 'getMetallsTable',
                    method: 'GET'
                }).then(function (data){
                     $('#tbodyMetalls').html(addMetallsTableHandler($(data)));
                }); 
            },
            
            editMetall: function (obj, scope) {
                $.ajax({
                    url: URL_METALLS + 'editMetall',
                    method: 'POST',
                    data: obj
                }).then(function (data)
                {
                    if (true === data) {
                        METALLS.getMetallsTable();
                        METALLS.getMetallsList();
                    } else {
                        $(scope)
                                .parents('tr')
                                .find('.metallName, .metallPrice, .metallMass, .metallOutPrice')
                                .css({
                                    'border': '3px solid hsl(0, 69%, 22%)',
                                    'border-radius': '2px'
                                });
                    }
                });
            },
            
            getMetallsList: function () {
                $.ajax({
                    url: URL_METALLS + 'getMetallsList',
                    method: 'GET',
                    data: {
                        prId: MAIN.productId
                    }
                }).then(function (data) {
                    $('.listOfMetalls').html(data);
                    var metall = $('.listOfMetalls option:selected').attr('metall');
                    var metallOut = $('.listOfMetalls option:selected').attr('metallOut');
                    $('[data-cell="PR1"]').val(metall);
                    $('[data-cell="PR2"]').val(metallOut);
                    $('#calx').calx();
                });
            },
            
            addMetallToTable: function (dates) {
                $.ajax( {
                    url   : URL_METALLS + 'addMetallToTable',
                    method: 'POST',
                    data: dates
                } ).then( function ( data )
                {
                    if (true === data) {
                        $('#metallName, #metallPrice, #metallMass, #metallOutPrice').val('');
                        METALLS.getMetallsTable();
                        METALLS.getMetallsList();
                    }
                });
            },
            
            removeMetall: function(metallId) {
                $.ajax( {
                    url   : URL_METALLS + 'removeMetall',
                    method: 'POST',
                    data: {
                        metallId: metallId
                    }
                } ).then( function ( data )
                {
                    console.log(data);
                    if (true === data) {
                        METALLS.getMetallsTable();
                        METALLS.getMetallsList();
                    }
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
        
        $.fn.hasAttr = function(name) {
            return this.attr(name) !== undefined;
        };
        
        self.run();
        
    };
    
    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    Dima.init.prototype = Dima.prototype;
    
    // attach our Dima to the global object, and provide a shorthand '$G' for ease our poor fingers
    global.Dima = global.D$ = Dima;
    
}(window, jQuery));