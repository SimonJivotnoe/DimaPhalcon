define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION', 'calx'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	addKIM = function () {
		var kim = VALIDATION.validateInputVal({
			val: $jq.kimInput.val(),
			id: '#kimInput',
			digitsOnly: true
		}),
		kimHardInput = VALIDATION.validateInputVal({
			val: $jq.kimHardInput.val(),
			id: '#kimHardInput',
			unique: true
		});
		if (kim && kimHardInput) {
			var description = $jq.kimDescrInput.val();
			methods.cancelArticleBtn();
			$.ajax({
				url: URLs.addKIM,
				method: 'POST',
				data: {
					kim: kim,
					kimHard: kimHardInput,
					description: description ? description : 'Нет описания'
				}
			}).then(function (response)
			{
				if (methods.checkResponseOnSuccess(response)) {
					$('#kimInput, #kimHardInput, #kimDescrInput').val('');
					$.when(KIM.getKIM()).then(function () {
						$jq.addKimModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				}
			});
		}
	},
	editKim = function () {
		var kim = VALIDATION.validateInputVal({
			val: $jq.editKimInput.val(),
			digitsOnly: true
		}),
		kimHard = VALIDATION.validateInputVal({
			val: $jq.editKimHardInput.val()
		});
		if (kim && kimHard) {
			var description = $jq.editKimDescrInput.val();
			methods.cancelArticleBtn();
			$.ajax( {
				url   : URLs.editKim,
				method: 'POST',
				data: {
					kimId: MAIN.$selectedRow.attr('data-id'),
					kim: kim,
					kimHard : kimHard,
					description: description
				}
			} ).then(function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					$.when(KIM.getKIM()).then(function () {
						$jq.editKimIcon.click().click();
						$jq.editKimModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				}
			});
		}
	},
	KIM = {
		getKIM: function () {
			return $.ajax({
				url: URLs.getKim,
				method: 'GET'
			}).then(function (response) {
				methods.checkCrollInTable('kimTable');
				$('.kimListTable tbody').html(Mustache.render($('#kimTableTemplate').html(), response));
				$('#addNewProductModal .kimList').html(Mustache.render($('#kimListTemplate').html(), response));
				MAIN.scrollTables.kimTable = methods.addDataTable($('#settingsMetallsWrapper .kimListTable table'));
				MAIN.kimTableContent = response.kimTableContent;
			});
		},

		confirmDelete: function ($this, $noty) {
			$.when(KIM.removeKim($this.attr('data-id'))).then(function (response) {
				if (true === response.success) {
					$.when(KIM.getKIM()).then(function () {
						$jq.deleteKimIcon.click().click();
					});
				}
				setTimeout(methods.MESSAGES.show.bind(this, response), 1000);
				$noty.close();
			});
		},

		removeKim: function (id) {
			methods.cancelArticleBtn();
			return $.ajax({
				url   : URLs.removeKim + '/' + id,
				method: 'DELETE',
				data: {kimId: id}
			});
		},
		handler: function () {
			$('.kimWrapper').click(methods.kimFocus);
			$jq.addKIMBtn.click(addKIM);
			$jq.editKimBtn.click(editKim);
		}
	};
	
	return KIM;
});