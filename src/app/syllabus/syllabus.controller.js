(function() {
  'use strict';

  angular
    .module('cdio')
    .controller('SyllabusController', SyllabusController);

  /** @ngInject */
  function SyllabusController(syllabusElasticsearch, $scope, $mdDialog, $q ) {
    var vm = this;
    vm.syllabuses = [];

    //Pagination
    vm.page = 1;
    vm.size = 10;
    vm.total = 0;

    vm.simulateQuery = false;
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;

    active();
    function active() {
      listAllSyllabuses(vm.page - 1, vm.size);
    }

    function listAllSyllabuses(offset, size) {
      console.log('listAllSyllabuses start ' + offset + ' - ' + size);
      syllabusElasticsearch.listSyllabuses(offset, size).then(function(resp){
        vm.syllabuses = resp.hits;
        vm.total = resp.total;

        if (!$scope.$$phase) {
          $scope.$apply();
        }
        console.log('listAllSyllabuses end ');
      });
    }

    vm.deleteSyllabus = function(sid, ev) {
      showConfirm(sid, ev).then(function(resp) {
        vm.refresh();
      });
    }

    vm.refresh = function () {
      listAllSyllabuses(vm.page - 1, vm.size);
    }

    function showConfirm(sid, ev) {
      var defered = $q.defer();
      var confirm = $mdDialog.confirm()
        .title('Bạn có muốn xóa học phần này?')
        .textContent('Tất cả dữ liệu về học phần sẽ biến mất.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Xóa')
        .cancel('Hủy bỏ');
      $mdDialog.show(confirm).then(function () {
        vm.status = true;
        syllabusElasticsearch.deleteSyllabus(sid).then(function (resp) {
          console.log('Delete Done');
          defered.resolve(resp);
        });
      }, function () {
        vm.status = false;
        defered.reject();
      });
      return defered.promise;
    };

    //Search box operation
    function querySearch (query) {
      console.log('search start');
      if (query == '' || query == null || typeof query == 'undefined') {
        return [];
      }else {
        var deferred = $q.defer();
        syllabusElasticsearch.searchSyllabus(query).then(function (resp) {
          console.log(JSON.stringify(resp));
          deferred.resolve(resp.map( function (item) {
            return {
              value: item,
              display: item._source.syllabus_name
            };
          }));
        });
        return deferred.promise;
      }
    }

    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
     // vm.showDialog(item.value);
    }

  }
})();
