var oApp = angular.module('DOBModule', []);

oApp.controller('DOBController', function($scope, DOBService) {

  $scope.calcDays = DOBService.getDays(); 
  $scope.calcMonths = DOBService.getMonths();
  $scope.calcYears = DOBService.getYears();
  $scope.selectedDay = 0; $scope.selectedMonth = 0;

  /*Hack to remove default '?' in select dropdowns*/
  $scope.dob = {dayDefault: {name: "Day", value: "0"},
                monthDefault: {name: "Month", value: "0"},
                yearDefault: {name: "Year", value: "0"},
		collection:{},
                };
 
  $scope.$watch('dob.dayDefault', function (obj) {
    if(obj){
      $scope.selectedDay = obj.name;
      $scope.dob.monthDefault = {name: "Month", value: "0"};
      $scope.dob.yearDefault = {name: "Year", value: "0"};
      DOBService.changeDay(obj.name, function(err, result) {
         $scope.calcMonths = DOBService.getMonths(result);
      });
    }
  });
  $scope.$watch('dob.monthDefault', function (obj) {
    if(obj){
      $scope.dob.yearDefault = {name: "Year", value: "0"};
      $scope.selectedMonth = obj.name;
      DOBService.changeMonth({"day":$scope.selectedDay, "month":obj.value}, function(err, result) {
         $scope.calcYears = DOBService.getYears(result);
      });
    }
  });
  $scope.$watchCollection('[dob.dayDefault, dob.monthDefault, dob.yearDefault]', function(newValues, oldValues){
    $scope.dob.collection = newValues[0].value+'/'+newValues[1].value+"/"+newValues[2].value;
    console.log($scope.dob.collection);
  });
});

oApp.$inject = ['$scope', 'DOBService'];

oApp.factory('DOBService', function() {
    var minimumAge = 18;var maximumAge = 35;
    var dob = { dayDefault: {name: "Day", value: "0"},
                monthDefault: {name: "Month", value: "0"},
                yearDefault: {name: "Year", value: "0"}
    };
    var factory = {
        getDays: function(){
     	  days = [{name: "Day", value: "0"}];
    	  for(i=1;i<=31;i++){
      	      if(i<=9){
                var val = '0' + i;
      	      } else {
                var val = i;
      	      }
      	      days.push({name: i, value:i});
    	  }
    	  return days;
  	},
	getMonths: function(data){
	  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	  months = [{name: "Month", value: "0"}];
	  for(i=1;i<=12;i++){
      	    if(i<=9){
              var val = '0' + i;
      	    } else {
              var val = i;
      	    }
      	    months.push({name: monthNames[i - 1], value:val});
    	  }
    	  if(data){
      	    var n = data.length;
      	    for(j=n-1;j>=0;j--){
              months.splice(parseInt(data[j]), 1);
      	    }
    	  }
    	  return months;
  	},
	getYears: function(data){
    	  years = [{name: "Year", value: "0"}];
    	  var date = new Date();
    	  var year = date.getFullYear();
    	  var start = year - minimumAge;
    	  var count = start - maximumAge;
    	  for(i=start;i>=count;i--){
      	    years.push({name: i, value:i});
    	  }
          if(data){
            var n = data.length;
            for(j=n-1;j>=0;j--){
              years.splice(parseInt(data[j]), 1);
            }
          }
    	  return years;
  	},
        changeDay: function(value, done) {
	    data = [];
	    if(value >=1 && value <=29){
	      data = [];
	    }else if(value == 30){
	      data = ['02'];
	    }else if(value == 31){
	      data = ['02', '04', '06', '09', '11'];
	    }
            done(null, data);
        },
	changeMonth: function(obj, done) {
            data = [];
            if(obj.day ==29 && obj.month == '02'){
              var years = factory.getYears();
	      var index = 0;
	      for(var item in years){
                var leap = !((years[item].value % 4) || (!(years[item].value % 100) && (years[item].value % 400)));
                if(leap===false){
  		  data.push(index); 
	        }
		index++;
              }
            }
            done(null, data);
        }
    }
    return factory;
});
