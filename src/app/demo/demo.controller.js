/**
 * Created by Monster on 7/24/2016.
 */
(function() {
  'use strict';

  angular
    .module('cdio')
    .controller('DemoController', DemoController);

  /** @ngInject */
  function DemoController(syllabusElasticsearch, $scope, $mdDialog, $q ) {
    var vm = this;
    vm.syllabus = {};
    vm.syllabus.assessment_list = [];
    vm.addAssessment = function() {
      var nassessment = {id: vm.assessment_id};
      if (vm.assessment_id != null) {
        if (!containsObject(nassessment, vm.syllabus.assessment_list)) {
          console.log(containsObject(nassessment, vm.syllabus.assessment_list));
          console.log(JSON.stringify(vm.syllabus.assessment_list));
          vm.syllabus.assessment_list.push(nassessment);
        }

        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }
    }

    function containsObject(obj, list) {
      var res = _.find(list, function(val){ return _.isEqual(obj.id, val.id)});
      return (_.isObject(res))? true:false;
    }


  }
})();
