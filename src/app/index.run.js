(function() {
  'use strict';

  angular
    .module('cdio')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
