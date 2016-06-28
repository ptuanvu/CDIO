(function() {
  'use strict';

  angular
    .module('cdio')
    .controller('AddClassController', AddClassController);

  /** @ngInject */
  function AddClassController() {
    var vm = this;

    vm.class = {"name":"fill", "goals":"test"}
  }
})();
