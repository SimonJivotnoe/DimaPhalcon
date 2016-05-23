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
		getCategories: URLs.CATEG + 'getCategories',
		getKim: URLs.KIM + 'getKim',
		getMetalls: URLs.METALLS + 'getMetalls',
		getLeftTabsList: URLs.TABS + 'getLeftTabsList',
		getLeftTabContent: URLs.TABS + 'getLeftTabContent'
	});

    return URLs;
});