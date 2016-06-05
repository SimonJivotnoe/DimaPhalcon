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
		},
		getCategoriesList: function () {
			return $.ajax({
				url: URLs.getCategoriesList,
				method: 'GET',
				data: {
					prId: MAIN.productId
				}
			}).then(function (response) {
				if (response) {
					$('.listOfCategories').html(response.html);
				}
			});
		},
		addCategory: function(categoryName, article) {
			$.ajax( {
				url   :  URLs.addCategories,
				method: 'POST',
				data: {
					categoryName: categoryName,
					article: article
				}
			} ).then( function ( response ) {
				if (true === response.success) {
					$('#addCategoryInput, #addCategoryArticleInput').val('');
					$.when(CATEGORIES.getCategories(), CATEGORIES.getCategoriesList()).then(function () {
						$jq.addCategoryModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				} else {
					methods.MESSAGES.show(response);
				}
			} );
		},


		editCategory: function (name) {
			methods.cancelArticleBtn();
			return $.ajax( {
				url   : URLs.editCategory,
				method: 'POST',
				data: {
					id: MAIN.$selectedRow.attr('data-id'),
					name: name
				}
			} );
		},

		confirmDelete: function ($this, $noty) {
			$.when(CATEGORIES.removeCategory($this.attr('data-id'))).then(function (response) {
				if (true === response.success) {
					$.when(CATEGORIES.getCategories(), CATEGORIES.getCategoriesList() ).then(function () {
						$jq.deleteKimIcon.click().click();
					});
				}
				setTimeout(methods.MESSAGES.show.bind(this, response), 1000);
				$noty.close();
			});
		},

		removeCategory: function (id) {
			methods.cancelArticleBtn();
			return $.ajax({
				url   : URLs.removeCategory,
				method: 'DELETE',
				data: {	id: id }
			});
		}
	};
	
	return CATEGORIES;
});