var app = angular.module('invoiceapp',['angularjs-gauge']);

app.controller('InvoiceCtrl',function($scope){
	
  // at start set the invoice to an empty one
  $scope.speed = 10.0;
	$scope.editMode = true;
	$scope.printMode = false;
  /*var vm = this;
  vm.options = {
    type: 'arch',
    cap: 'round',
    size: 300,
    value: 45.3,
    thick: 20,
    label: 'Usage',
    append: 'GB',
    min: 0,
    max: 100,
    foregroundColor: 'rgba(0, 150, 136, 1)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  };

  vm.thresholds = {
    '0': {color: 'green'},
    '8': {color: "orange"},
    '20': {color: 'yellow'},
    '30': {color: 'coral'},
    '80': {color: 'red'}
  }
  vm.empty = {};
*/
  const { spawn } = require('child_process');
    const seqgen = spawn('/Users/yunusdawji/electron/seqgen/build/genqode/Debug/SeqGen', ["-s", "l", "-m", "/Users/yunusdawji/electron/seqgen/data/raw"]);
    
    seqgen.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    seqgen.stderr.on('data', (data) => {  
      if(data.includes("iseq.cpp:165")){
        var splitdata = data.toString().split(' ');
        var value = splitdata[splitdata.length-2];
        console.log(`stderr: ${value}`);
        $scope.speed = value;
        //vm.options.value = value;
        $scope.changeValue();
        $scope.$apply();
        //var tamp = document.getElementById("speedmeter").getAttribute("value");
        //document.getElementById("speedmeter").setAttribute("value",value); 
        //document.getElementById("speedmeter").
      }
    });
    
    seqgen.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

  $scope.color = "#ff0000";
  $scope.changeValue = function() {
  }

  $scope.threshold = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };

//function mainController() {


});
