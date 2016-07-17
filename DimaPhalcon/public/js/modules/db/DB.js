define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'knockout'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, ko) {var
    topIcons = {
		kimIconsToDefault: function (arr = ['#editKimIcon', '#deleteKimIcon']) {
            $jq.kimIcons.find(arr.join(',')).removeClass('activeTopIcon');
            $(`#outBodyElements ${MAIN.focusedElem.attr('data-focused-table')} table tbody`)
                .removeClass('selectedRow deleteRow').off('click')
                .find('tr').off('click');
        },
        actionConstructor: function (cssClass, callback) {
            var $table = $(`#outBodyElements ${MAIN.focusedElem.attr('data-focused-table')} table tbody`);
            if ($(this).hasClass('activeTopIcon')) {
                $table.find('tr').off('click');
                methods.activateButton.call(this);
                $table.removeClass(cssClass);
                return true;
            }
            $table.find('tr').on('click', callback);
            methods.deactivateButton.call(this);
            $table.addClass(cssClass);
        },
        deleteCallback: function () {
            var $this = $(this),
                $table = $this.closest('table');
            $('#deleteKIMGroupModal')
                .find('.whatDeleteTitle').html($table.attr('data-name')).end()
                .find('.whatDeleteElement').html($this.text().trim()).end()
                .find('.deleteBtnModal').hide().end()
                .find($table.attr('data-delete-action')).attr('data-id', $this.attr('data-id')).show().end()
                .modal('show');
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

            $jq.addKimIcon.click(function () {
                topIcons.kimIconsToDefault();
            });

            $jq.editKimIcon.click(function () {
                topIcons.kimIconsToDefault(['#deleteKimIcon']);
                topIcons.actionConstructor.call(this, 'selectedRow', function () { $(this).dblclick(); });
            });

            $jq.deleteKimIcon.click(function () {
                topIcons.kimIconsToDefault(['#editKimIcon']);
                topIcons.actionConstructor.call(this, 'deleteRow', topIcons.deleteCallback);
            });

			$jq.backKimIcon.click(function () {
				topIcons.kimIconsToDefault();
				methods.unfocus();
			});
            $('#addNewCategoryModal, #addNewKimModal, #addNewMetallModal').on('show.bs.modal', function () {
                $(this).find('.modalFooterAdd').show().end()
                    .find('.modalFooterEdit').hide().end()
                    .find('input').val('');
            });
		}
    };

    return DB;
});