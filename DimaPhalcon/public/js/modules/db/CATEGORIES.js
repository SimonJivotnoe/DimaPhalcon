define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	addCategory = function () {
		var category = VALIDATION.validateInputVal({
				val: $jq.addCategoryInput.val(),
				id: '#addCategoryInput',
				unique: true
			}),
			article = VALIDATION.validateInputVal({
				val: $jq.addCategoryArticleInput.val(),
				id: '#addCategoryArticleInput',
				unique: true
			});
		if (category && article) {
			$.ajax( {
				url   :  URLs.addCategories,
				method: 'POST',
				data: {
					categoryName: category,
					article: article
				}
			} ).then( function ( response ) {
				if (methods.checkResponseOnSuccess(response)) {
					$('#addCategoryInput, #addCategoryArticleInput').val('');
					$.when(CATEGORIES.getCategories()).then(function () {
						$jq.addCategoryModal.modal('hide');
					});
				}
			} );
		}
	},
	editCategory = function(){
		var name = VALIDATION.validateInputVal({
			val: $jq.editCategoryInput.val()
		});
		if (name) {
			methods.cancelArticleBtn();
			$.ajax( {
				url   : URLs.editCategory,
				method: 'POST',
				data: {
					id: MAIN.$selectedRow.attr('data-id'),
					name: name
				}
			} ).then(function (response) {
				if (methods.checkResponseOnSuccess(response)) {
					$.when(CATEGORIES.getCategories()).then(function () {
						$jq.editKimIcon.click().click();
						$jq.editCategoryModal.modal('hide');
					});
				}
			});
		}
	},
	deleteCategory = function () {
		methods.cancelArticleBtn();
		$.ajax({
			url   : URLs.removeCategory + '/' + $(this).attr('data-id'),
			method: 'DELETE'
		}).then(function (response) {
			if (methods.checkResponseOnSuccess(response)) {
				$.when(CATEGORIES.getCategories()).then(function () {
					$jq.deleteKimIcon.click().click();
					$jq.deleteKIMGroupModal.modal('hide');
				});
			}
		});
	},
	prepareDataEditModal = function () {
		var $this = $(this),
			id = $this.attr('data-id');
		$jq.editCategoryInput.val(MAIN.categoriesTableContent.data[id].name);
		MAIN.$selectedRow = $this;
		$jq.editCategoryModal.modal('show');
	},
	CATEGORIES = {
		getCategories: function() {
			return $.ajax( {
			   url   : URLs.getCategories,
			   method: 'GET'
			} ).then( function ( response ) {
			   methods.checkCrollInTable('categoriesTable');
			   $('.categoriesListTable tbody').html(Mustache.render($jq.categoriesTableTemplate.html(), response));
			   $('#addNewProductModal .categoriesList').html(Mustache.render($jq.optionListTemplate.html(), response));
			   MAIN.scrollTables.categoriesTable = methods.addDataTable($('#settingsMetallsWrapper .categoriesListTable table'));
			   MAIN.categoriesTableContent = response.categoriesTableContent;
			} );
		},

		handler: function () {
			$('.categoriesWrapper').click(methods.kimFocus);
			$jq.addCategoryBtn.click(addCategory);
			$jq.editCategoryBtn.click(editCategory);
			$jq.deleteCategoryBtn.click(deleteCategory);
			$jq.outBodyElements.on('dblclick', '.categoriesListTable tbody tr', prepareDataEditModal);
		},
	};
	
	return CATEGORIES;
});