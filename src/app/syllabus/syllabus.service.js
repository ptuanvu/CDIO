/**
 * Created by monster on 22/07/2016.
 */
(function () {
  'use strict';

  angular
    .module('cdio')
    .factory('syllabusElasticsearch', syllabusElasticsearch);

  function syllabusElasticsearch() {
    var service = {
      listSyllabuses: listSyllabuses,
      getSyllabus: getSyllabus,
      createSyllabus: createSyllabus,
      updateSyllabus: updateSyllabus,
      deleteSyllabus: deleteSyllabus,
      checkSyllabus: checkSyllabus,
      searchSyllabus: searchSyllabus
    };
    return service;

    function listSyllabuses(offset, size) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.search({
        index: 'syllabuses',
        type: 'syllabus',
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

    function getSyllabus(sid) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();

      client.search({
        index: 'syllabuses',
        type: 'syllabus',
        q: '_id:' + sid
      }).then(function (resp) {
        var hits = resp.hits.hits;
        deferred.resolve(hits);
      }, function (err) {
        console.trace(err.message);
        deferred.reject(err.message);
      });

      return deferred.promise;
    }

    function createSyllabus(s) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      checkSyllabus(s.id).then(function (resp) {
        console.log(resp);
        if (resp == false) {
          client.bulk({
            body: [
              {index: {_index: 'syllabuses', _type: 'syllabus', _id: s.id}},
              {assessment_list: s.assessment_list, goal_list: s.goal_list, syllabus_name: s.syllabus_name}
            ]
          }).then(function (data) {
            console.log('Adding syllabus ok');
            deferred.resolve(data);
          }, function (err) {
            console.log('Adding syllabus err');
            deferred.reject(err.message);
          });
        }
      });
      return deferred.promise;
    }


    function updateSyllabus(s) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      client.bulk({
        body: [
          {index: {_index: 'syllabuses', _type: 'syllabus', _id: s.id}},
          {assessment_list: s.assessment_list, goal_list: s.goal_list, syllabus_name: s.syllabus_name}
        ]
      }).then(function (data) {
        console.log('Updating updateSyllabus ok');
        deferred.resolve(data);
      }, function (err) {
        console.log('Updating updateSyllabus err');
        deferred.reject(err.message);
      });
      return deferred.promise;
    }

    function deleteSyllabus(sid) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      checkGoal(sid).then(function (resp) {
        if (resp == true) {
          client.delete({
            index: 'syllabuses',
            type: 'syllabus',
            id: sid
          }).then(function (data) {
            deferred.resolve(data);
            console.log('Done deleteSyllabus Goal');
          }, function (err) {
            console.log('Error deleteSyllabus Goal');
            console.trace(err.message);
            deferred.reject(err.message);
          });
        }
      });
      return deferred.promise;
    }


    function checkSyllabus(sid) {
      var deferred = $q.defer();
      var client = elasticsearch.Client();
      client.searchExists({
        index: 'syllabuses',
        q: '_id:' + sid,
        method: 'GET'
      }).then(function (resp) {
        console.log('checkSyllabus OK');
        deferred.resolve(resp.exists);
      }, function (err) {
        console.log('checkSyllabus NO');
        deferred.resolve(false);
      });

      return deferred.promise;
    }

    function searchSyllabus(name) {
      var client = elasticsearch.Client();
      var deferred = $q.defer();
      console.log('searchSyllabus: ' + name);
      client.search({
        index: 'syllabuses',
        type: 'syllabus',
        q: 'syllabus_name:' + name
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


  }

})();
