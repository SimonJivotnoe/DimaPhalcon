define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'knockout'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, ko) {var
    topIcons = {
		kimIconsToDefault: function (arr) {
            var arr = arr ? arr : ['#editKimIcon', '#deleteKimIcon'];
            $jq.kimIcons.find(arr.join(',')).removeClass('activeTopIcon');
            cases[MAIN.focusedElem.attr('data-elem')].table().removeClass('selectedRow deleteRow').off('click');
            cases[MAIN.focusedElem.attr('data-elem')].table().find('tr').off('click');
        },
		unfocus: function (buttons) {
            var $section = $('#sectionContent');
            var $buttons = buttons ? buttons : $('#kimIcons');
            var scrollTable = MAIN.focusedElem.find('table').attr('data-scroll');
            methods.blur($section, true);
            MAIN.scrollTables.scrollTop = $jq.outBodyElements.find('.dataTables_scrollBody').scrollTop();
            methods.unsetOutBodyElem();
            methods.hideLayout();
            MAIN.focusedElem
                .removeClass('parentFocused')
                .find('th').css('color', MAIN.previousThColor).end()
                .find('td').css('color', MAIN.previousTdColor);
            if (MAIN.scrollTables[scrollTable]) {
                MAIN.scrollTables[scrollTable].destroy();
            }
            MAIN.scrollTables[scrollTable] = methods.addDataTable(MAIN.focusedElem.find('table'));
            MAIN.focusedElem.find('.dataTables_scrollBody').scrollTop(MAIN.scrollTables.scrollTop);
            $('#outBodyElements').html('');
            methods.toggleMainButtons($buttons, $('#mainIcons'));
        }
	},
    DB = {
		handler: function () {
			$('#db-left-component').css('width', localStorage['db-split']);
			$('#db-divider, #db-right-component').css('left', localStorage['db-split']);
			$('#db-divider').on('mousemove', function(){
				localStorage['db-split'] = $('#db-divider').css('left');
			});
			$jq.databaseWrapper().splitPane();
			$jq.backKimIcon.click(function () {
				topIcons.kimIconsToDefault();
				topIcons.unfocus();
			});
		}
    };

    return DB;
});