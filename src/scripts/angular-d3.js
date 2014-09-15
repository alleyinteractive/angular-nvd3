'use strict';

angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
      var d = $q.defer();

      d.resolve(window.d3);

      return {
        d3: function() { return d.promise; }
      };
    }]
  );