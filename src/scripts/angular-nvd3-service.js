'use strict';

// Loads the nvd3 minified js
angular.module('angularNvd3')
  .factory('nvd3Service', ['$document', '$q', '$rootScope' , 'd3Service',
    function($document, $q, $rootScope, d3Service) {

      var d = $q.defer();

      d3Service.d3().then(function(d3) {
        // Load client in the browser
        function onScriptLoad() {
          $rootScope.$apply(function() {
            d.resolve({
              nv: window.nv,
              d3: d3
            });
          });
        }

        // Create a tag with nvd3 as the source can call onScriptLoad() when it's been loaded;
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js';
        scriptTag.onreadystagechange = function() {
          if (this.readyState === 'complete') {
            onScriptLoad();
          }
        };

        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

      });
      return {
        nvd3: function() { return d.promise; }
      };
    }]
  ) // end nvd3Service

  .service('nvd3Cleaner', [
    function() {

      // Flags for service
      this.percent = null;
      this.currency = null;

      /**
       * Check if data is a percent, if it is, it will
       * parse the data out and set the percent flag
       * @param  {string} data [string to check]
       * @return {float}      [number parsed out of string]
       */
      this.percentCheck = function(data) {

      };

      /**
       * Check if data is currency, if it is, it will
       * parse the data out and set the percent flag
       * @param  {string} data [string to check]
       * @return {float}      [number parsed out of string]
       */
      this.currency = function(data) {

      };

    }]
  );