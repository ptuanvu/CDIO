(function() {
  'use strict';

  angular
    .module('cdio')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('add_class', {
        url: '/add_class',
        templateUrl: 'app/add_class/add_class.html',
        controller: 'AddClassController',
        controllerAs: 'add'
      }).state('goals', {
        url: '/goals',
        templateUrl: 'app/goals/goals.html',
        controller: 'GoalsController',
        controllerAs: 'goals'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
