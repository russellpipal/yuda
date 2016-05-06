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
    .when('/friendsView', {
      templateUrl: 'assets/views/friends.html',
      controller: 'FriendsController',
      controllerAs: 'friends'
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
      ending_date: newGoal.date
    }).then(function(response){
      if (newGoal.selectedUsers.length > 0) {
        $http.post('/addGoal/friends', {
          friends: newGoal.selectedUsers,
          goal_id: response.data.id
        });
        newGoal.selectedUsers = [];
      }
    }, function(response){
      console.log('err', response);
    });
  };


  newGoal.getUsers = function(){
    $http.get('addGoal/users').then(function(response){
      newGoal.users = response.data;
    });
  };

  newGoal.getMatches = function(text){
    text = text.toLowerCase();
    var ret = newGoal.users.filter(function(d){
      return d.username.startsWith(text);
    });
    return ret;
  };
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

app.controller('FriendsController', function($http){
  var friends = this;
  friends.goals = [];
  friends.getFriendsGoals = function(){
    $http.get('/friends').then(function(response){
      // console.log('response.data', response.data);
      // friends.goals = response.data;
      // console.log(friends.goals);
      for(var i=0; i<response.data.length; i++){
        friends.goals.push(response.data[i]);
      }
      console.log(friends.goals);
    });
  };
  friends.getFriendsGoals();
});

app.controller('SuccessController', function($timeout, $location){
  $timeout(2000);
  $location.path('/newGoal');
});

app.controller('FailureController', function(){

});
