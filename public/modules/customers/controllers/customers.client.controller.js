'use strict';
var customersApp = angular.module('customers');
// Customers controller
customersApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log', '$location',
    function ($scope, $stateParams, Authentication, Customers, $modal, $log, $location) {
        this.authentication = Authentication;


        this.customers = Customers.query();
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
                controller: function ($scope, $modalInstance, customer) {
                    //console.log(customer)
                    $scope.customer = customer;
                    $scope.ok = function () {

                        $modalInstance.close($scope.customer);
                    }
                    $scope.cancel = function () {
                        $modalInstance.dismiss('back');
                    }
                },
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

    }
]);

//customersApp.controller('CustomersCreateController', ['$scope', 'Customers',
//    function ($scope, Customers) {
//    }
//]);

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

//// Create new Customer
//$scope.create = function () {
//    // Create new Customer object
//    var customer = new Customers({
//        firstName: this.firstName,
//        surname: this.surname,
//        suburb: this.suburb,
//        country: this.country,
//        industry: this.industry,
//        email: this.email,
//        phone: this.phone,
//        referred: this.referred,
//        channel: this.channel,
//
//    });
//
//    // Redirect after save
//    customer.$save(function (response) {
//        $location.path('customers/' + response._id);
//
//        // Clear form fields
//        $scope.firstName = '';
//        $scope.surname = '';
//        $scope.suburb = '';
//        $scope.country = '';
//        $scope.industry = '';
//        $scope.email = '';
//        $scope.phone = '';
//        $scope.referred = false;
//        $scope.channel = '';
//    }, function (errorResponse) {
//        $scope.error = errorResponse.data.message;
//    });
//};
//
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
//// Update existing Customer
//$scope.update = function () {
//    var customer = $scope.customer;
//
//    customer.$update(function () {
//        $location.path('customers/' + customer._id);
//    }, function (errorResponse) {
//        $scope.error = errorResponse.data.message;
//    });
//};

