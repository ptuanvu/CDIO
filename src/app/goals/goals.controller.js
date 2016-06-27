(function() {
  'use strict';

  angular
    .module('cdio')
    .controller('GoalsController', GoalsController);

  /** @ngInject */
  function GoalsController($timeout, $scope) {
    var vm = this;

    vm.goals = ['Kỹ năng tìm kiếm', 'Kỹ năng'];

    vm.newgoal = "This is a new goal";

    vm.addGoals = function() {
      if (vm.newgoal != "") {
        vm.goals.push(vm.newgoal);
      }
    }
  }
})();
