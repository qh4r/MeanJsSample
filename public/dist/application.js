'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meansample';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('customers');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('customers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Customers', 'customers', 'dropdown', '/customers(/create)?');
		Menus.addSubMenuItem('topbar', 'customers', 'List Customers', 'customers');
		Menus.addSubMenuItem('topbar', 'customers', 'New Customer', 'customers/create');
	}
]);
'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('listCustomers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/list-customers.client.view.html'
		}).
		//state('createCustomer', {
		//	url: '/customers/create',
		//	templateUrl: 'modules/customers/views/create-customer.client.view.html'
		//}).
		state('customersListTemplate', {
			url: '/customers/modal',
			templateUrl: 'modules/customers/views/customers-list-template.html',
		})
		//state('viewCustomer', {
		//	url: '/customers/:customerId',
		//	templateUrl: 'modules/customers/views/view-customer.client.view.html'
		//}).
		//state('editCustomer', {
		//	url: '/customers/:customerId/edit',
		//	templateUrl: 'modules/customers/views/edit-customer.client.view.html'
		//});
	}
]);

'use strict';
var customersApp = angular.module('customers');
// Customers controller
customersApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log', '$location',
    function ($scope, $stateParams, Authentication, Customers, $modal, $log, $location) {
        this.authentication = Authentication;
        var customersController = this;
        this.refreshCustomers = function() {
            customersController.customers = Customers.query();
        }

        this.refreshCustomers();

        this.filterCustomers = function (search) {
            return function (val) {
                return !search ? val : (val.firstName.indexOf(search) > -1)
                || (val.surname.indexOf(search) > -1) ? val : undefined;
            }
        };

        $scope.findOne = function () {
            $scope.customer = Customers.get({
                customerId: $stateParams.customerId
            });
        };

        this.modelUpdate = function (size, customer) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/customers/views/edit-customer.client.view.html',
                controller: ["$scope", "$modalInstance", "customer", function ($scope, $modalInstance, customer) {
                    //console.log(customer)
                    $scope.customer = customer;
                    $scope.ok = function (formValid) {
                        if (formValid) {
                            $modalInstance.close($scope.customer);
                        }
                    }
                    $scope.cancel = function () {
                        $modalInstance.dismiss('back');
                    }
                }],
                size: size,
                resolve: {
                    customer: function () {
                        return customer;
                    }
                }
            });

            modalInstance.result.then(function (customer) {
                //console.log(customer)
                $scope.selected = customer;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.modelCreate = function (size, customer) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/customers/views/create-customer.client.view.html',
                controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                    //console.log(customer)
                    //$scope.customer = customer;
                    $scope.ok = function (formValid) {
                        if (formValid) {
                            $modalInstance.close();
                        }
                    }
                    $scope.cancel = function () {
                        $modalInstance.dismiss('back');
                    }
                }],
                size: size,
                resolve: {
                    customer: function () {
                        return customer;
                    }
                }
            });

            modalInstance.result.then(function (customer) {
                //refreshCustomers();
            }, function (asd) {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.remove = function (customer) {
            if (customer) {
                customer.$remove();

                for (var i in this.customers) {
                    if (this.customers [i] === customer) {
                        this.customers.splice(i, 1);
                    }
                }
            } else {
                this.customer.$remove(function () {
                    //$location.path('customers');
                });
            }
        };

    }
]);

customersApp.controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
    function ($scope, Customers, Notify) {
        var that = this;
        this.customer = {};
        this.create = function (obj) {
            console.log(this.customer)
            // Create new Customer object
            var newCustomer = new Customers({
                firstName: this.customer.firstName,
                surname: this.customer.surname,
                suburb: this.customer.suburb,
                country: this.customer.country,
                industry: this.customer.industry,
                email: this.customer.email,
                phone: this.customer.phone,
                referred: this.customer.referred,
                channel: this.customer.channel,

            });
            console.log(newCustomer)

            // Redirect after save
            newCustomer.$save(function (response) {
                //console.log(response)
                Notify.sendMsg('NewCustomer', {id: response._id});
                //$location.path('customers/' + response._id);
                //$scope.customers.push(response);
                // Clear form fields
                that.customer.firstName = '';
                that.customer.surname = '';
                that.customer.suburb = '';
                that.customer.country = '';
                that.customer.industry = '';
                that.customer.email = '';
                that.customer.phone = '';
                that.customer.referred = false;
                that.customer.channel = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
    }
]);

customersApp.controller('CustomersUpdateController', ['$scope', '$modal', 'Customers',
    function ($scope, $modal, Customers) {
        this.update = function (newCustomer) {
            var customer = newCustomer;
            customer.$update(function () {
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }

    }
]);

customersApp.directive('customersList', ['Notify', 'Customers',function (Notify, Customers) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/customers/views/customers-list-template.html',
        link: function (scope, element, attrs) {

            Notify.getMsg('NewCustomer', function(event, data){
                console.log('gotMessage', data);
                scope.customersCtrl.refreshCustomers();
            })
        }
    }
}]);

//// Remove existing Customer
//$scope.remove = function (customer) {
//    if (customer) {
//        customer.$remove();
//
//        for (var i in $scope.customers) {
//            if ($scope.customers [i] === customer) {
//                $scope.customers.splice(i, 1);
//            }
//        }
//    } else {
//        $scope.customer.$remove(function () {
//            $location.path('customers');
//        });
//    }
//};
//



'use strict';

//Customers service used to communicate Customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
        function ($resource) {
            return $resource('customers/:customerId', {
                customerId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .factory('Notify', ['$rootScope',
        function ($rootScope) {
            var notify = {};
            notify.sendMsg = function(msg, data){
                data = data || {};
                $rootScope.$emit(msg,data);
                console.log('message been sent!');

            }

            notify.getMsg = function(msg, func, scope){
                var unbind = $rootScope.$on(msg, func);

                if(scope){
                    scope.$on('destroy', unbind);
                }
            }
            return notify;
        }
    ]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);