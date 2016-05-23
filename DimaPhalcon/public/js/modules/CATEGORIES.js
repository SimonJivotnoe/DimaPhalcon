define(['jq', 'methods', 'URLs', 'mustache'], function ($jq, methods, URLs, Mustache) {
	var CATEGORIES = {
		getCategories: function() {
			return $.ajax( {
			   url   : URLs.getCategories,
			   method: 'GET'
		   } ).then( function ( response ) {
			   methods.checkCrollInTable('categoriesTable');
			   $('.categoriesListTable tbody').html(Mustache.render($('#categoriesTableTemplate').html(), response));
			   $('#addNewProductModal .categoriesList').html(Mustache.render($('#optionListTemplate').html(), response));
			   MAIN.scrollTables.categoriesTable = methods.addDataTable($('#settingsMetallsWrapper .categoriesListTable table'));
			   MAIN.categoriesTableContent = response.categoriesTableContent;
		   } );
	   }
	};
	
	return CATEGORIES;
});