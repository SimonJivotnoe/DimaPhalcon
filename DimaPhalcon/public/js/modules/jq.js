define(function () {
	var $jq = {
		// TEMPLATES
		leftTabsTemplate: $('#leftTabsTemplate'),
		tabsContentTemplate: $('#tabsContentTemplate'),
		categoriesTableTemplate: $('#categoriesTableTemplate'),
		optionListTemplate: $('#optionListTemplate'),
		metallsTableTemplate: $('#metallsTableTemplate'),
		productTableRowTemplate: $('#productTableRowTemplate'),
		formulasHelperTemplate: $('#formulasHelperTemplate'),
		formulaTemplate: $('#formulaTemplate'),
		justCreatedFormula: $('#justCreatedFormula'),

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
		addNewProductIcon: $('#addNewProductIcon'),
		showItemFromTreeDB: $('#showItemFromTreeDB'),
		familyActions: $('#addToFamily'),
		removeProductIcon: $('#removeProductIcon'),
			deleteProductBtn: $('#deleteProductBtn'),
		databaseWrapper: function () {
			return $('#databaseWrapper');
		},
		dbProductsListList: function () { return $('#dbProductsListList'); },
		productsTreeDB: function () { return $('.productsTreeDB'); },
		deleteKIMGroupModal: $('#deleteKIMGroupModal'),
		// Add Category Modal
		addCategoryModal: $('#addNewCategoryModal'),
		addCategoryInput: $('#addCategoryInput'),
		addCategoryArticleInput: $('#addCategoryArticleInput'),
		addCategoryBtn: $('#addCategoryBtn'),

		// Edit Category Modal
		editCategoryModal: $('#editCategoryModal'),
		editCategoryInput: $('#editCategoryInput'),
		editCategoryBtn: $('#editCategoryBtn'),

		deleteCategoryBtn: $('#deleteCategoryBtn'),

		// Add KIM Modal
		addKimModal: $('#addNewKimModal'),
		kimHardInput: $('#kimHardInput'),
		kimInput: $('#kimInput'),
		kimDescrInput: $('#kimDescrInput'),
		addKIMBtn: $('#addKIMBtn'),
			
		// Edit KIM Modal
		editKimModal: $('#editKimModal'),
		editKimHardInput: $('#editKimHardInput'),
		editKimInput: $('#editKimInput'),
		editKimDescrInput: $('#editKimDescrInput'),
		editKimBtn: $('#editKimBtn'),

		deleteKimBtn: $('#deleteKimBtn'),

		// Add METALL Modal
		addMetallModal: $('#addNewMetallModal'),
		metallNameInput: $('#metallNameInput'),
		metallPriceInput: $('#metallPriceInput'),
		metallMassInput: $('#metallMassInput'),
		metallOutPriceInput: $('#metallOutPriceInput'),
		metallArticleInput: $('#metallArticleInput'),
		addMetallBtn: $('#addMetallBtn'),
		
		editMetallModal: $('#editMetallModal'),
		editMetallNameInput: $('#editMetallNameInput'),
		editMetallPriceInput: $('#editMetallPriceInput'),
		editMetallMassInput: $('#editMetallMassInput'),
		editMetallOutPriceInput: $('#editMetallOutPriceInput'),
		editMetallBtn: $('#editMetallBtn'),

		deleteMetallBtn: $('#deleteMetallBtn'),

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
		},
        // MODALS
        addNewProductModal: $('#addNewProductModal'),
			clearNewProductModal: $('#clearNewProductModal'),
			productNameInput: $('.productNameInput'),
		    productTableWrapper: $('#productTableWrapper'),
			categoriesList: $('.categoriesList'),
			kimList: $('.kimList'),
			metallsList: $('.metallsList'),
			
			uploadImageProduct: $('#uploadImageProduct'),
		
			addNewRow: $('#addNewRow'),
			
			productArticle: $('#productArticle'),
			createArticle: $('#createArticle'),
			cancelArticleBtn: $('#cancelArticleBtn'),

			productTabsLiWrapper: function () { return $('#productTabsLiWrapper'); },
			productTableRows: $('#sortable'),
			formulaBtnGroupPr: $('.formulaBtnGroupPr'),
				cancelFormulaBtnPr: $('#cancelFormulaBtnPr'),
				addFormulaBtnPr: $('#addFormulaBtnPr'),
			addFormulaInputPr: $('#addFormulaInputPr'),
			formulasHelper: $('#formulasHelper'),
			formulasList: $('#formulasList'),
			addNewFhBtnInput: $('#addNewFhBtnInput'),
			addNewFhBtn: $('.addNewFhBtn'),
			addNewProductBtn: $('#addNewProductBtn'),

		createFamilyModal: $('#createFamilyModal'),
			newFamilyName: $('#newFamilyName'),
			createFamilyBtn: $('#createFamilyBtn'),
		deleteProductModal: $('#deleteProductModal'),
	};
	
	return $jq;
});