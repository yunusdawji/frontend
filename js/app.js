var app = angular.module('invoiceapp',['angularjs-gauge']);

app.controller('InvoiceCtrl',function($scope){
	
  // at start set the invoice to an empty one
  $scope.speed = 10.0;
	$scope.editMode = true;
	$scope.printMode = false;


$scope.color = "#ff0000";
$scope.changeValue = function() {
  $scope.speed = 10+$scope.speed;
}

$scope.threshold = {
  '0': {color: 'green'},
  '40': {color: 'orange'},
  '75.5': {color: 'red'}
};
});