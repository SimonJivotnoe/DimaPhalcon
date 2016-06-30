define(['jq', 'datatables.net'], function ($jq, DataTable) {
	var methods = {
		MESSAGES: {
			show: function (response) {
				var type = 'success';
				if (false === response.success) {
					type = 'error';
				}
				methods.MESSAGES[type](response.msg);
			},
			success: function (text) {
				var text = text ? text : '�������';
				noty({
					text: text,
					type: 'success',
					layout: 'center',
					timeout: 600
				});
			},
			error: function (text) {
				var text = text ? text : '���������';
				noty({
					text: text,
					type: 'error',
					layout: 'center',
					timeout: 600
				});
			}
		},
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
		
		toggleMainButtons: function ($hide, $show) {
			$hide.hide('scale');
			setTimeout(function () {$show.show('clip'); }, 350);
		},
		activateButton: function () { $(this).addClass('hvr-pulse-grow').removeClass('activeTopIcon'); },
		deactivateButton: function () { $(this).removeClass('hvr-pulse-grow').addClass('activeTopIcon'); },
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
		$jq.layout.width(0).height(0).hide();
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

		cancelArticleBtn: function () {
			$('#createArticle').show();
			$('#cancelArticleBtn, #errorArticle' ).hide();
			$.each($('.checkToArticle'), function(key, val){
				if($(val).prop('checked')) {
					$(this).click();
				};
			});
			$('.checkToArticle, #saveArticle').hide();
			$('#productArticle' ).html('');
		},

		excel: function (id = '#newProductTableCalc') { $(id).calx(); }
	};
	
	return methods;
});