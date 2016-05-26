define([], function () {
	var jq = {
		body: $('body'),
		sectionContent: $('#sectionContent'),
		// TOP icons
        topIconsWrapper: $('#topIconsWrapper'),
		menuIconsTop: $('#menuIconsTop'),

        startPageWrapper: $('#startPageWrapper'),
		databaseWrapper: function () {
			return $('#databaseWrapper');
		},
		runDB: $('#runDB'),
		dbProductsListList: function () {
			return $('#dbProductsListList');
		}
	};
	
	return jq;
});