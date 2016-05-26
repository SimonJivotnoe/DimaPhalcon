define(['jq', 'datatables.net'], function ($jq, DataTable) {
	var methods = {
        startWaitAnimation: function () { $jq.body.addClass('loading'); },
        stopWaitAnimation: function () { $jq.body.removeClass('loading'); },
        showBody: function() {
            //PREFERENCES.applyCss();
            if ($jq.body.is(":visible")) {return false;}
            $jq.body.fadeIn(350);
            return true;
        },
		
		checkCrollInTable: function (table) {
			if (!MAIN.scrollTables) {
				MAIN.scrollTables = {};
			}
			if (MAIN.scrollTables[table]) {
				MAIN.scrollTables[table].destroy();
			}
		},
		
		addDataTable: function (elem) {
			return elem.DataTable({
				destroy: true,
				scrollY: '148px',
				searching: false,
				scrollCollapse: true,
				scroller: true,
				paging: false,
				ordering: false,
				info: false
			});
		}
    };
	
	return methods;
});