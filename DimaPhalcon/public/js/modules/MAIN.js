define(function () {
   if (!window.MAIN) {
       window.MAIN = {
           defaultScreenSize: '60em',
		   productsTreeDB: {
				core: {

				},
				state: {key: 'productsTreeDB'},
				plugins: ['state', 'sort'/*, 'checkbox'*/]
			}
       };
   }
}());
