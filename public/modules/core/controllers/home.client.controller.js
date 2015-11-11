'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.homeItems = [
			{
				icon: "glyphicon-user",
				btnColor: "btn-success",
				count: 20400,
				description: "TOTAL CUSTOMERS"
			},
			{
				icon: "glyphicon-calendar",
				btnColor: "btn-primary",
				count: 8300,
				description: "UPCOMING EVENTS"
			},
			{
				icon: "glyphicon-pencil",
				btnColor: "btn-success",
				count: 530,
				description: "NEW CUSTOMERS"
			},
			{
				icon: "glyphicon-info-sign",
				btnColor: "btn-info",
				count: 85000,
				description: "EMAILS SENT"
			},
			{
				icon: "glyphicon-heart-empty",
				btnColor: "btn-warning",
				count: 270,
				description: "FOLLOW UPS"
			},
			{
				icon: "glyphicon-flag",
				btnColor: "btn-danger",
				count: 350,
				description: "REFFEREALS TO MODERATE"
			}
		]
	}
]);
