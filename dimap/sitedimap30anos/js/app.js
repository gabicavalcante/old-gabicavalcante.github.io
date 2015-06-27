(function(){

	var app = angular.module('app',[]);
	
	app.controller("PanelController", function($scope){
		this.tab = 1;

		this.selectTab = function(setTab){
			this.tab = setTab;
		};

		this.isSelected = function(checkTab){
			return this.tab === checkTab;
		};
	});


})();