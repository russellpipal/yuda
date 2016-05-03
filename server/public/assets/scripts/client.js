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
    .when('/loginView', {
      templateUrl: 'assets/views/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .when('/successView', {
      templateUrl: 'assets/views/success.html',
      controller: 'SuccessController',
      controllerAs: 'success'
    })
    .when('/failureView', {
      templateUrl: 'assets/views/failure.html',
      controller: 'FailureController',
      controllerAs: 'failure'
    })
    $locationProvider.html5Mode(true);
}]);

app.controller('YudaController', function(){

});

app.controller('RegisterController', function($http){
  var register = this;
  register.addUser = function(){
    console.log('addUser called');
    $http.post('/register', {
      username: register.username,
      password: register.password
    });
  };
});

app.controller('NewGoalController', function($http){
  var newGoal = this;
  var today = new Date();
  newGoal.minDate = today;
  newGoal.addGoal = function(){
    console.log('addGoal called');
    $http.post('/addGoal', {
      goal_name: newGoal.name,
      goal_desc: newGoal.description,
      starting_date: today,
      ending_date: newGoal.date,
    });
  };
});

app.controller('LoginController', function($http, $location){
  var login = this;
  login.loginUser = function(){
    $http.post('/login', {
      username: login.username,
      password: login.password
    }).then(function(response){
      console.log(response);
      if (response.data == 'OK') {
        $location.path('/successView');
      } else {
        $location.path('/failureView');
      }
    });
  };
});

app.controller('SuccessController', function($timeout, $location){
  $timeout(2000);
  $location.path('/newGoal');
});

app.controller('FailureController', function(){

});
