'use strict';

angular
  .module('angular-nvd3', []);

angular.module('angular-nvd3')
  .directive('nvd3-render',
    function(loader) {

      return {
        template: '{{output}}',
        restrict: 'AE',
        scope: {
          docKey: '@',
          docData: '@?',
          docRetrieve: '@?',
        },
        link: function postLink(scope) {

        }
      };
    }
  );