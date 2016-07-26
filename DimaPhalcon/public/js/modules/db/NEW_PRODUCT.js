define(['jq', 'methods', 'URLs', 'mustache', 'PRODUCT', 'VALIDATION', 'TREE'], function ($jq, methods, URLs, Mustache, PRODUCT, VALIDATION, TREE) {var
    clearNewProductModal = function () {
		$jq.productNameInput.val('');
	},
	changeKimList = function () {
        var kim = $('option:selected', this ).attr('data-val');
        $('#addNewProductModal [data-cell="KIM1"]' ).val(kim);
        methods.excel();
    },
    changeMetallList = function () {
        var metallList = $jq.addNewProductModal.find('.metallsList option:selected');
        $('#addNewProductModal [data-cell="PR1"]').val(metallList.attr('data-price'));
        $('#addNewProductModal [data-cell="PR2"]').val(metallList.attr('data-outprice'));
        methods.excel();
    },
	changeFileInput = function () {
		if(!window.File || !window.FileReader || !window.FileList || !window.Blob){
			window.alert("Can't upload! Your browser does not support File API!");
			return;
		}

		var fileReader = new FileReader();
		var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
		if (this.files.length == 0) {
			window.alert('Нужно выбрать файл');
			return;
		}
		var file = this.files[0];
		var size = file.size;
		var type = file.type;

		if (!filter.test(type)) {
			window.alert('Формат файла не поддерживается');
			return;
		}

		var max = 2000000;
		if (size > max) {
			window.alert('Файл больше чем 2 MB');
			return;
		}

		$('.upload-image').show();
		fileReader.onload = imageIsLoaded;
		fileReader.readAsDataURL(this.files[0]);
		function imageIsLoaded(e) {
			$('#productImgWrapper').html(`<img id="productImg" height="250px" src="${e.target.result}" alt="your image" />`);
		};

		MAIN.formData = new FormData();
		MAIN.formData.append('image_data', file);
	},
    addNewRow = function () {
        var existingRows = [],
            max = 1;
        methods.cancelArticleBtn();
        $.map($('#sortable .rowNumber'), function (rowNumber) {
            if ('' !== $(rowNumber).text()) {
                existingRows.push(parseInt($(rowNumber).text().substring(1)));
            }
        });
        if (0 !== existingRows.length) {
            max = Math.max.apply(Math, existingRows);
        }
        $jq.productTableRows.append(Mustache.render($jq.productTableRowTemplate.html(), { rowNumber: 'A' + (max + 1) }));
    },
	article = {
        checkToArticle: function () {
            var $this = $(this),
                val = $this.closest('li' ).find('.rowValueInput' ).val(),
                cell = $this.closest('li' ).find('.rowNumber' ).text(),
                appendSpan;
            if ($this.prop('checked') && val) {
                appendSpan = $(`<span articlepart="${cell}" style="display: none;">
                                ${VALIDATION.validateInputVal({val: val, digitsOnly: true})}</span>`);
                $jq.productArticle.append(appendSpan);
                appendSpan.show('slow');
                return true;
            }
            $.each($jq.productArticle.find('span'), function() {
                var $this = $(this);
                if (cell === $this.attr('articlepart')) {
                    $this.slideUp();
                    setTimeout(function(){ $this.remove(); }, 400);
                }
            });
        },
        createArticle: function () {
            var check = 0,
                rowValueInput,
                categoryArticle = $('.categoriesList option:selected').attr('data-article'),
                metallArticle = $('.metallsList option:selected').attr('data-article');
            $jq.productArticle.html(categoryArticle + metallArticle);
            $.map($('.checkToArticle'), function(row){
                var $row = $(row);
                rowValueInput = $row.closest('li').find('.rowValueInput');
                if(rowValueInput.val()) {
                    check++;
                    $row.show();
                    $row.closest('li').find('.removeRow').hide();
                }
            });
            if (!check) {
                methods.MESSAGES.error('Заполните поля таблицы продукта!');
            }
            $('#saveArticle, #cancelArticleBtn').show();
            $(this).hide();
        },
        cancelArticleBtn: function () {
            $jq.createArticle.show();
            $('#cancelArticleBtn, #errorArticle' ).hide();
            $.each($('.checkToArticle'), function(){
                var $this = $(this);
                if($this.prop('checked')) {
                    $this.click();
                };
                $this.closest('li').find('.removeRow').show();
            });
            $('.checkToArticle, #saveArticle').hide();
            $jq.productArticle.html('');
        },
    },

    rowValueInputMousewheel = function (e) {
        var mathAction = '-';
        if (1 === e.deltaY) {
            mathAction = '+';
        }
        formulas.catchKey(this, mathAction, 0.01);
        methods.excel();
    },
    // change value in product table by keys
    rowValueInputKeydown = function (e) {
        e.stopPropagation();
        switch (e.keyCode) {
            case 38: // UP
                formulas.catchKey(this, '+', 1);
                e.preventDefault();
                break;
            case 40: // DOWN
                formulas.catchKey(this, '-', 1);
                e.preventDefault();
                break;
            case 191: // /
                formulas.catchKey(this, '+', 10);
                e.preventDefault();
                break;
            case 17: // Ctrl
                formulas.catchKey(this, '-', 10);
                e.preventDefault();
                break;
            case 190: // >
                formulas.catchKey(this, '+', 100);
                e.preventDefault();
                break;
            case 18: // Alt
                formulas.catchKey(this, '-', 100);
                e.preventDefault();
                break;
            case 32: // Space
                e.preventDefault();
                break;
        }
    },
    rowValueInputKeyup = function (e) {
        e.stopPropagation();
        var notToReact = [17, 18, 32, 37, 38, 39, 40, 110, 188, 190, 191],
            text = $(this).val(),
            caretPos;
        if (text.indexOf(',') !== -1) {
            text = text.replace(',', '.');
            $(this).val(text);
        }
        $(this).attr('value', text);
        if (-1 === $.inArray(e.keyCode, notToReact)) {
            caretPos = this.selectionStart;
            if (96 === e.keyCode && '.' === text.charAt((text.length - 2))) {

            } else {
                methods.excel();
                text = '' + $(this).val();
                $(this).caret(caretPos);
                if ('.' === text.charAt((text.length - 2))) {
                    $(this).caret((text.length - 1));
                }
            }
        }
    },
    removeRow = function () {
        var $this = $(this);
        $this.parent()
            .find('.rowNumber').text('').end()
            .find('.rowValueInput').attr('data-cell', '').end()
            .hide('drop');
        setTimeout(function () { $this.parent().remove(); }, 500);
    },
    formulas = {
        catchKey: function (el, mathAction, step) {
            var thisVal = Number($(el).val());
            if ('+' === mathAction) {
                $(el).val((thisVal + step).toFixed(2)).attr('value', (thisVal + step).toFixed(2));
            } else {
                $(el).val((thisVal - step).toFixed(2)).attr('value', (thisVal - step).toFixed(2));
            }
            methods.excel();
        }, 
        removeChar: function (string, index) {
            var res = '';
            for (var i in string) {
                if (index !== Number(i)) {
                    res = res + string[i];
                }
            }
    
            return res;
        },
        addWhereCaret: function(caretPos, what) {
            var currentVal =  $jq.addFormulaInputPr.val();
            $jq.addFormulaInputPr.val(currentVal.substring(0, caretPos) + what + currentVal.substring(caretPos) );
        },
        toggleAddFormula: function() {
            '' !== $jq.addFormulaInputPr.val() ? $jq.addFormulaBtnPr.slideDown() : $jq.addFormulaBtnPr.slideUp();
        },
        startCreateNewFormula: function () {
            localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
            $('#addNewFhBtnInput').val('');
            if (!MAIN.clickOnFormulaInput) {
                MAIN.clickOnFormulaInput = true;
                $('body').css('cursor', 'pointer');
    
                $jq.addFormulaInputPr.css('border-color', 'rgba(82, 168, 236, 0.8)');
                $jq.formulasHelper.show('scale');
                $('#addFormulaBtnPr').hide();
                $('.formulaBtnGroupPr').show('drop');
    
                $('.removeFhBtn').hide();
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
        addNewFormula: function(){
            var formula = $jq.addFormulaInputPr.val();
            if ('' !== formula) {
                formula = formula.replace(/,/, '.');
                $jq.formulasList.find('tbody').append(Mustache.render($jq.formulaTemplate.html(), {
                    formula: formula,
                    beautyFormula: formulas.beautifyFormula(formula)
                    //availableCellList: addAvailableCellList()
                }));
                /*$('.removeFormula').hide();
                $('.editFormula').hide();*/
                formulas.cancelInputFormula();
                $jq.addFormulaInputPr.val('');
               // PRODUCT.formulas.addNewFormula(PRODUCT.getFormulasList, true);
            }
        },
        cancelInputFormula: function() {
            MAIN.clickOnFormulaInput = false;
            $jq.addFormulaInputPr.css('border-color', '' ).val('');
            $jq.formulaBtnGroupPr.hide('drop');
    
            $('body').css('cursor', 'auto');
            $(document).keydown(function (e) {
                if (e.which === 8) {
                    return true;
                }
            });
            $jq.formulasHelper.hide('slide');
        },
        applyFormula: function () {
            var $this = $(this),
                formula = $this.attr('data-formula'),
                isChecked = $this.prop('checked'),
                S1 = $jq.addNewProductModal.find('[data-cell="S1"]');
            if (!isChecked) {
                formula = '';
                S1.val('');
                $this.removeClass('appliedFormula');
            } else {
                $('.applyFormula').removeClass('appliedFormula');
                $this.addClass('appliedFormula');
                $('#formulasList .applyFormula').not('.appliedFormula').prop('checked', false);
            }
            S1.attr('data-formula', formula);
            if (!methods.excel()) {
                $this.prop('checked', false);
                S1.attr('data-formula', '');
            }
        },
        editFormula: function () {
            var $this = $(this),
                formula = $this.attr('data-formula');
            $this.closest('tr' ).find('.removeFormula' ).click();
            $('#addFormulaInputPr' ).click().val(formula);
            formulas.toggleAddFormula();
        },
        removeFormula: function () {
            var $tr = $(this).closest('tr'),
                checked = $tr.closest('tr').find('.applyFormula').prop('checked');
            if (checked) {
                $tr.closest('tr').find('.applyFormula').click();
            }
            $tr.remove();
        },
        removeFormulasHelper: function (id) {
            return $.ajax( {
                url   : URLs.removeBtnFromFormulasHelper + '/' + id,
                method: 'DELETE'
            });
        },
        addElementToFormulaInput: function() {
            var $this = $(this),
                element = $this.attr('data-element');
            formulas.addWhereCaret(localStorage.currentCaretPos, element);
            localStorage.currentCaretPos = parseInt(localStorage.currentCaretPos) + parseInt(element.length);
            formulas.toggleAddFormula();
        },
        removeFnBtn: function(e) {
            var $this = $(this);
            e.stopPropagation();
            e.preventDefault();
            formulas.removeFormulasHelper($this.attr('data-id')).then(function (response) {
                if (response.success) {
                    $this.parent().fadeOut('slow');
                }
            });
        },
        addNewFhBtn: function () {
            var formula = $jq.addNewFhBtnInput.val();
            $('body').css('cursor', 'pointer');
            $jq.addFormulaInputPr.click();
            formulas.addBtnToFormulasHelper(formula).then(function (response) {
                $(Mustache.render($jq.justCreatedFormula.html(), {
                    formula: formula,
                    id: response.data.id
                })).insertBefore('#addNewBtnSpan');
                $('.justCreated')
                    .find('.removeFhBtn').hide('fast').end()
                    .show('slow' ).removeClass('.justCreated');
                $jq.addNewFhBtnInput.val('');
            });
        },
        addBtnToFormulasHelper: function (newFl) {
            return $.ajax({
                url   : URLs.addBtnToFormulasHelper,
                method: 'POST',
                data: {'newFl': newFl}
            });
        },
    },
    saveProduct = {
        getData: function () {
            var data = {
                article: $jq.productArticle.text().trim().replace(/\s+/g, ''),
                productName: VALIDATION.validateInputVal({
                    val: $jq.productNameInput.val(),
                    id: '.productNameInput',
                }),
				image: ($('#productImg').attr('data-name')) ? $('#productImg').attr('data-name') : '',
                category: $jq.addNewProductModal.find('.categoriesList option:selected').attr('data-id'),
                kim: $jq.addNewProductModal.find('.kimList option:selected').attr('data-id'),
                metall: $jq.addNewProductModal.find('.metallsList option:selected').attr('data-id'),
				tableContent: saveProduct.getTableContent('#sortable li'),
				alwaysInTable: saveProduct.getTableContent('#alwaysInTable li'),
                formulas: saveProduct.getFormulasList()
            };
            return data;
        },
        getFormulasList: function () {
            var res = [];
            $.map($('.applyFormula'), function (toggle) {
                var $toggle = $(toggle),
                    row = {
                        formula: $toggle.attr('data-formula')
                    }
                if ($toggle.hasClass('appliedFormula')) {
                    row.applied = true;
                }
                res.push(row);
            });
            return res;
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
        addNewProductBtn: function () {
            var data = saveProduct.getData();
            if (!data.article) {
                methods.MESSAGES.error('Создайте Артикул!');
            }
            if (!data.productName) {
                methods.MESSAGES.error('Создайте Имя Продукта!');
            }
            if (data.article && data.productName) {
                $.ajax({
                    url: URLs.saveProduct,
                    method: 'POST',
                    data: saveProduct.getData()
                }).then(function (response) {
					if (methods.checkResponseOnSuccess(response)) {
						TREE.getDBTree();
						$jq.addNewProductModal.modal('hide');
					}
                    if (response.data.id && MAIN.formData) {
                        $.ajax({
                            type: 'POST',
                            processData: false,
                            contentType: false,
                            url: URLs.uploadImage + '/' +response.data.id,
                            data: MAIN.formData,
                            dataType: 'json'
                        });
                    }
                });
            }
        }
    },
    copyProduct = function () {
        var $this = $(this),
            productId = $this.attr('data-product-id');
        if (productId && MAIN.productModel && MAIN.productModel[productId]) {
			var productModel = MAIN.productModel[productId],
				appliedFormula = '';	
			$jq.addNewProductModal
				.find('.productNameInput').val(productModel.productName).end()
				.find(`.categoriesList [data-id="${productModel.categoryId}"]`).prop('selected', true).end()
				.find(`.kimList [data-id="${productModel.kimId}"]`).prop('selected', true).end()
				.find(`.metallsList [data-id="${productModel.metallId}"]`).prop('selected', true).end()
				.find('#productImgWrapper').html(`<img id="productImg" data-name="${productModel.image}" height="250px" src="img/${productModel.productImage}">`).end()
				.find('#sortable').html(
					$.map(productModel.tableContent, function (row) {
						return Mustache.render($jq.productTableRowTemplate.html(), row)
					})
				).end()
				.find('#formulasList').html(
					$.map(productModel.formulas, function (tr) {
						tr.beautyFormula = formulas.beautifyFormula(tr.formula);
						if (tr.applied) { appliedFormula = tr.formula }
						return Mustache.render($jq.formulaTemplate.html(), tr);
					})
				);
			$('#formulasList').find(`input[data-formula="${appliedFormula}"]`).click();
			$('#cancelArticleBtn').click();
			$('#sortable li:eq(0)').find('.removeRow').remove();
			MAIN.formData = false;
			$jq.addNewProductIcon.click();	
        }
    },

    NEW_PRODUCT = {
        getFormulasHelper: function () {
            $.get(URLs.getFormulasHelper, function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					$(Mustache.render($jq.formulasHelperTemplate.html(), response)).insertBefore('#addNewBtnSpan');
				}
            });
        },
		handler: function () {
			$jq.clearNewProductModal.click(clearNewProductModal);
			$jq.kimList.change(changeKimList);
			$jq.metallsList.change(changeMetallList);
			
			$jq.uploadImageProduct.click(function () {
				$('#input-file-upload').trigger('click');
			});
			$('#input-file-upload').change(changeFileInput);
			$jq.addNewRow.click(addNewRow);

			$jq.productTableWrapper
				.on('mousewheel', '.rowValueInput', rowValueInputMousewheel)
				.on('keydown', '.rowValueInput', rowValueInputKeydown)
				.on('keyup', '.rowValueInput', rowValueInputKeyup)
				.on('click', '.removeRow', removeRow)
				.on('change', '.checkToArticle', article.checkToArticle);

			$jq.createArticle.click(article.createArticle);
			$jq.cancelArticleBtn.click(article.cancelArticleBtn);

			// create formula
			$jq.addFormulaInputPr
				.click(formulas.startCreateNewFormula)
				.keydown(function(e){
					if (32 === e.keyCode) {
						return false;
					}
				});
			// add new formula
			$jq.addFormulaBtnPr.click(formulas.addNewFormula);
			$jq.cancelFormulaBtnPr.click(formulas.cancelInputFormula);
			$jq.addNewProductModal
				.keydown(function (e) {
					if (MAIN.clickOnFormulaInput) {
						if (e.keyCode === 8) {
							var currentVal = $jq.addFormulaInputPr.val();
							var ls = localStorage.currentCaretPos;
							currentVal = formulas.removeChar(currentVal, ls - 1);
							$jq.addFormulaInputPr.val(currentVal);
							localStorage.currentCaretPos--;
							e.preventDefault();
						}
					}
				})
				.keypress(function(e) {
					if (MAIN.clickOnFormulaInput) {
						if (!$jq.addFormulaInputPr.is(":focus")) {
							if (32 !== e.keyCode) {
								formulas.addWhereCaret(localStorage.currentCaretPos, String.fromCharCode(e.keyCode));
								localStorage.currentCaretPos++;
							}
						}
					}
				})
				.keyup(function() {
					if (MAIN.clickOnFormulaInput) {
						formulas.toggleAddFormula();
						localStorage.currentCaretPos = document.getElementById('addFormulaInputPr').selectionStart;
					}
				})
				.on('click', '.rowNumber', formulas.addElementToFormulaInput);
			$('#formulasList')
                .on('click', '.applyFormula', formulas.applyFormula)
				.on('click', '.editFormula', formulas.editFormula)
				.on('click', '.removeFormula', formulas.removeFormula)

			$jq.formulasHelper
				.on('click', '.fhBtn', formulas.addElementToFormulaInput)
				// show remove formulas helper
				.on('mouseover', '.fhBtn', function() {
					$( '.removeFhBtn', this).show('fast');
				})
				// hide remove formulas helper
				.on('mouseleave', '.fhBtn', function() {
					$( '.removeFhBtn', this).hide('fast');
				})
				.on('click', '.removeFhBtn', formulas.removeFnBtn);
			$jq.addNewFhBtnInput.click(function(){
				MAIN.clickOnFormulaInput = false;
				$('body').css('cursor', 'auto');
			});
			$jq.addNewFhBtn.click(formulas.addNewFhBtn);

			$jq.addNewProductBtn.click(saveProduct.addNewProductBtn);

            $jq.sectionContent.on('click', '.copyProduct', copyProduct);
		}
	}

    return NEW_PRODUCT;
});