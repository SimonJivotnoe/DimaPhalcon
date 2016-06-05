define([], function () {
    var URLs = {
		BASE:     '/',
		TABS:	  'tabs/',
		CATEG:	  'categories/',
		ORDER:    'order/',
		KIM:	  'kim/',
		METALLS:  'metalls/',
		PRODUCT:  'products/',
		MENU:	  'menu/',
		CLIENTS:  'clients/',
		PROJECTS:  'projects/',
		THEMES:	  'themes/',
		LOCATION: '/'
    };
	_.extend(URLs, {
		loadDBTemplate: 'templates/productsDB.html',
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
		getMetalls: URLs.METALLS + 'getMetalls',
		getLeftTabsList: URLs.TABS + 'getLeftTabsList',
		getLeftTabContent: URLs.TABS + 'getLeftTabContent',
		getProductsTree: URLs.MENU + 'getProductsTree'
	});

    return URLs;
});