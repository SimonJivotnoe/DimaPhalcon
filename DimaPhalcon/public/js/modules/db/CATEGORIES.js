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
				if (true === response.success) {
					$('#addCategoryInput, #addCategoryArticleInput').val('');
					$.when(CATEGORIES.getCategories()/*, CATEGORIES.getCategoriesList()*/).then(function () {
						$jq.addCategoryModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				} else {
					methods.MESSAGES.show(response);
				}
			} );
		}
	},
	editCategory = function(){
		var name = VALIDATION.validateInputVal({
			val: $jq.editCategoryInput.val()
		});
		if (name) {
			$.when(CATEGORIES.editCategory(name)).then(function (response) {
				if (true === response.success) {
					$.when(CATEGORIES.getCategories()/*, CATEGORIES.getCategoriesList() */).then(function () {
						$jq.editKimIcon.click().click();
						$jq.editCategoryModal.modal('hide');
						setTimeout(methods.MESSAGES.show.bind(this, response), 300);
					});
				} else {
					methods.MESSAGES.show(response);
				}
			});
		}
	},
	showEditModal = function () {
		var $this = $(this);
		var id = $this.attr('data-id');
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
		
		/*getCategoriesList: function () {
			return $.ajax({
				url: URLs.getCategoriesList,
				method: 'GET',
				data: { prId: MAIN.productId }
			}).then(function (response) {
				if (response) {
					$('.listOfCategories').html(response.html);
				}
			});
		},*/
		
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
					$.when(CATEGORIES.getCategories()/*, CATEGORIES.getCategoriesList() */).then(function () {
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
				url   : URLs.removeCategory + '/' + id,
				method: 'DELETE'
			});
		},
		handler: function () {
			$('.categoriesWrapper').click(methods.kimFocus);
			$jq.addCategoryBtn.click(addCategory);
			$jq.editCategoryBtn.click(editCategory);
			$jq.outBodyElements.on('dblclick', '.categoriesListTable tbody tr', showEditModal);
		},
	};
	
	return CATEGORIES;
});