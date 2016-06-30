define(['jq', 'methods', 'URLs', 'mustache', 'calx'], function ($jq, methods, URLs, Mustache) {
	var METALLS = {
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
		getMetallsList: function () {
			$.ajax({
				url: URLs.getMetallsList,
				method: 'GET',
				data: {
					prId: MAIN.productId
				}
			}).then(function (response) {
				$('.listOfMetalls').html(response.html);
				var metall = $('.listOfMetalls option:selected').attr('metall');
				var metallOut = $('.listOfMetalls option:selected').attr('metallOut');
				$('[data-cell="PR1"]').val(metall);
				$('[data-cell="PR2"]').val(metallOut);
				methods.excel();
			});
		},

		addMetall: function (obj) {
			methods.cancelArticleBtn();
			$.ajax( {
				url   : URLs.addMetall,
				method: 'POST',
				data: obj
			} ).then( function ( response )
			{
				if (true === response.success) {
					$jq.addMetallModal.find('input').val();
					$.when(METALLS.getMetalls(), METALLS.getMetallsList()).then(function () {
						$jq.addMetallModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				} else {
					methods.MESSAGES.show(response);
				}
			});
		},

		editMetall: function (obj) {
			methods.cancelArticleBtn();
			return $.ajax({
				url: URLs.editMetall,
				method: 'POST',
				data: obj
			});
		},

		confirmDelete: function ($this, $noty) {
			$.when(METALLS.removeMetall($this.attr('data-id'))).then(function (response) {
				if (true === response.success) {
					$.when(METALLS.getMetalls(), METALLS.getMetallsList()).then(function () {
						$jq.deleteKimIcon.click().click();
					});
				}
				setTimeout(methods.MESSAGES.show.bind(this, response), 1000);
				$noty.close();
			});
		},

		removeMetall: function(metallId) {
			methods.cancelArticleBtn();
			return $.ajax( {
				url   : URLs.removeMetall + '/' + metallId,
				method: 'DELETE',
				data: { metallId: metallId }
			} );
		}
	};
	
	return METALLS;
});