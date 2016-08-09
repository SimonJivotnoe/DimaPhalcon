define(['methods'], function (methods) {'use strict'; var
	OR = {
		handler: function () {
			$('#left-component').css('width', localStorage.split);
			$('#divider, #right-component').css('left', localStorage.split);
			$('#divider').on('mousemove', function(){
				localStorage.split = $('#divider').css('left');
			});
			$('#divider').on('mousemove', function(){
				localStorage.split = $('#divider').css('left');
			});
			
			$('#creatingOrderWrapper').splitPane();
			
			$('#deleteClientModal, #deleteProjectModal').on('show.bs.modal', function () {
				$(this).find('.whatDeleteElement').html($('#clientsTree').tree('getSelectedNode').name);
			});
			$('#tabsRight').on('dblclick', '#rightTabs li', function(){
				methods.expandDivider('split', 'minscreenSize', '#left-component', '#divider, #right-component');
			});
		}
	};
	
	return OR;
});

