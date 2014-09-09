'use strict';

describe('Module: Angular-NVD3', function () {

  var $compile,
      $rootScope;

  beforeEach(module('angularNvd3'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Fails on no data', function() {
    var element = $compile('<chart-render data="" options=""></chart-render>')($rootScope);

    $rootScope.$digest();
    expect(element.html()).to.eql('<svg></svg>');
    // @@TODO: Add Error states
  });


});
