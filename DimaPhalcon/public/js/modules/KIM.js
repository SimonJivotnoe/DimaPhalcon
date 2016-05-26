define(['require', 'jq', 'methods', 'URLs', 'mustache'], function (require) {
	var $jq = require('jq');
	var methods = require('methods');
	var URLs = require('URLs');
	var Mustache = require('mustache');
	
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
		}
	};
	
	return KIM;
});