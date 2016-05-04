// var app = angular.module('yudaApp', ['ngRoute', 'ngMaterial']);
var app = angular.module('yudaApp', ['ngMaterial', 'ngRoute', 'ngTable']);

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
    .when('/myGoalsView', {
      templateUrl: 'assets/views/myGoals.html',
      controller: 'MyGoalsController',
      controllerAs: 'myGoals'
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
  newGoal.users = [];
  newGoal.selectedUsers = [];
  newGoal.minDate = today;

  newGoal.addGoal = function(){
    $http.post('/addGoal', {
      goal_name: newGoal.name,
      goal_desc: newGoal.description,
      starting_date: today,
      ending_date: newGoal.date,
    });
  };

  newGoal.getUsers = function(){
    $http.get('addGoal/users').then(function(response){
      newGoal.users = response.data;
      console.log(newGoal.users);
    });
  };

  newGoal.getMatches = function(text){
    text = text.toLowerCase();
    console.log('text', text);
    var ret = newGoal.users.filter(function(d){
      // console.log('text in function', text);
      // console.log('d.username', d.username);
      console.log('startswith?', d.username.startsWith(text));
      return d.username.startsWith(text);
    });
    console.log('ret', ret);
    return ret;
  };

  newGoal.transformChip = function(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }
      // Otherwise, create a new one
      return { name: chip, type: 'new' }
  }

  newGoal.getUsers();
});

app.controller('LoginController', function($http, $location){
  var login = this;
  login.loginUser = function(){
    $http.post('/login', {
      username: login.username,
      password: login.password
    }).then(function(response){
      if (response.data == 'OK') {
        $location.path('/successView');
      } else {
        $location.path('/failureView');
      }
    });
  };
});

app.controller('MyGoalsController', function($http){
  var myGoals = this;
  myGoals.goals = [];
  myGoals.getMyGoals = function(){
    $http.get('/myGoals').then(function(response){
      for(var i=0; i<response.data.length; i++){
        myGoals.goals.push(response.data[i]);
      }
      myGoals.tableParams = new NgTableParams({}, {dataset: myGoals.goals});
    });
  };
  myGoals.getMyGoals();
});

app.controller('SuccessController', function($timeout, $location){
  $timeout(2000);
  $location.path('/newGoal');
});

app.controller('FailureController', function(){

});
