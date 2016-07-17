define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION', 'calx'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	addMetall = function () {
		var metall = VALIDATION.validateInputVal({
			val: $jq.metallNameInput.val(),
			id: '#metallName',
			unique: true
		}),
		price =  VALIDATION.validateInputVal({
			val: $jq.metallPriceInput.val(),
			id: '#metallPrice',
			digitsOnly: true
		}),
		mass =  VALIDATION.validateInputVal({
			val: $jq.metallMassInput.val(),
			id: '#metallMass',
			digitsOnly: true
		}),
		outPrice =  VALIDATION.validateInputVal({
			val: $jq.metallOutPriceInput.val(),
			id: '#metallOutPrice',
			digitsOnly: true
		}),
		article = VALIDATION.validateInputVal({
			val: $jq.metallArticleInput.val(),
			id: '#metallArticle',
			unique: true
		});
		if (metall && price && mass && outPrice && article) {
			methods.cancelArticleBtn();
			$.ajax( {
				url   : URLs.addMetall,
				method: 'POST',
				data: {
					metall: metall,
					price: price,
					mass: mass,
					outPrice: outPrice,
					article: article
				}
			} ).then( function ( response )
			{
				if (methods.checkResponseOnSuccess(response)) {
					$jq.addMetallModal.find('input').val();
					$.when(METALLS.getMetalls()).then(function () {
						$jq.addMetallModal.modal('hide');
					});
				}
			});
		}
	},
	editMetall = function () {
		var id = MAIN.$selectedRow.attr('data-id' ),
			metallName = VALIDATION.validateInputVal({
				val: $jq.editMetallNameInput.val()
			}),
			metallPrice =  VALIDATION.validateInputVal({
				val: $jq.editMetallPriceInput.val(),
				digitsOnly: true
			}),
			metallMass =  VALIDATION.validateInputVal({
				val: $jq.editMetallMassInput.val(),
				digitsOnly: true
			}),
			metallOutPrice =  VALIDATION.validateInputVal({
				val: $jq.editMetallOutPriceInput.val(),
				digitsOnly: true
			});
		if (metallName && metallPrice && metallMass && metallOutPrice) {
			methods.cancelArticleBtn();
			$.ajax({
				url: URLs.editMetall,
				method: 'POST',
				data: {
					metallId: id,
					metallName: metallName,
					metallPrice: metallPrice,
					metallMass: metallMass,
					metallOutPrice: metallOutPrice
				}
			}).then(function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					$.when(METALLS.getMetalls()).then(function () {
						$jq.editKimIcon.click().click();
						$jq.editMetallModal.modal('hide');
					});
				}
				if (MAIN.isArticle && (id === MAIN.metallId)) {
					PRODUCT.getLeftTabContent(MAIN.productId, MAIN.curTabId);
				}
			});
		}
	},
	deleteMetall = function () {
		methods.cancelArticleBtn();
		$.ajax( {
			url   : URLs.removeMetall + '/' + $(this).attr('data-id'),
			method: 'DELETE'
		} ).then(function (response) {
			if (methods.checkResponseOnSuccess(response)) {
				$.when(METALLS.getMetalls()).then(function () {
					$jq.deleteKimIcon.click().click();
					$jq.deleteKIMGroupModal.modal('hide');
				});
			}
		});
	},
	prepareDataEditModal = function () {
		var $this = $(this),
			id = $this.attr('data-id');
		$jq.editMetallNameInput.val(MAIN.metallTableContent.data[id].name);
		$jq.editMetallPriceInput.val(MAIN.metallTableContent.data[id].price);
		$jq.editMetallMassInput.val(MAIN.metallTableContent.data[id].mass);
		$jq.editMetallOutPriceInput.val(MAIN.metallTableContent.data[id]['out_price']);
		MAIN.$selectedRow = $this;
		$jq.editMetallModal.modal('show');
	},
	METALLS = {
		getMetalls: function() {
			return $.ajax({
				url: URLs.getMetalls,
				method: 'GET'
			}).then(function (response) {
				methods.checkCrollInTable('metallsTable');
				$('.metallListTable tbody').html(Mustache.render($jq.metallsTableTemplate.html(), response));
				$('#addNewProductModal .metallsList').html(Mustache.render($('#metallListTemplate').html(), response));
				MAIN.scrollTables.metallsTable = methods.addDataTable($('#settingsMetallsWrapper .metallListTable table'));
				MAIN.metallTableContent = response.metallTableContent;
			}); 
		},

		handler: function () {
			$('.metallWrapper').click(methods.kimFocus);
			$jq.addMetallBtn.click(addMetall);
			$jq.editMetallBtn.click(editMetall);
			$jq.deleteMetallBtn.click(deleteMetall);
			$jq.outBodyElements.on('dblclick', '.metallListTable tbody tr', prepareDataEditModal);
		}
	};
	
	return METALLS;
});