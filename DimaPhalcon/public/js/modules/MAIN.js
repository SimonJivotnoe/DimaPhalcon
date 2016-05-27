define(function () {
   if (!window.MAIN) {
       window.MAIN = {
           defaultScreenSize: '60em',
		   maxScreenSize: (window.screen.availWidth - 5) + 'px',
		   productsTreeDB: {
				core: {

				},
				state: {key: 'productsTreeDB'},
				plugins: ['state', 'sort'/*, 'checkbox'*/]
			},
			scrollTables: {
				categoriesTable: false,
				kimTable: false,
				metallsTable: false,
				scrollTop: 0
			},
			focusedElem: false,
			$selectedRow: false,
			previousTdColor: false,
			previousThColor: false
       };
   }
}());
