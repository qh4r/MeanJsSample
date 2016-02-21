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
                controller: function ($scope, $modalInstance, customer) {
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

        this.modelCreate = function (size, customer) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/customers/views/create-customer.client.view.html',
                controller: function ($scope, $modalInstance) {
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
                },
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


