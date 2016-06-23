define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION', 'calx'], function ($jq, methods, URLs, Mustache, VALIDATION) {
	var KIM = {
		getKIM: function () {
			return $.ajax({
				url: URLs.getKim,
				method: 'GET'
			}).then(function (response) {
				methods.checkCrollInTable('kimTable');
				$('.kimListTable tbody').html(Mustache.render($('#kimTableTemplate').html(), response));
				$('#addNewProductModal .kimList').html(Mustache.render($('#optionListTemplate').html(), response));
				MAIN.scrollTables.kimTable = methods.addDataTable($('#settingsMetallsWrapper .kimListTable table'));
				MAIN.kimTableContent = response.kimTableContent;
			});
		},
		getKimList: function () {
			return $.ajax({
				url: URLs.getKimList,
				method: 'GET',
				data: {
					prId: MAIN.productId
				}
			}).then(function (data) {
				$('.listOfKim').html(data.html);
				var kim = $('.listOfKim option:selected').attr('kim');
				$('[data-cell="KIM1"]').val(kim);
				$('#calx').calx();
			});
		},

		addKIM: function (kim, kimHard, description) {
			methods.cancelArticleBtn();
			$.ajax({
				url: URLs.addKIM,
				method: 'POST',
				data: {
					kim: kim,
					kimHard: kimHard,
					description: description
				}
			}).then(function (response)
			{
				if (true === response.success) {
					$('#kimInput, #kimHardInput, #kimDescrInput').val('');
					$.when(KIM.getKIM(), KIM.getKimList()).then(function () {
						$jq.addKimModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				} else {
					methods.MESSAGES.show(response);
				}
			});
		},

		editKimBtn: function () {
			var kim = VALIDATION.validateInputVal({
					val: $jq.editKimInput.val(),
					digitsOnly: true
				}),
				kimHard = VALIDATION.validateInputVal({
					val: $jq.editKimHardInput.val()
				});
			if (kim && kimHard) {
				$.when(KIM.editKim(kim, kimHard, $jq.editKimDescrInput.val())).then(function (response) {
					if (true === response.success) {
						$.when(KIM.getKIM(), KIM.getKimList() ).then(function () {
							$jq.editKimIcon.click().click();
							$jq.editKimModal.modal('hide');
							setTimeout(methods.MESSAGES.show.bind(this, response), 300);
						});
					} else {
						methods.MESSAGES.show(response);
					}
				});
			}
		},

		editKim: function (kim, kimHard, description) {
			methods.cancelArticleBtn();
			return $.ajax( {
				url   : URLs.editKim,
				method: 'POST',
				data: {
					kimId: MAIN.$selectedRow.attr('data-id'),
					kim: kim,
					kimHard : kimHard,
					description: description
				}
			} )
		},

		confirmDelete: function ($this, $noty) {
			$.when(KIM.removeKim($this.attr('data-id'))).then(function (response) {
				if (true === response.success) {
					$.when(KIM.getKIM(), KIM.getKimList()).then(function () {
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
		}
	};
	
	return KIM;
});