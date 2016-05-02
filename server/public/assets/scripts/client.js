// var app = angular.module('yudaApp', ['ngRoute', 'ngMaterial']);
var app = angular.module('yudaApp', ['ngMaterial', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'assets/views/yuda.html',
      controller: 'YudaController',
      controllerAs: 'yuda'
    })
    .when('/registerScreen', {
      templateUrl: 'assets/views/register.html',
      controller: 'RegisterController',
      controllerAs: 'register'
    })
    .when('/newGoal', {
      templateUrl: 'assets/views/newGoal.html',
      controller: 'NewGoalController',
      controllerAs: 'newGoal'
    })

    $locationProvider.html5Mode(true);
}]);

app.controller('YudaController', function(){

});

app.controller('RegisterController', function($http){
  var register = this;
  register.addUser = function(){
    console.log('addUser called');
    $http.post('/register', { username: register.username, password: register.password });
  };
});


// finish this
// app.controller('NewGoalController', function($http){
//   var newGoal = this;
//   newGoal.addGoal = function(){
//     console.log('addGoal called');
//     $http.post('/addGoal', {})
//   }
// })
