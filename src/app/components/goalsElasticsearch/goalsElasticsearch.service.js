(function () {
  'use strict';

  angular
    .module('cdio')
    .factory('goalsElasticsearch', goalsElasticsearch);

  function goalsElasticsearch() {

    var service = {
      getGoal: getGoal,
      getAllGoals: getAllGoals,
      addGoal: addGoal,
      deleteGoal: deleteGoal,
      checkGoal: checkGoal
    }

    return service;

    function getGoal() {

    }

    function getAllGoals() {

    }

    function addGoal(g) {

    }

    function deleteGoal(gid) {

    }

    function checkGoal(gid) {

    }
  }

})();
