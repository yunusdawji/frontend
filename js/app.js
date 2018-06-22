var app = angular.module('invoiceapp',['angularjs-gauge',"chart.js"]);

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

app.controller('InvoiceCtrl',function($scope){
  
  
  $scope.labels = [];
  $scope.series = ['Series A'];
  $scope.data = [
  ];
  var count = 0;
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      
      xAxes: [{
        type: 'time',
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
              fill: false
              
      },
      point: { radius: 0 } 
  }
  };

  // at start set the invoice to an empty one
  $scope.speed = 10.0;
	$scope.editMode = true;
	$scope.printMode = false;
  const { spawn } = require('child_process');
  const seqgen = spawn('/Users/yunusdawji/electron/seqgen/build/genqode/Debug/SeqGen', ["-s", "l", "-m", "/Users/yunusdawji/electron/seqgen/data/raw"]);
    
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

  $scope.color = "#ff0000";
  $scope.changeValue = function() {
  }

  $scope.threshold = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };
});
