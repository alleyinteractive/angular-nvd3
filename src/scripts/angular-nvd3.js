'use strict';

angular
  .module('angularNvd3', []);

angular.module('angularNvd3')
  .directive('linechartRender', [
    function() {
      var linechart = {
        template: '{{output}}',
        restrict: 'AE',
        scope: {
          linechartData: '@',
          width: '@?',
          height: '@?',
          showXAxis: '@?',
          showYAxis: '@?',
        },
        link: function(scope) {
          // Set defaults if not set
          scope.width = scope.width || 'auto';
          scope.height = scope.height || 'auto';
          scope.showXAxis = scope.showXAxis || true;
          scope.showYAxis = scope.showYAxis || true;

          scope.output = 'balls';

        }
      };

      return linechart;
    }]
  );