'use strict';

angular.module('d3', [])
  .factory('d3Service', ['$document', '$q',
    function($document, $q) {
      var d = $q.defer();

      d.resolve(window.d3);

      return {
        d3: function() {
            return d.promise;
        }
      };
    }]
  );