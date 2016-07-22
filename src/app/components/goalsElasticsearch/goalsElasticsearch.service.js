(function () {
  'use strict';

  angular
    .module('cdio')
    .factory('goalsElasticsearch', goalsElasticsearch);

  function goalsElasticsearch($q) {

    var service = {
      getGoal: getGoal,
      getAllGoals: getAllGoals,
      addGoal: addGoal,
      deleteGoal: deleteGoal,
      checkGoal: checkGoal,
      updateGoal: updateGoal,
      searchByName: searchByName,
      listGoals: listGoals
    }

    return service;

    function getGoal(gid) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.search({
        index: 'goals',
        type: 'goal',
        q: '_id:' + gid
      }).then(function (resp) {

        var hits = resp.hits.hits;
        deferred.resolve(hits);
      }, function (err) {
        console.trace(err.message);
        deferred.reject(err.message);
      });

      return deferred.promise;
    }

    function listGoals(offset, size) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.search({
        index: 'goals',
        type: 'goal',
        from: offset,
        size: size
      }).then(function (resp) {
        var hits = resp.hits;
        deferred.resolve(hits);
      }, function (err) {
        console.trace(err.message);
        deferred.reject(err.message);
      });
      return deferred.promise;
    }

    function getAllGoals() {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.search({
        index: 'goals',
        type: 'goal'
      }).then(function (resp) {
        var hits = resp.hits.hits;
        deferred.resolve(hits);
      }, function (err) {
        console.trace(err.message);
        deferred.reject(err.message);
      });
      return deferred.promise;
    }

    function searchByName(name) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      console.log('Tìm kiếm: ' + name);
      client.search({
        index: 'goals',
        type: 'goal',
        q: 'content:'+name
      }).then(function (resp) {
        var hits = resp.hits.hits;
        deferred.resolve(hits);
        console.log(hits);
      }, function (err) {
        console.trace(err.message);
        deferred.reject(err.message);
      });
      return deferred.promise;
    }

    function addGoal(g) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      checkGoal(g.id).then(function (resp) {
        console.log(resp);
        if (resp == false) {
          client.bulk({
            body: [
              // action description
              {index: {_index: 'goals', _type: 'goal', _id: g.id}},
              {content: g.content, parent: g.parent}
            ]
          }).then(function (data) {
            console.log('Adding item ok');
            deferred.resolve(data);
          }, function (err) {
            console.log('Adding item err');
            deferred.reject(err.message);
          });
        }
      });
      return deferred.promise;
    }

    function updateGoal(g) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.bulk({
        body: [
          // action description
          {index: {_index: 'goals', _type: 'goal', _id: g.id}},
          {content: g.content, parent: g.parent}
        ]
      }).then(function (data) {
        console.log('Updating item ok');
        deferred.resolve(data);
      }, function (err) {
        console.log('Updating item err');
        deferred.reject(err.message);
      });
      return deferred.promise;
    }

    function deleteGoal(gid) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      checkGoal(gid).then(function (resp) {
        if (resp == true) {
          client.delete({
            index: 'goals',
            type: 'goal',
            id: gid
          }).then(function (data) {
            deferred.resolve(data);
            console.log('Done Delete Goal');
          }, function (err) {
            console.log('Error Delete Goal');
            console.trace(err.message);
            deferred.reject(err.message);
          });
        }
      });
      return deferred.promise;
    }

    function checkGoal(gid) {
      var deferred = $q.defer();
      var client = elasticsearch.Client();
      client.searchExists({
        index: 'goals',
        q: '_id:' + gid,
        method: 'GET'
      }).then(function (resp) {
        console.log('OK');
        deferred.resolve(resp.exists);
      }, function (err) {
        console.log('NO');
        deferred.resolve(false);
      });

      return deferred.promise;
    }
  }

})();
