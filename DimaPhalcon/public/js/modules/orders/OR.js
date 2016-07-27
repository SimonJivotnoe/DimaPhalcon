define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var
	OR = {
		handler: function () {
			$('#left-component').css('width', localStorage.split);
			$('#divider, #right-component').css('left', localStorage.split);
			$('#divider').on('mousemove', function(){
				localStorage.split = $('#divider').css('left');
			});
			$('#creatingOrderWrapper').splitPane();
		}
	};
	
	return OR;
});

