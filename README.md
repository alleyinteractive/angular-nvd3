angular-nvd3
====================

### Description
This is a angular module to display an NVD3 graph

## Install to install this for development

1. `git clone git@github.com:alleyinteractive/angular-nvd3.git`

2. `cd angular-nvd3`

3. `npm install; bower install;`

4. `grunt serve` for dev, `grunt build` to build for prod

## Usage
Include dist/scripts/angular-nvd3.min.js into your page, this requires that d3 & nvd3 are included before angular-nvd3.min.js

Use the following html to tell the directive where to appear, [data] & [options] is expected to be a javascript object, normally inside of a controller. Please view the example/index.html to see how those two objects look.

```html
     <chart-render data='[data]' options='[options]'></chart-render>
```
