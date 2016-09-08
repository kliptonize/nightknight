//initiate ALL controllers, directives and factories!
var nkControllers = angular.module('nk.controllers', []);
var nkDirectives = angular.module('nk.directives', []);
var nkFactories = angular.module('nk.factories', []);

var nkApp = angular.module('nk', [
  "nk.controllers",
  "nk.directives",
  "nk.factories",
  "ui.router"
]);

