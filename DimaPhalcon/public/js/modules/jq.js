define(function () {
	var $jq = {
		// TEMPLATES
		leftTabsTemplate: $('#leftTabsTemplate'),
		categoriesTableTemplate: $('#categoriesTableTemplate'),
		optionListTemplate: $('#optionListTemplate'),
		metallsTableTemplate: $('#metallsTableTemplate'),

		body: $('body'),
		outBodyElements: $('#outBodyElements'),
		sectionContent: $('#sectionContent'),
		// TOP icons
        topIconsWrapper: $('#topIconsWrapper'),
		menuIconsTop: $('#menuIconsTop'),
		backIcon: $('#backIcon'),
		prefIcon: $('#prefIcon'),
		dbIcon: $('#dbIcon'),
		prIcon: $('#prIcon'),
		
		// START PAGE
		runPreferences: $('#runPreferences'),
		runDB: $('#runDB'),
		runPR: $('#runPR'),
		
        startPageWrapper: $('#startPageWrapper'),
		layout: $('#backLayout'),
		//Database Section
		databaseWrapper: function () {
			return $('#databaseWrapper');
		},
		dbProductsListList: function () { return $('#dbProductsListList'); },
		productsTreeDB: function () { return $('.productsTreeDB'); },
		
		addCategoryBtn: $('#addCategoryBtn'),
		// Add Category Modal
		addCategoryModal: $('#addNewCategoryModal'),
		addCategoryInput: $('#addCategoryInput'),
		addCategoryArticleInput: $('#addCategoryArticleInput'),
		
		// Edit Category Modal
		editCategoryModal: $('#editCategoryModal'),
		editCategoryInput: $('#editCategoryInput'),
			
		// Add KIM Modal
		addKimModal: $('#addNewKimModal'),
		kimHardInput: $('#kimHardInput'),
		kimInput: $('#kimInput'),
		kimDescrInput: $('#kimDescrInput'),
			
		// Edit KIM Modal
		editKimModal: $('#editKimModal'),
		editKimHardInput: $('#editKimHardInput'),
		editKimInput: $('#editKimInput'),
		editKimDescrInput: $('#editKimDescrInput'),
		// Add METALL Modal
		addMetallModal: $('#addNewMetallModal'),
		metallNameInput: $('#metallNameInput'),
		metallPriceInput: $('#metallPriceInput'),
		metallMassInput: $('#metallMassInput'),
		metallOutPriceInput: $('#metallOutPriceInput'),
		metallArticleInput: $('#metallArticleInput'),
		editMetallModal: $('#editMetallModal'),
		editMetallNameInput: $('#editMetallNameInput'),
		editMetallPriceInput: $('#editMetallPriceInput'),
		editMetallMassInput: $('#editMetallMassInput'),
		editMetallOutPriceInput: $('#editMetallOutPriceInput'),
		mainIcons: $('#mainIcons'),
		kimIcons: $('#kimIcons'),
		productsTreeDBButtons: $('#productsTreeDBButtons'),
		backDBTreeIcon: $('#backDBTreeIcon'),
		
		addKimIcon: $('#addKimIcon'),
		editKimIcon: $('#editKimIcon'),
		deleteKimIcon: $('#deleteKimIcon'),
		backKimIcon: $('#backKimIcon'),
		categoriesTable: function () {
			return $('#outBodyElements .categoriesListTable table tbody');
		},
		kimTable: function () {
			return $('#outBodyElements .kimListTable table tbody');
		},
		metallTable: function () {
			return $('#outBodyElements .metallListTable table tbody');
		}
	};
	
	return $jq;
});