'use strict';

// Loads the nvd3 minified js
angular.module('angularNvd3')
  .factory('nvd3Service', ['$document', '$q' , 'd3Service',
    function($document, $q, d3Service) {

      var d = $q.defer();

      d3Service.d3().then(function(d3) {

        d.resolve({
          nv: window.nv,
          d3: d3
        });

      });
      return {
        nvd3: function() { return d.promise; }
      };
    }]
  );