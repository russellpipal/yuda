// var app = angular.module('yudaApp', ['ngRoute', 'ngMaterial']);
var app = angular.module('yudaApp', ['ngMaterial', 'ngRoute', 'smart-table'])
.config(function($mdThemingProvider){
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('brown');
});

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

app.controller('ToolbarController', function($http, $location){
  var toolbar = this;
  toolbar.logout = function(){
    $http.post('/logout').then(function(){
      $location.path('/');
    })
  };
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
  // var todayMoment = moment(today).format("MMM-DD-YYYY");
  // console.log('todaymoment', todayMoment);

  newGoal.addGoal = function(){
    $http.post('/addGoal', {
      goal_name: newGoal.name,
      goal_desc: newGoal.description,
      starting_date: today,
      ending_date: new Date(newGoal.date)
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
      newGoal.addGoal();
    }, function(){});
  };

  newGoal.getUsers = function(){
    $http.get('addGoal/users').then(function(response){
      newGoal.users = response.data;
    });
  };

  newGoal.getMatches = function(text){
    text = text.toLowerCase();
    var ret = newGoal.users.filter(function(d){
      return d.username.toLowerCase().startsWith(text);
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
  myGoals.displayedClosedGoals = [];
  myGoals.getMyGoals = function(){
    myGoals.openGoals = [];
    myGoals.closedGoals = [];
    var goals = [];
    var today = new Date();
    $http.get('/myGoals').then(function(response){
      goals = response.data;
      for (var i=0; i<goals.length; i++){
        goals[i].prettyStart = moment(goals[i].starting_date).format('MMM-DD-YYYY');
        if (goals[i].completed_date){
          goals[i].completed = true;
          goals[i].prettyEnd = moment(goals[i].ending_date).format('MMM-DD-YYYY');
          goals[i].prettyComplete = moment(goals[i].completed_date).format('MMM-DD-YYYY');
          myGoals.closedGoals.push(goals[i]);
        } else {
          goals[i].ending_date = new Date(goals[i].ending_date);
          if (goals[i].ending_date > today) {
            goals[i].prettyEnd = moment(goals[i].ending_date).fromNow();
            myGoals.openGoals.push(goals[i]);
          } else {
            goals[i].completed = false;
            goals[i].prettyEnd = moment(goals[i].ending_date).format('MMM-DD-YYYY')
            myGoals.closedGoals.push(goals[i]);
          }
        }
      }
    });

  };
  myGoals.getMyGoals();

  myGoals.markComplete = function(goal){
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
      myGoals.markComplete(goal);
    }, function(){});
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

app.controller('FriendsController', function($http, $mdDialog){
  var friends = this;
  friends.displayedUnviewedGoals = [];
  friends.displayedViewedGoals = [];

  friends.getFriendsGoals = function(){
    $http.get('/friends').then(function(response){
      var today = new Date();
      var goals = response.data;
      friends.viewedGoals = [];
      friends.unviewedGoals = [];
      for(var i=0; i<goals.length; i++){
        goals[i].prettyStart = moment(goals[i].starting_date).format('MMM DD YYYY');
        if(goals[i].completed_date){
          goals[i].completed = true;
          goals[i].prettyComplete = moment(goals[i].completed_date).format('MMM DD YYYY');
          goals[i].prettyEnd = moment(goals[i].ending_date).format('MMM DD YYYY');
        } else {
          if (new Date(goals[i].ending_date) < today) {
            goals[i].failed = true;
            goals[i].prettyEnd = moment(goals[i].ending_date).format('MMM DD YYYY');
          } else {
            goals[i].open = true;
            goals[i].prettyEnd = moment(goals[i].ending_date).fromNow();
          }
        }
        if(goals[i].viewed){
          friends.viewedGoals.push(goals[i]);
        } else {
          friends.unviewedGoals.push(goals[i]);
        }
      }
    });
  };

  friends.markViewed = function(goal){
    $http.put('/friends/markViewed', goal).then(friends.getFriendsGoals);
  };

  friends.showDetails = function(ev, goal){
    $mdDialog.show(
      $mdDialog.alert()
      .clickOutsideToClose(true)
      .title('Goal Details')
      .textContent(goal.goal_desc)
      .ok('OK')
      .targetEvent(ev)
    );
  };

  friends.getFriendsGoals();
});

app.controller('SuccessController', function($timeout, $location){
  $timeout($location.path('/myGoalsView'), 10000);
});

app.controller('FailureController', function(){

});
