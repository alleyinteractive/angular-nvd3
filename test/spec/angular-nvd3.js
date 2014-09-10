'use strict';

describe('Module: Angular-NVD3', function () {

  var element, scope, compile, defaultData, defaultOptions,
    validTemplate = '<chart-render data="data" options="options"></chart-render>';

  function createDirective(data, options, template) {
    var elm;

    // Setup scope state
    scope.data = data || defaultData;
    scope.options = options || defaultOptions;

    // Create Directive
    elm = compile(template || validTemplate)(scope);

    // Trigger watchers
    scope.$apply();

    return elm;
  }

  beforeEach(function() {

    // Load directive's module
    module('angularNvd3');

    // Reset data each time
    defaultData = [{
      key: 'Cumulative Return',
      values: [
        { 'label' : 'A' , 'value' : -29.765957771107 },
        { 'label' : 'B' , 'value' : 0 },
        { 'label' : 'C' , 'value' : 32.807804682612 },
        { 'label' : 'D' , 'value' : 196.45946739256 },
        { 'label' : 'E' , 'value' : 'NA' },
        { 'label' : 'F' , 'value' : -98.079782601442 },
        { 'label' : 'G' , 'value' : -13.925743130903 },
        { 'label' : 'H' , 'value' : -5.1387322875705 }
      ]
    }];

    // Reset Options
    defaultOptions = {
      chart: {
        type: 'discreteBarChart',
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
        transitionDuration: 500,
        xAxis: {
        axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };

    // Inject in angular constructs
    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });


  it('Fails on no data', function() {
    element = createDirective('');
    expect(element.html()).to.eql('<svg></svg>');
  });

  it('Throws error when data is not defined', function() {
    function invalidTemplate() {
      createDirective(null, null, '<chart-render options="options"></chart-render>');
    }
    expect(invalidTemplate).to.throw();
  });

  it('Success on proper data & options', function() {
    element = createDirective();
    console.log(element);
    expect(element.html()).not.to.eql('<svg></svg>');
    // @@TODO: Add Error states
  });


});
