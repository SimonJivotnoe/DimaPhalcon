define(['jq', 'methods', 'URLs', 'mustache'], function ($jq, methods, URLs, Mustache) {
	var METALLS = {
		getMetalls: function() {
			return $.ajax({
				url: URLs.getMetalls,
				method: 'GET'
			}).then(function (response) {
				methods.checkCrollInTable('metallsTable');
				$('.metallListTable tbody').html(Mustache.render($('#metallsTableTemplate').html(), response));
				$('#addNewProductModal .metallsList').html(Mustache.render($('#optionListTemplate').html(), response));
				MAIN.scrollTables.metallsTable = methods.addDataTable($('#settingsMetallsWrapper .metallListTable table'));
				MAIN.metallTableContent = response.metallTableContent;
			}); 
		}
	};
	
	return METALLS;
});