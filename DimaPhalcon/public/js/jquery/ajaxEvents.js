function getTabs(param) {
    $.ajax( {
        url   : 'http://DimaPhalcon/DimaPhalcon/tabs/getTabsList/',
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