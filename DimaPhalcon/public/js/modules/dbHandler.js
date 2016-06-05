define(['jq', 'methods', 'CATEGORIES', 'KIM', 'METALLS'], function ($jq, methods, CATEGORIES, KIM, METALLS) {
    var cases = {
        metalls: {
            modal: $jq.addMetallModal,
            table: $jq.metallTable,
            deleteText: 'Вы уверены, что хотите удалить Металл',
            confirmDelete: METALLS.confirmDelete
        },
        categories: {
            modal: $jq.addCategoryModal,
            table: $jq.categoriesTable,
            deleteText: 'Вы уверены, что хотите удалить Категорию',
            confirmDelete: CATEGORIES.confirmDelete
        },
        kim: {
            modal: $jq.addKimModal,
            table: $jq.kimTable,
            deleteText: 'Вы уверены, что хотите удалить КИМ',
            confirmDelete: KIM.confirmDelete
        }
    };
    var dbHandler = {
        kimIconsToDefault: function (arr) {
            var arr = arr ? arr : ['#editKimIcon', '#deleteKimIcon'];
            $jq.kimIcons.find(arr.join(',')).removeClass('activeTopIcon');
            cases[MAIN.focusedElem.attr('data-elem')].table().removeClass('selectedRow deleteRow').off('click');
            cases[MAIN.focusedElem.attr('data-elem')].table().find('tr').off('click');
        },
        launchAddNewModal: function () {
            cases[MAIN.focusedElem.attr('data-elem')].modal
                .find('.modalFooterAdd').show().end()
                .find('.modalFooterEdit').hide().end()
                .find('input').val('').end()
                .modal('show');
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
        },
        editKim: function () {
            var $table = cases[MAIN.focusedElem.attr('data-elem')].table();
            if ($(this).hasClass('activeTopIcon')) {
                $table.find('tr').off('click');
                methods.activateButton.call(this);
                $table.removeClass('selectedRow');
                return true;
            }
            $table.find('tr').on('click', function () { $(this).dblclick(); });
            methods.deactivateButton.call(this);
            $table.addClass('selectedRow');
        },
        deleteKim: function () {
            var $table = cases[MAIN.focusedElem.attr('data-elem')].table();
            if ($(this).hasClass('activeTopIcon')) {
                $table.find('tr').off('click');
                methods.activateButton.call(this);
                $table.removeClass('deleteRow');
            } else {
                methods.deactivateButton.call(this);
                $table.addClass('deleteRow');
                $table.find('tr').on('click', function () {
                    var $this = $(this);
                    noty({
                        text: `${cases[MAIN.focusedElem.attr('data-elem')].deleteText} ${$this.find('.nameForNoty' ).attr('data-name-noty')}?`,
                        modal: true,
                        type: 'confirm',
                        layout: 'center',
                        animation: { open: 'animated flipInX', close: 'animated flipOutX' },
                        buttons: [
                            {addClass: 'btn btn-success', text: 'Удалить!', onClick: function ($noty) { cases[MAIN.focusedElem.attr('data-elem')].confirmDelete($this, $noty); }},
                            {addClass: 'btn btn-danger', text: 'Передумал', onClick: function ($noty) { $noty.close(); }}
                        ]
                    });
                });
            }
        }
    };

    return dbHandler;
});