define(function () {
   if (!window.MAIN) {
       window.MAIN = {
           defaultScreenSize: '60em',
           minscreenSize: '5px',
		   maxScreenSize: (window.screen.availWidth - 5) + 'px',
		   productsTreeDB: {
				core: {

				},
				state: {key: 'productsTreeDB'},
				plugins: ['state', 'sort'/*, 'dnd', 'checkbox'*/]
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
