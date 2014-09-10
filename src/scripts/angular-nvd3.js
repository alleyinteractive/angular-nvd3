'use strict';

angular
  .module('angularNvd3', ['d3']);

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
  ); // end nvd3Service

// Directive for nvd3 render
angular.module('angularNvd3')
  .directive('chartRender', ['nvd3Service',
    function(nvd3Service) {

      // Usage Functions
      var chartRender = {
        template: '<svg></svg>',
        restrict: 'AE',
        scope: {
          data: '=',      // chart data, [required]
          options: '=?',  // chart options, according to nvd3 core api, [optional]
          api: '=?',      // directive global api, [optional]
          events: '=?',   // global events taht directive would subscribe to, [optional]
          config: '=?',   // global directive configuration, [optional]
        },
        link: function(scope, element) {
          if (scope.data === undefined) {
            throw Error('No data attribute on angular-nvd3');
          }

          // Promise to run if library files load
          nvd3Service.nvd3().then(function(nvd3) {
            // Set Vars
            var d3 = nvd3.d3,
                nv = nvd3.nv;

            // Default Configurations
            var defaultConfig = {
              extended: false,
              visible: true,
              disabled: false,
              autorefresh: true,
              refreshDataOnly: false
            };

            // Default Options
            var defaultOptions = {
              chart: {
                type: 'lines',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function(d) { return d.label; },
                y: function(d) { return d.value; },
                showValues: true,
                valueFormat: function(d) {
                    return d3.format(',.4f')(d);
                },
                tooltips: true,
                /**
                 * Set tooltip contents
                 * @param  {[type]} key   [description]
                 * @param  {number} x     [X-Coordinate]
                 * @param  {number} y     [Y-Coordinate]
                 * @param  {[type]} e     [description]
                 * @param  {[type]} graph [description]
                 * @return {string}       [Tooltip Text]
                 */
                tooltipContent: function(key, x, y) {
                  return '<h4>'+key+'</h4>' + '<p>' + y + ' on ' + x + '</p>';
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 30
                }
              }
            }; //defualtOptions

            // Setup defaults
            scope._config = angular.extend(defaultConfig, scope.config);
            scope.options = (scope.options) ? scope.options : defaultOptions;

            /**
             * Directive global api
             * refresh() - fully refresh directive
             * update() - update chart layout (ex: container resized)
             * updateWithOptions() - update chart with new options
             * updateWithData() - update chart with new data
             * clearElement() - fully remove directive element
             */
            scope.api = {
              refresh: function() {
                scope.api.updateWithOptions(scope.options);
              },

              update: function() {
                scope.chart.update();
              },

              updateWithOptions: function(options) {
                scope.api.clearElement();

                // Exit if options are undefined
                if(angular.isDefined(options) === false) { return false; }

                // Exit if chart is hidden
                if(!scope._config.visible) { return false; }

                // Init chart
                scope.chart = nv.models[options.chart.type]();

                angular.forEach(scope.chart, function(value, key) {

                  if (key === 'options') {}

                  else if (key === 'dispatch') {
                    if (options.chart[key] === undefined || options.chart[key] === null) {
                      if (scope._config.extended) {
                        options.chart[key] = {};
                      }
                    }
                    configureEvents(scope.chart[key], options.chart[key]);
                  }

                  else if ([
                      'lines',
                      'lines1',
                      'lines2',
                      'bars', // TODO: Fix bug in nvd3, nv.models.historicalBar - chart.interactive (false -> _)
                      'bars1',
                      'bars2',
                      'stack1',
                      'stack2',
                      'multibar',
                      'discretebar',
                      'pie',
                      'scatter',
                      'bullet',
                      'sparkline',
                      'legend',
                      'distX',
                      'distY',
                      'xAxis',
                      'x2Axis',
                      'yAxis',
                      'yAxis1',
                      'yAxis2',
                      'y1Axis',
                      'y2Axis',
                      'y3Axis',
                      'y4Axis',
                      'interactiveLayer',
                      'controls'
                  ].indexOf(key) >= 0) {
                    if (options.chart[key] === undefined || options.chart[key] === null) {
                      if (scope._config.extended) {
                        options.chart[key] = {};
                      }
                    }
                    configure(scope.chart[key], options.chart[key], options.chart.type);
                  }

                  else if (// TODO: need to fix bug in nvd3
                    (key ==='clipEdge' && scope.options.chart.type === 'multiBarHorizontalChart') ||
                    (key === 'clipVoronoi' && scope.options.chart.type === 'historicalBarChart') ||
                    (key === 'color' && scope.options.chart.type === 'indentedTreeChart') ||
                    (key === 'defined' && (scope.options.chart.type === 'historicalBarChart' ||
                      scope.options.chart.type === 'cumulativeLineChart' ||
                      scope.options.chart.type === 'lineWithFisheyeChart')) ||
                    (key === 'forceX' && (scope.options.chart.type === 'multiBarChart' ||
                      scope.options.chart.type === 'discreteBarChart' ||
                      scope.options.chart.type === 'multiBarHorizontalChart')) ||
                    (key === 'interpolate' && scope.options.chart.type === 'historicalBarChart') ||
                    (key === 'isArea' && scope.options.chart.type === 'historicalBarChart') ||
                    (key === 'size' && scope.options.chart.type === 'historicalBarChart') ||
                    (key === 'stacked' && scope.options.chart.type === 'stackedAreaChart') ||
                    (key === 'values' && scope.options.chart.type === 'pieChart') ||
                    (key === 'xScale' && scope.options.chart.type === 'scatterChart') ||
                    (key === 'yScale' && scope.options.chart.type === 'scatterChart') ||
                    (key === 'x' && (scope.options.chart.type === 'lineWithFocusChart' ||
                      scope.options.chart.type === 'multiChart')) ||
                    (key === 'y' && scope.options.chart.type === 'lineWithFocusChart' ||
                      scope.options.chart.type === 'multiChart')
                  ) {}

                  else if (scope.options.chart[key] === undefined || scope.options.chart[key] === null) {
                    if (scope._config.extended) {
                      scope.options.chart[key] = value();
                    }
                  }

                  else {
                    scope.chart[key](scope.options.chart[key]);
                  }
                });

                // Update with data
                scope.api.updateWithData(scope.data);

                // Configure wrappers
                if (scope.options.title || scope._config.extended) {
                  configureWrapper('title');
                }
                if (scope.options.subtitle || scope._config.extended) {
                  configureWrapper('subtitle');
                }
                if (scope.options.caption || scope._config.extended) {
                  configureWrapper('caption');
                }

                // Configure styles
                if (scope.options.styles || scope._config.extended) {
                  configureStyles();
                }

                nv.addGraph(function() {
                  // Update the chart when window resizes
                  nv.utils.windowResize(function() {
                    scope.chart.update();
                  });
                  return scope.chart;
                }, scope.options.chart.callback);
              }, //updateWithOptions()

              updateWithData: function(data) {
                if (data) {
                  scope.options.chart.transitionDuration = parseInt(scope.options.chart.transitionDuration, 10) || 250;
                  // remove whole svg element with old data
                  d3.select(element[0]).select('svg').remove();

                  // Select the current element to add <svg> element and to render the chart in
                  d3.select(element[0]).append('svg')
                    .attr('height', scope.options.chart.height)
                    .attr('width', scope.options.chart.width)
                    .datum(data)
                    .transition().duration(scope.options.chart.transitionDuration)
                    .call(scope.chart);

                  // Set up svg height and width. It is important for all browsers...
                  d3.select(element[0]).select('svg')[0][0].style.height = scope.options.chart.height + 'px';
                  d3.select(element[0]).select('svg')[0][0].style.width = scope.options.chart.width + 'px';
                  if (scope.options.chart.type === 'multiChart') {
                    // multiChart is not automatically updated
                    scope.chart.update();
                  }
                }
              }, //updateWithData()

              clearElement: function() {
                element.find('.title').remove();
                element.find('.subtitle').remove();
                element.find('.caption').remove();
                element.empty();
                scope.chart = null;
              }
            }; //scope.api

            // Configure the chart model with the passed options
            function configure(chart, options, chartType) {
              if (chart && options) {
                angular.forEach(chart, function(value, key) {
                  if (key === 'dispatch') {
                    if (options[key] === undefined || options[key] === null) {
                      if (scope._config.extended) {
                        options[key] = {};
                      }
                    }
                    configureEvents(value, options[key]);
                  }
                  else if (//TODO: need to fix bug in nvd3
                    (key === 'xScale' && chartType === 'scatterChart') ||
                    (key === 'yScale' && chartType === 'scatterChart') ||
                    (key === 'values' && chartType === 'pieChart')) {}

                  else if (['scatter','defined','options','axis','rangeBand','rangeBands']
                    .indexOf(key) < 0) {
                      if (options[key] === undefined || options[key] === null) {
                        if (scope._config.extended) {
                          options[key] = value();
                        }
                      }
                      else {
                        chart[key](options[key]);
                      }
                    }
                });
              }
            } // configure()

            /**
             * Subscribe to the chart events (contained in 'dispatch')
             * and pass eventHandler functions in the 'options' parameter
             */
            function configureEvents(dispatch, options) {
              if (dispatch && options) {
                angular.forEach(dispatch, function(value, key) {
                  if (options[key] === undefined || options[key] === null) {
                    if (scope._config.extended) {
                      options[key] = value.on;
                    }
                  }
                  else {
                    dispatch.on(key + '._', options[key]);
                  }
                });
              }
            } // configureEvents()

            /**
             * Configure 'title', 'subtitle', 'caption'.
             * nvd3 has no sufficient models for it yet.
             */
            function configureWrapper(name) {
                var _ = extendDeep(defaultWrapper(name), scope.options[name] || {});

                if (scope._config.extended) {
                  scope.options[name] = _;
                }

                var wrapElement = angular.element('<div></div>').html(_.html || '')
                  .addClass(name).addClass(_.class)
                  .removeAttr('style')
                  .css(_.css);

                if (!_.html) {
                  wrapElement.text(_.text);
                }

                if (_.enable) {
                  if (name === 'title') {
                    element.prepend(wrapElement);
                  }
                  else if (name === 'subtitle') {
                    element.find('.title').after(wrapElement);
                  }
                  else if (name === 'caption') {
                    element.append(wrapElement);
                  }
                }
            } // configureWrapper()

            // Add some styles to the whole directive element
            function configureStyles() {
              var _ = extendDeep(defaultStyles(), scope.options.styles || {});

              if (scope._config.extended) {
                scope.options.styles = _;
              }

              angular.forEach(_.classes, function(value, key) {
                if(value) {
                  element.addClass(key);
                } else {
                 element.removeClass(key);
                }
              });

              element.removeAttr('style').css(_.css);
            } // configureStyles()

            // Default values for 'title', 'subtitle', 'caption'
            function defaultWrapper(_) {
              switch (_) {
                case 'title': return {
                  enable: false,
                  text: 'Write Your Title',
                  class: 'h4',
                  css: {
                    width: scope.options.chart.width + 'px',
                    textAlign: 'center'
                  }
                };
                case 'subtitle': return {
                  enable: false,
                  text: 'Write Your Subtitle',
                  css: {
                    width: scope.options.chart.width + 'px',
                    textAlign: 'center'
                  }
                };
                case 'caption': return {
                  enable: false,
                  text: 'Figure 1. Write Your Caption text.',
                  css: {
                    width: scope.options.chart.width + 'px',
                    textAlign: 'center'
                  }
                };
              }
            } // defaultWrapper()

            // Default values for styles
            function defaultStyles() {
              return {
                classes: {
                  'with-3d-shadow': true,
                  'with-transitions': true,
                  'gallery': false
                },
                css: {}
              };
            } // defaultStyles()

            // Deep Extend json object
            function extendDeep(dst) {
              angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                  angular.forEach(obj, function(value, key) {
                    if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                      extendDeep(dst[key], value);
                    } else {
                      dst[key] = value;
                    }
                  });
                }
              });
              return dst;
            } // extendDeep()

            // Watching on options, data, config changing
            scope.$watch('options', function(){
              if (!scope._config.disabled && scope._config.autorefresh) {
                scope.api.refresh();
              }
            }, true);
            scope.$watch('data', function(){
              if (!scope._config.disabled && scope._config.autorefresh) {

                // if wanted to refresh data only, use chart.update method, otherwise use full refresh.
                if(scope._config.refreshDataOnly) {
                  scope.chart.update();
                } else {
                  scope.api.refresh();
                }
              }
            }, true);
            scope.$watch('config', function(config){
              scope._config = angular.extend(defaultConfig, config);
              scope.api.refresh();
            }, true);

            //subscribe on global events
            angular.forEach(scope.events, function(eventHandler, event){
              scope.$on(event, function(e){
                  return eventHandler(e, scope);
              });
            });

          });//.nvd3().then()
        }
      };

      return chartRender;
    } // End linechartRender
  ]);