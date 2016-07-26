define([], function () {
    var URLs = {
		BASE:     '/',
		TABS:	  'tabs/',
		CATEG:	  'categories/',
		ORDER:    'order/',
		KIM:	  'kim/',
		METALLS:  'metalls/',
		PRODUCT:  'products/',
		FORMULAS:  'formulas/',
		MENU:	  'menu/',
		CLIENTS:  'clients/',
		PROJECTS:  'projects/',
		THEMES:	  'themes/',
		FAMILY:	  'family/',
		LOCATION: '/'
    };
	_.extend(URLs, {
		loadDBTemplate: 'templates/productsDB.html',
		// METALLS
		getMetalls: URLs.METALLS + 'getMetalls',
		getMetallsList: URLs.METALLS + 'getMetallsList',
		addMetall: URLs.METALLS + 'addMetall',
		editMetall: URLs.METALLS + 'editMetall',
		removeMetall: URLs.METALLS + 'removeMetall',
		// KIM
		getKim: URLs.KIM + 'getKim',
		getKimList: URLs.KIM + 'getKimList',
		addKIM: URLs.KIM + 'addKIM',
		editKim: URLs.KIM + 'editKim',
		removeKim: URLs.KIM + 'removeKim',

		// CATEGORIES
		getCategories: URLs.CATEG + 'getCategories',
		addCategories: URLs.CATEG + 'add',
		getCategoriesList: URLs.CATEG + 'getCategoriesList',
		editCategory: URLs.CATEG + 'editCategory',

		removeCategory: URLs.CATEG + 'removeCategory',
		getLeftTabsList: URLs.TABS + 'getLeftTabsList',
		getLeftTabContent: URLs.TABS + 'getLeftTabContent',
		getProductsTree: URLs.MENU + 'getProductsTree',
		// TABS
		getTabs: URLs.TABS + 'getTabs',
		changeActiveTab: URLs.TABS + 'changeActiveLeftTab',
		addProductDbTab: URLs.TABS + 'addProductDbTab',
		closeTab: URLs.TABS + 'closeTab',
		// PRODUCT
		getFormulasHelper: URLs.FORMULAS + 'getFormulasHelper',
		addBtnToFormulasHelper: URLs.PRODUCT + 'addBtnToFormulasHelper',
		removeBtnFromFormulasHelper: URLs.PRODUCT + 'removeBtnFromFormulasHelper',
		saveProduct: URLs.PRODUCT + 'saveProduct',
		uploadImage: URLs.PRODUCT + 'uploadImage',
		// TREE
		addToFamily: URLs.FAMILY + 'addToFamily',
		removeFromFamily: URLs.FAMILY + 'removeFromFamily',
		deleteProduct: URLs.PRODUCT + 'deleteProduct'
	});

    return URLs;
});