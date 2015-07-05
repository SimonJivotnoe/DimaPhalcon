$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};

var tabs = {
    curTabId : '',
    productId : '',
    curTabName : '',
    addTab : function (id) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/addNewTab/' + id,
            method: 'POST'
        } ).then( function ( data )
        {console.log(data);
            window.location.href = 'http://DimaPhalcon/DimaPhalcon/';
        } );
    },
    changeActiveTab : function (id, tabId) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/changeActiveTab' ,
            method: 'POST',
            data: {'id': id, 'tabId': tabId}
        } )
    },
    changeTabName : function (prId, prName, categoryId) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/tabs/changeTabName',
            method: 'POST',
            data: {'prId': prId, 'prName' : prName, 'categoryId' : categoryId}
        } ).then( function ( data )
        {
            console.log(data);
        })
    }
};

var product = {
    self : this,
    sortable : '#sortable',
    alw : '#alwaysInTable',
    createTable : function(prId, tableContent, alwaysInTable) {
        $.ajax( {
            url   : 'http://DimaPhalcon/DimaPhalcon/products/createTable',
            method: 'POST',
            data: {'prId' : prId, 'tableContent' : JSON.stringify(tableContent), 'alwaysInTable' : JSON.stringify(alwaysInTable)}
        } ).then( function ( data )
        {
            $('#sortable' ).html(data[0]);
            $('#alwaysInTable' ).html(data[1]);
            $('.removeRow' ).hide();
        })
    },
    getTableContent : function (dom) {
        var tableContent = [];
        var i = 0;
        $.each($(dom), function(key, val) {
            var temp = new RowTemplate();
            if ('' === $('.rowNumber', val ).text()) {

            } else {
                temp.temp['%ROW_NUMBER%'] = $('.rowNumber', val ).text();
                temp.temp['%ROW_NAME%'] = $('.rowNameInput', val ).val();
                temp.temp['%DATA_CELL%'] = $('.rowValueInput', val ).attr('data-cell');
                temp.temp['%DATA_FORMULA%'] = $('.rowValueInput', val ).attr('data-formula');
                temp.temp['%INPUT_VALUE%'] = $('.rowValueInput', val ).val();
                tableContent[i] = temp.temp;
                i++;
            }

        });
        return tableContent;
    },
    saveTable : function (prId) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/products/changeTableContent',
        method: 'POST',
        data: {
            'prId' : prId,
            'tableContent' : JSON.stringify(this.getTableContent(this.sortable + ' li')),
            'alwaysInTable' : JSON.stringify(this.getTableContent(this.alw + ' li'))
        }
    } ).then( function ( data )
    {
        console.log(data);
    })
}
}

function RowTemplate() {
    this.temp = {
        "%ROW_NUMBER%": "",
        "%ROW_NAME%": "",
        "%DATA_CELL%": "",
        "%DATA_FORMULA%": "",
        "%INPUT_VALUE%": ""
    }
}

function showPreferences(){
    $('#preferences, #preferences1').addClass('active');
    $('.bg-danger' ).fadeOut(10);
    $('#addCategoryInput' ).val('');
    getCategoriesList();
    $('body' ).fadeIn(350);
}

function catchKey(el, mathAction, step) {
    var thisVal = Number($( el ).val());
    if ('+' === mathAction) {
        $(el ).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
    } else {
        $(el ).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
    }
    $( '#calx' ).calx();
    product.saveTable(tabs.productId);
}
function checkActiveStatusOnDelete(deleteTabID) {
    var isActive = $('#' + deleteTabID).hasClass('active');
    if (isActive) {
       var nextActive = $('.active').next();
        if (nextActive.find('a').hasAttr('aria-controls')) {
            removeTabFromDOM(deleteTabID);
            return correctReturnOnCloseTab(nextActive);
        } else {console.log('prev');
            var prevActive = $('.active').prev();console.log(prevActive.find('a').hasAttr('aria-controls'));
            if (prevActive.find('a').hasAttr('aria-controls')) {
                removeTabFromDOM(deleteTabID);console.log(prevActive.find('a' ).attr('aria-controls'));
                return correctReturnOnCloseTab(prevActive);
            } else {
                removeTabFromDOM(deleteTabID);
                return 'preferences1';
            }
        }
    } else {
        removeTabFromDOM(deleteTabID);
        if ($('.currentTab').hasClass('active')) {
            return $('.currentTab').attr('id');
        } else {
            return 'preferences1';
        }
    }
}

function cancelInputFotmula() {
    $('#addFormulaInputPr' ).css('border-color', '' ).val('');
    $('#addFormulaInputPr, .rowNumber').off('click');
    $('body').off('keypress');
    $('body').off('click', '.rowNumber');
    $('body').css('cursor', 'auto');
    $(document).keydown(function (e) {
        if (e.which === 8) {
            return true;
        }
    });
    $('#formulasHelper' ).hide('slide');
}

function removeTabFromDOM(id) {
    $('[aria-controls=' + id + ']' ).removeAttr( 'role' );
    $('[aria-controls=' + id + ']').hide('highlight');
    $('[aria-controls=' + id + ']' ).removeAttr( 'aria-controls' ).removeAttr( 'role' );
    setTimeout(function() {
        $('[aria-controls=' + id + ']' ).parent().remove();
    }, 700);
    return true;
}

function addWhereCaret(caretPos, what) {console.log(caretPos);
    var currentVal =  $('#addFormulaInputPr').val();
    $('#addFormulaInputPr').val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
}

function caretPositionInFormulaInput() {
    var caret = 0;
    return function() {
        caret = document.getElementById('addFormulaInputPr').selectionStart;
        return caret;
    };    
}

function caretAfterBlur() {
    var caret = 0;
    return function(position) {
        if ('' !== position) {
            caret = position;
            return caret;
        } else {
            console.log(caret);
        }       
    };  
    
}

function correctReturnOnCloseTab(tab) {
    if (undefined === tab.find('a' ).attr('aria-controls')) {
        return 'preferences1';
    } else {
    return tab.find('a' ).attr('aria-controls');
    }
}

function removeChar(string, index){
    var res = '';
    for (var i in string) {
      (index !== Number(i)) ? res = res + string[i] : 1;        
    }
  
 return res;
}