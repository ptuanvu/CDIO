(function () {
  'use strict';

  angular
    .module('cdio')
    .controller('GoalsController', GoalsController)
    .controller('GoalsDialogController', GoalsDialogController);

  /** @ngInject */
  function GoalsController($timeout, $mdMedia, $mdDialog) {
    var vm = this;
    //var elasticsearch = require('elasticsearch');
    var client = elasticsearch.Client();
    vm.goals = ['Kỹ năng tìm kiếm', 'Kỹ năng'];

    vm.newgoal = {};
    function checkExistsGoal(gid) {
      client.searchExists({
        index: 'goals',
        q: '_id:' + gid
      }, function (error, response) {
        vm.hits2 = response;
      })
      return vm.hits2;
    }

    vm.addGoals = function (g) {
      if (typeof g != 'undefined') {
        if (!(checkExistsGoal(g.id))) {
          client.bulk({
            body: [
              // action description
              {index: {_index: 'goals', _type: 'goal', _id: g.id}},
              {content: g.content, parent: g.parent}
            ]
          }, function (err, resp) {
            getGoals();
          });
        }

        $timeout(function() {
          getGoals();
        }, 10);

      }
    }

    getGoals();
    vm.goal = {};
    function getGoals() {

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

    function showConfirm(gid, ev) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete your goal?')
        .textContent('All of the banks have agreed to forgive you your goal.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Delete')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function () {
        vm.status = true;
        client.delete({
          index: 'goals',
          type: 'goal',
          id: gid
        }, function (error, response) {
          getGoals();
        });
      }, function () {
        vm.status = false;
      });
    };

    vm.deleteGoals = function (gid, ev) {
      showConfirm(gid, ev);
    }
    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    vm.showDialog = function (ev) {
      vm.goal = null;
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
      $mdDialog.show({
          controller: GoalsDialogController,
          controllerAs: 'gdl',
          templateUrl: 'app/goals/goals_editing_dialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        })
        .then(function (answer) {
          vm.goal = answer;
          vm.addGoals(vm.goal);
        }, function () {

        });
    }

  }

  function GoalsDialogController($mdDialog) {
    var vm = this;
    vm.goal = {};
    vm.goal.id = 1;

    vm.hide = function () {
      $mdDialog.hide();
    }

    vm.cancel = function () {
      $mdDialog.cancel();
    }

    vm.create = function (goal) {
      $mdDialog.hide(goal);
    }
  }

})();
