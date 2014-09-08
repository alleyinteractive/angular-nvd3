'use strict';

angular
  .module('angularNvd3', ['d3']);

/**
 * Loads the nvd3 minified js
 */
angular.module('angularNvd3')
  .factory('nvd3Service', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
      var d = $q.defer();
      /**
       * Load client in the browser
       */
      function onScriptLoad() {
        $rootScope.$apply(function() { d.resolve(window.nv); });
      }

      /**
       * Create a tag with d3 as the source can call onScriptLoad() when it's been loaded;
       */
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

      return {
        nvd3: function() { return d.promise; }
      };
    }]
  ); // end nvd3Service

/**
 * Directive for linechart render
 */
angular.module('angularNvd3')
  .directive('linechartRender', [ 'd3Service', 'nvd3Service',
    function(d3Service, nvd3Service) {
      var linechart = {
        template: '<svg></svg>',
        restrict: 'AE',
        scope: {
          data: '@',      // chart data, [required]
          options: '@?',  // chart options, according to nvd3 core api, [optional]
          api: '@?',      // directive global api, [optional]
          events: '@?',   // global events taht directive would subscribe to, [optional]
          config: '@?',   // global directive configuration, [optional]
        },
        controller: ['$scope', '$http', function($scope, $http) {

        }],
        link: function(scope, elem, attr) {
          /**
           * Default Configurations
           */
          var defaultConfig = {
            extended: false,
            visible: true,
            disabled: false,
            autorefresh: true,
            refreshDataOnly: false
          };

          /**
           * Default Options
           */
          var defaultOptions = {
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 30
            }
          };

          /**
           * Setup defaults
           */
          scope._config = angular.extend(defaultConfig, scope.config);
          scope._options = angular.extend(defaultOptions, scope.options);

          /**
           * Promise to run if library files load
           */
          d3Service.d3().then(function(d3) {
            console.log(d3);
            nvd3Service.nvd3().then(function(nv) {
              console.log(nv);
            });
          });

          scope.output = 'Si';

        }
      };

      return linechart;
    } // End linechartRender
  ]);