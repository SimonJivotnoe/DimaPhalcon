define(['jq', 'datatables.net'], function ($jq, DataTable) {
	var methods = {
		/**
		 * checks if response is an Object
		 * @param {object} response - ajax response
		 * return bool || object
		 */
		checkResponseOnObj: function (response) {
			var res = false;
			try {
				if (_.isObject(response)) {
					res = response;
				} else {
					res = JSON.parse(response);
				}
			} catch (e) {
				methods.MESSAGES.error('Server Error');
			}

			return res;
		},
		
		/**
		 * checks ajax response on success
		 * @param {object} response - ajax response
		 * @param {bool} onData - additional param if we expect also data from response
		 * return bool
		 */
		checkResponseOnSuccess: function (response, msg = true, onData = false) {
			if (methods.checkResponseOnObj(response)) {
				var res = false;
				if (response && true === response.success && (onData ? response.data : response)) {
					res = true;
				}
				if ((response && 0 === response.success) || (msg && response.msg)) {
					methods.MESSAGES.show(response);
				}
				return res;
			}
		},
		
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
			error: function (text, timeout = 600) {
				var text = text ? text : '���������';
				noty({
					text: text,
					type: 'error',
					layout: 'center',
					timeout: timeout
				});
			}
		},
        startWaitAnimation: function () { /*$jq.body.addClass('loading');*/ },
        stopWaitAnimation: function () { /*$jq.body.removeClass('loading');*/ },
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
		showLayout: function ($section, $layout = $jq.layout) {
			$layout
				.width($section.width())
				.height($section.height())
				.css({left: $section.offset().left})
				.show();
		},
		hideLayout: function ($layout = $jq.layout) {
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

		kimFocus: function () {
			MAIN.focusedElem = $(this);
			var scrollTable = MAIN.focusedElem.find('table').attr('data-scroll');
			MAIN.scrollTables.scrollTop = MAIN.focusedElem.find('.dataTables_scrollBody').scrollTop();
			if (MAIN.scrollTables[scrollTable]) {
				MAIN.scrollTables[scrollTable].destroy();
				MAIN.scrollTables[scrollTable] = false;
			}
			$jq.addKimIcon.attr('data-target', MAIN.focusedElem.attr('data-modal-add'));
			methods.focus(scrollTable);
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
		unfocus: function ($buttons = $('#kimIcons')) {
			var $section = $('#sectionContent');
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

		excel: function (id = '#newProductTableCalc') {
			try {
				$(id).calx();
				return true;
			} catch (e) {
				methods.MESSAGES.error('ОШИБКА! Зацикливание', 1500);
				return false;
			}

		},
		expandDivider: function (lsName = 'db-split', screeSize = 'maxScreenSize', component = '#db-left-component', divider = '#db-divider, #db-right-component') {
			localStorage[lsName] === MAIN[screeSize] ? localStorage[lsName] = MAIN.defaultScreenSize : localStorage[lsName] = MAIN[screeSize];
			$(component).css('width', localStorage[lsName]);
			$(divider).css('left', localStorage[lsName]);
		},
		toggleTreeDisplay: function (treeWrapper, button) {
			if ($(treeWrapper).hasClass('hiddenTree')) {
				$(treeWrapper).removeClass('hiddenTree');
				$(treeWrapper).show('highlight');
				$(button)
					.find('.hideClientsTree').show().end()
					.find('.showClientsTree').hide();
			} else {
				$(treeWrapper).addClass('hiddenTree');
				$(treeWrapper).hide('highlight');
				$(button)
					.find('.hideClientsTree').hide().end()
					.find('.showClientsTree').show();
			}
		},
		beautifyFormula: function (formula) {
            var constRules = {
                KIM1: '#388398',
                TAN: '#E817D7',
                SIN: '#17E828',
                RADIANS: '#E89117'
            },
                //operatorRules = ['+', '-', '*', '=', '(', ')'];
                operatorRules = ['+'];
            function escapeRegex(value) {
                return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
            }
            $.each(constRules, function (elem, color) {
                formula = formula.replace(new RegExp(elem,"g"), `<span style="color: ${color};">${elem}</span>`);
            });
            $.map(operatorRules, function (operator) {
                formula = formula.replace(new RegExp(escapeRegex(operator),"g"), ` <span class="plusBold">${operator}</span> `);
            });
            formula = formula.replace(/\*/g, `<span class="plusBold">*</span>`);
			formula = formula.replace(/(A\d+)/g, '<span class="Acolor">$1</span>');
            formula = formula.replace(/>([ ]*\d+\.?\d{0,3}[ ]*)</g, '><span class="likeNumber">$1</span><');
            return formula;
        },
		getTableContent: function (elem) {
            var tableContent = [],
                temp;
            $.map($(elem), function(row) {
                temp = {
                    rowNumber: $('.rowNumber', row ).text(),
                    rowNameInput: $('.rowNameInput', row ).val(),
                    rowValueInput: $('.rowValueInput', row ).val(),
                    dataCell: $('.rowValueInput', row ).attr('data-cell'),
                    dataFormula: $('.rowValueInput', row ).attr('data-formula')
                };
                tableContent.push(temp);
            });

            return tableContent;
        },
		getOrderMap: function () {
			var res = {};
			res.out = [];
			var name;
			$.each($('#orderTable tr'), function(key, val) {
				switch ($(val ).attr('class')) {
					case 'skip':
						break;
					case 'orderTableSectionName':
						name = $(val ).attr('name');
						res[name] = [];
						break;
					case 'orderTableSection orderRow':
						var productId = $(val ).attr('name' ),
							obj = {};
						$.each($('td', val), function(k, v) {
							if ('quantityInOrderTd' === $(v).attr('class')) {
								obj[productId] = $('input', v).val();
								res[name].push(obj);
							}
						});
						break;
					case 'withoutSectionRow orderRow':
						var productId = $(val ).attr('name' ),
							obj = {};
						$.each($('td', val), function(k, v) {
							if ('quantityInOrderTd' === $(v).attr('class')) {
								obj[productId] = $('input', v).val();
								res.out.push(obj);
							}
						});
						break;
					default:
						break;
				}
			});
			return res;
		},
		enableDisableButton: function  (id, button) {
			if (0 < id.size()) {
				if (button.prop('disabled')) {
					button.prop('disabled', false);
				}
			} else {
				button.prop('disabled', true);
			}
		},
		resizeGrip: function (elem = '#orderTable') {
			$(elem).colResizable({
				disable: true
			});
			$(elem).colResizable({
				liveDrag: true,
				gripInnerHtml: '<div class="grip"></div>', 
				draggingClass: 'dragging',
				postbackSafe: true
			});
		}
	};
	
	return methods;
});