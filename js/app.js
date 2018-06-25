const path = require('path')

var app = angular.module('invoiceapp',['angularjs-gauge',"chart.js",'angularUserSettings']);
function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}
app.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#FF5252', '#FF8A80'],
    responsive: true
  });
  // Configure all line charts
  ChartJsProvider.setOptions('line', {
    showLines: true
  });
}]);

app.controller('InvoiceCtrl',function($scope,$userSettings){
  
  
  $scope.labels = [];
  $scope.series = ['Series A'];
  $scope.data = [
  ];
  
  $scope.program = $userSettings.get('program');
  var count = 0;
  $scope.onClick = function (points, evt) {
  console.log(points, evt);
  $userSettings.set('program', $scope.program);

  const { spawn } = require('child_process');
  
  var binarypath = '';
  var inputraw = '';

  // Debug architecture testing stuff
  var os = require('os');
  var is64Bit = os.arch() === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
  console.log(is64Bit ? 64 : 32);


  var osvar = process.platform;

  if (osvar == 'darwin') {
    if(isDev()){
      binarypath = path.join(__dirname,'binary/SeqGen');
      console.log("Mac OS Dev");
      inputraw = path.join(__dirname, 'binary/raw');
    }else{
      binarypath = path.join(__dirname,'../binary/SeqGen');
      inputraw = path.join(__dirname, '../binary/raw');
    }
  }else if(osvar == 'win32'){
    console.log("you are on a windows os")
  }else{
  }
  console.log(binarypath);
  var programm = $scope.program.split(' ');
  var file = programm.shift();
  const seqgen = spawn(file,programm);
    
  seqgen.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  seqgen.stderr.on('data', (data) => {  
    // see if the data line
    if(data.includes("iseq.cpp:165")){
      // split the string and get the value
      var splitdata = data.toString().split(' ');
      var value = splitdata[splitdata.length-2];
      console.log(`stderr: ${value}`);
      $scope.speed = value;
      if(count < 100){
        $scope.labels.push(count);
        $scope.data.push(value);
        
        count++;
      }else{
        $scope.labels.shift();        
        $scope.labels.push(count);
        $scope.data.shift();
        $scope.data.push(value);
        count++;
      }
      $scope.changeValue();
      $scope.$apply();
    }
  });
  
  seqgen.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];




  $scope.options = {
    scales: {      
      xAxes: [{
        ticks: {
            autoSkip: true,
            maxTicksLimit: 20
        }
    }]
    },
    animation: {
      x : true,
      duration: 0
    },
    elements: {
      line: {
              fill: false,
              borderColor: "#FF5252"
              
      },
      point: { 
        radius: 0 
      } 
    }
  };

  // at start set the invoice to an empty one
  $scope.speed = 10.0;
	$scope.editMode = true;
	$scope.printMode = false;
  

  $scope.color = "#ff0000";
  $scope.changeValue = function() {
  }

  $scope.threshold = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };
});
