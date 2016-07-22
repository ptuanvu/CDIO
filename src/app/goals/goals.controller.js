(function () {
  'use strict';

  angular
    .module('cdio')
    .controller('GoalsController', GoalsController)
    .controller('GoalsDialogController', GoalsDialogController);

  /** @ngInject */
  function GoalsController($log, $q, $mdMedia, $mdDialog, goalsElasticsearch, $scope) {
    var vm = this;
    //var elasticsearch = require('elasticsearch');
    var client = elasticsearch.Client();
    vm.goals = [];

    vm.simulateQuery = false;
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;

    function querySearch (query) {
      if (query == '' || query == null || typeof query == 'undefined') {
        return [];
      }else {
        var deferred = $q.defer();
        goalsElasticsearch.searchByName(query).then(function (resp) {
          deferred.resolve(resp.map( function (item) {
            return {
              value: item,
              display: item._source.content
            };
          }));
        });
        return deferred.promise;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      vm.showDialog(item.value);

    }

    function checkExistsGoal(gid) {
      return goalsElasticsearch.checkGoal(gid).then(function (data) {
        vm.goalsk2 = data;
        return vm.goalsk2;
      });
    }

    vm.addGoals = function (g) {
      if (typeof g != 'undefined') {
        return goalsElasticsearch.addGoal(g).then(function (data) {
          console.log('Get Done');
          getGoals();
          return data;
        });

      }
    }
    vm.goalsk = [];
    vm.goal = {};

    vm.refresh = function () {
      getGoals();
    }
    //getGoals();
    function getGoals() {
      console.log('Get Goals Start');
      //vm.goalsk = [];
      goalsElasticsearch.getAllGoals().then(function (data) {
        vm.goalsk = data;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        console.log('Get Goals End');
        console.log(vm.goalsk);
      });
    }


    vm.page = 1;
    vm.size = 10;
    vm.total = 0;

    vm.listGoals = function (offset, size) {
      console.log('List Goals Start - offset: ' + offset + '- size: ' + size);
      //vm.goalsk = [];
      goalsElasticsearch.listGoals(offset, size).then(function (data) {
        vm.goalsk = data.hits;
        vm.total = data.total;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        console.log(vm.goalsk);
        console.log('List Goals End');
      });
    }

    vm.listGoals(vm.page - 1, vm.size);
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
        goalsElasticsearch.deleteGoal(gid).then(function (data) {
          console.log('Delete Done');
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

    vm.showDialog = function (g, ev) {
      vm.goal = null;
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
      $mdDialog.show({
          controller: GoalsDialogController,
          controllerAs: 'gdl',
          templateUrl: 'app/goals/goals_editing_dialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          resolve: {
            curGoal: function () {
              return g;
            }
          },
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        })
        .then(function (answer) {
          vm.goal = answer;
          getGoals();
        }, function () {

        });
    }

  }

  function GoalsDialogController($mdDialog, curGoal, goalsElasticsearch) {
    var vm = this;
    vm.goal = {};
    vm.goal.id = 'G1';
    var isupdate = false;
    if (typeof curGoal != 'undefined') {
      vm.goal.id = curGoal._id;
      vm.goal.parent = curGoal._source.parent;
      vm.goal.content = curGoal._source.content;
      isupdate = true;
    }

    vm.hide = function () {
      $mdDialog.hide();
    }

    vm.cancel = function () {
      $mdDialog.cancel();
    }

    vm.create = function (goal) {
      if (isupdate) {
        goalsElasticsearch.updateGoal(goal).then(function (data) {
          $mdDialog.hide(goal);
        });
      } else {
        goalsElasticsearch.addGoal(goal).then(function (data) {
          $mdDialog.hide(goal);
        });
      }

    }
  }

})();
