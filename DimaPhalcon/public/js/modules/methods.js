define(['jq', 'datatables.net'/*, 'PRODUCT'*/], function ($jq, DataTable/*, PRODUCT*/) {
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
		},
		cases: {
			categories: {
				modal: $jq.addCategoryModal,
				table: $jq.categoriesTable,
				deleteText: 'Вы уверены, что хотите удалить Категорию?',
				confirmDelete: CATEGORIES.confirmDelete
			},
			kim: {
				modal: $jq.addKimModal,
				table: $jq.kimTable,
				deleteText: 'Вы уверены, что хотите удалить КИМ?',
				confirmDelete: KIM.confirmDelete
			},
			metalls: {
				modal: $jq.addMetallModal,
				table: $jq.metallTable,
				deleteText: 'Вы уверены, что хотите удалить Металл?',
				confirmDelete: METALLS.confirmDelete
			}
		},
		toggleMainButtons: function ($hide, $show) {
			$hide.hide('scale');
			setTimeout(function () {$show.show('clip'); }, 350);
		},
		activateButton: function () { $(this).addClass('hvr-pulse-grow').removeClass('activeTopIcon'); },
		deactivateButton: function () { $(this).removeClass('hvr-pulse-grow').addClass('activeTopIcon'); },
		kimIconsToDefault: function (arr) {
			var arr = arr ? arr : ['#editKimIcon', '#deleteKimIcon'];
			$jq.kimIcons.find(arr.join(',')).removeClass('activeTopIcon');
			methods.cases[MAIN.focusedElem.attr('data-elem')].table().removeClass('selectedRow deleteRow').off('click');
			methods.cases[MAIN.focusedElem.attr('data-elem')].table().find('tr').off('click');
		},
		blur: function ($section, off) {
		var start = 0,
				end = 4,
				opacity = 0.3;
				if (off) {
		start = 4;
				end = 0;
				opacity = 1;
		}
		$({blurRadius: start}).animate({blurRadius: end}, {
		duration: 500,
				easing: 'swing',
				step: function() {
				$section.css({
				"-webkit-filter": "blur(" + this.blurRadius + "px)",
						"filter": "blur(" + this.blurRadius + "px)"
				});
				}
		});
				$section.animate({opacity: opacity});
		},
		showLayout: function ($section) {
		$jq.layout
				.width($section.width())
				.height($section.height())
				.css({left: $section.offset().left})
				.show();
		},
		hideLayout: function () {
		$layout.width(0).height(0).hide();
		},
		setOutBodyElem: function () {
			var tableWrapper = MAIN.focusedElem.find('table').closest('div');
			$jq.outBodyElements
				.html(MAIN.focusedElem.clone())
				.offset(MAIN.focusedElem.offset())
				.width(MAIN.focusedElem.width())
				.height(MAIN.focusedElem.height())
				.find('table').closest('div')
				.scrollTop(tableWrapper.scrollTop())
				.width(tableWrapper.css('max-width'));
		},
		unsetOutBodyElem: function () {
			$jq.outBodyElements
				.html('')
				.offset({top: 0, left: 0})
				.width(0)
				.height(0);
		},
		
		focus: function (scrollable, buttons) {
			var $section = $('#sectionContent');
			var $buttons = buttons ? buttons : $jq.kimIcons;
			methods.blur($section);
			MAIN.focusedElem.addClass('parentFocused');
			methods.setOutBodyElem();
			if (scrollable && MAIN.scrollTables) {
				MAIN.scrollTables[scrollable + 'Copy'] = methods.addDataTable($jq.outBodyElements.find('table'));
				$jq.outBodyElements.find('.dataTables_scrollBody').scrollTop(MAIN.scrollTables.scrollTop);
			}
			methods.toggleMainButtons($jq.mainIcons, $buttons);
			MAIN.previousThColor = MAIN.focusedElem.find('th').css('color');
			MAIN.previousTdColor = MAIN.focusedElem.find('td').css('color');
			MAIN.focusedElem.find('td, th').css({color: $('body').css('backgroundColor')});
			methods.showLayout($section);
		},
		unfocus: function (buttons) {
		var $section = $('#sectionContent');
				var $buttons = buttons ? buttons : $('#kimIcons');
				var scrollTable = focusedElem.find('table').attr('data-scroll');
				methods.blur($section, true);
				scrollTables.scrollTop = $outBodyElements.find('.dataTables_scrollBody').scrollTop();
				methods.unsetOutBodyElem();
				methods.hideLayout();
				focusedElem
				.removeClass('parentFocused')
				.find('th').css('color', previousThColor).end()
				.find('td').css('color', previousTdColor);
				if (MAIN.scrollTables[scrollTable]) {
		MAIN.scrollTables[scrollTable].destroy();
		}
		MAIN.scrollTables[scrollTable] = methods.addDataTable(focusedElem.find('table'));
				focusedElem.find('.dataTables_scrollBody').scrollTop(scrollTables.scrollTop);
				$('#outBodyElements').html('');
				methods.toggleMainButtons($buttons, $('#mainIcons'));
		},
		launchAddNewModal: function () {
			methods.cases[MAIN.focusedElem.attr('data-elem')].modal
				.find('.modalFooterAdd').show().end()
				.find('.modalFooterEdit').hide().end()
				.find('input').val('').end()
				.modal('show');
		},
		editKim: function () {
			var $table = methods.cases[MAIN.focusedElem.attr('data-elem')].table();
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
			var $table = methods.cases[MAIN.focusedElem.attr('data-elem')].table();
			if ($(this).hasClass('activeTopIcon')) {
				$table.find('tr').off('click');
				methods.activateButton.call(this);
				$table.removeClass('deleteRow');
			} else {
				var $this = $(this);
				methods.deactivateButton.call(this);
				$table.addClass('deleteRow');
				$table.find('tr').on('click', function () {
					noty({
						text: 'Вы уверены, что хотите удалить Категорию?',
						modal: true,
						type: 'confirm',
						layout: 'center',
						animation: { open: 'animated flipInX', close: 'animated flipOutX' },
						buttons: [
							{addClass: 'btn btn-success', text: 'Удалить!', onClick: function ($noty) { methods.cases[MAIN.focusedElem.attr('data-elem')].confirmDelete($this, $noty); }},
							{addClass: 'btn btn-danger', text: 'Передумал', onClick: function ($noty) { $noty.close(); }}
						]
					});
				});
			}
		}
	};
	
	return methods;
});