(function () {
  'use strict';

  angular
    .module('cdio')
    .controller('GoalsController', GoalsController);

  /** @ngInject */
  function GoalsController($timeout) {
    var vm = this;
    //var elasticsearch = require('elasticsearch');

    vm.goals = ['Kỹ năng tìm kiếm', 'Kỹ năng'];

    vm.newgoal = "This is a new goal";

    vm.addGoals = function () {
      if (vm.newgoal != "") {
        vm.goals.push(vm.newgoal);
         var client = elasticsearch.Client();

        client.bulk({
          body: [
            // action description
            { index:  { _index: 'goals', _type: 'goals', _id: vm.hits +1 } },
            { title: vm.newgoal }
          ]
        }, function (err, resp) {
          getGoals();
        });
        $timeout(function() {
          getGoals();
        }, 10);

      }
    }

    getGoals();



    function getGoals() {
      var client = elasticsearch.Client();

      client.count({
        index: 'goals'
      }, function (error, response) {

        vm.hits = response.count;

        $timeout(function() {
          vm.hits = response.count;
          console.log("Count: " + response.count);
        }, 10);
      });

      client.search({
        index: 'goals',
      }, function (error, response) {
        // ...

        $timeout(function() {
          vm.ogoals = response.hits;
          console.log("Goals: " + response.hits);
        }, 10);
      });

    }


  }
})();
