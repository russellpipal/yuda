// var app = angular.module('yudaApp', ['ngRoute', 'ngMaterial']);
var app = angular.module('yudaApp', ['ngMaterial', 'ngRoute', 'smart-table']);

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

app.controller('NewGoalController', function($http, $mdDialog){
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

  newGoal.showAddGoal = function(ev){
    var confirm = $mdDialog.confirm()
      .title('Really add this goal?')
      .textContent('Once added, it cannot be deleted. That\'s the whole point of yuda.')
      .targetEvent(ev)
      .ok('Yes! I\'m going to do it!')
      .cancel('On second thought, no.');
    $mdDialog.show(confirm).then(function(){
      console.log('Confirm add goal');
      newGoal.addGoal();
    }, function(){
      console.log('Cancel add goal');
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

app.controller('MyGoalsController', function($http, $mdDialog){
  var myGoals = this;

  myGoals.displayedGoals = [];
  myGoals.getMyGoals = function(){
    $http.get('/myGoals').then(function(response){
      myGoals.goals = response.data;
    });
  };
  myGoals.getMyGoals();

  myGoals.markComplete = function(goal){
    console.log(goal);
    $http.put('/myGoals/completeGoal', goal).then(myGoals.getMyGoals);
  };

  myGoals.confirmComplete = function(ev, goal){
    var confirm = $mdDialog.confirm()
      .title('Did you really finish the goal?')
      .textContent('Confirm to mark the goal completed. No cheating!')
      .targetEvent(ev)
      .ok('I really did it!')
      .cancel('I guess not.');
    $mdDialog.show(confirm).then(function(){
      console.log('You confirmed', goal);
      myGoals.markComplete(goal);
    }, function(){
      console.log('You denied', goal);
    });
  };

  myGoals.showDetails = function(ev, goal){
    $mdDialog.show(
      $mdDialog.alert()
      .clickOutsideToClose(true)
      .title('Goal Details')
      .textContent(goal.goal_desc)
      .ok('OK')
      .targetEvent(ev)
    );
  };
});

app.controller('FriendsController', function($http){
  var friends = this;
  friends.displayedGoals = [];
  friends.getFriendsGoals = function(){
    $http.get('/friends').then(function(response){
      friends.goals = response.data;
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
