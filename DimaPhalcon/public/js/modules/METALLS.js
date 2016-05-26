define(['require', 'jq', 'methods', 'URLs', 'mustache'], function (require) {
	var $jq = require('jq');
	var methods = require('methods');
	var URLs = require('URLs');
	var Mustache = require('mustache');
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