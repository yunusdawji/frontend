const path = require('path')
var fs = require('fs')

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
  $scope.cputotal = 0;
  $scope.fpgatotal = 0;
  
  $scope.labels = [0];
  $scope.series = ['Active Channel 1'];
  $scope.series_act2 = ['Active Channel 2'];
  $scope.series_act3 = ['Active Channel 3'];
  $scope.series_act4 = ['Active Channel 4'];
 
  $scope.data = [[[0]]];
  $scope.data_act2 = [[[0]]];
  $scope.data_act3 = [[[0]]];
  $scope.data_act4 = [[[0]]];
  

  $scope.datasetOverride1 = [
    {
      //label: 'Override Series A',
      borderWidth: 1,
      borderColor: 'rgba(255,0,0,1)',
      backgroundColor: 'rgba(255,0,0,1)',

      type: 'line'
    },
    {
      //label: 'Override Series A',
      borderWidth: 3,
      borderColor: 'rgba(255,130,0,1)',
      backgroundColor: 'rgba(255,130,0,1)',

      type: 'line'
    },
    {
     // label: 'Override Series B',
      borderWidth: 1,
      borderColor: 'rgba(0,0,255,1)',
      backgroundColor: 'rgba(0,0,255,1)',
     // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      //hoverBorderColor: 'rgba(255,99,132,1)',
      type: 'line'
    },
    {
     // label: 'Override Series B',
      borderWidth: 3,
      borderColor: 'rgba(130,0,255,1)',
      backgroundColor: 'rgba(130,0,255,1)',
     // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      //hoverBorderColor: 'rgba(255,99,132,1)',
      type: 'line'
    }
    
    
  ];

  $scope.program = $userSettings.get('program');
  $scope.inputfile = $userSettings.get('inputfile');
  $scope.inputfiletwo = $userSettings.get('inputfiletwo');
  $scope.activesites = $userSettings.get('activesites');
  
  var count = 1;
  var count1 = 1;
  var cpuaverage = 0;
  var fpgaaverage = 0;
  var cputotal1 = 0;
  var fpgatotal1 = 0;
  $scope.onClickSave = function (points, evt) {
    console.log(points, evt);
    $userSettings.set('program', $scope.program);
    $userSettings.set('inputfile', $scope.inputfile);
    $userSettings.set('inputfiletwo', $scope.inputfiletwo);
    $userSettings.set('activesites', $scope.activesites);
  };

  const { spawn } = require('child_process');

	const hrtime = new Date().getTime();
  

  readline = require('readline');


  var LineByLineReader = require('line-by-line');
  var activesites = {};

  var flag = 1;

  function readfile(){
  

    var rd = readline.createInterface({
      input: fs.createReadStream($scope.activesites),
      output: process.stdout,
      console: false
  });
  
  
  rd.on('line', function(line) {
      //rd.pause();
      //console.log(line);
      //$scope.data.push(parseFloat(line))
      var partsOfStr = line.split(',');
      activesites[0] = partsOfStr[0];
      activesites[1] = partsOfStr[1];
      activesites[2] = partsOfStr[2];
      activesites[3] = partsOfStr[3];
      //$scope.data.push(parseFloat(line));
      //$scope.labels.shift();        
      //$scope.labels.push(count);
      //count++;
      $scope.changeValue();
      $scope.$apply();
      //rd.resume();
  });

  const displaywindow = 110;

  var lr;
  if(flag ==1){
    lr = new LineByLineReader($scope.inputfile);
    //flag = 0;
  }else{
    //flag = 1;
    lr = new LineByLineReader($scope.inputfiletwo);
  }
  lr.on('error', function (err) {
      // 'err' contains error object
  });
  
  lr.on('line', function (line) {
      // pause emitting of lines...
       var partsOfStr = line.split(',');

       if(parseInt(partsOfStr[0],2)==0){
          if(count > displaywindow){
           // $scope.labels.shift();   
            $scope.data[0].shift();
          }
          $scope.data[0].push(parseFloat(partsOfStr[1]));
          }else if (parseInt(partsOfStr[0],2)==1){
            if(count > displaywindow){
             // $scope.labels.shift();   
              $scope.data_act2[0].shift();
            }
            $scope.data_act2[0].push(Math.abs(parseFloat(partsOfStr[1])));
          }else if(parseInt(partsOfStr[0],2)==2){
            if(count > displaywindow){
              //$scope.labels.shift();   
              $scope.data_act3[0].shift();
            }
            $scope.data_act3[0].push(Math.abs(parseFloat(partsOfStr[1])));
          }else if(parseInt(partsOfStr[0],2)==3){
            if(count > displaywindow){
              $scope.labels.shift();   
              $scope.data_act4[0].shift();
            }
            $scope.data_act4[0].push(Math.abs(parseFloat(partsOfStr[1])));
          $scope.labels.push(count/20);
          count++;
       }
       
       
       // add a line to a lyric file, using appendFile
       fs.appendFile($scope.program, activesites[parseInt(partsOfStr[0],2)]+','+
       partsOfStr[1]+','+partsOfStr[2]+'\n');
       
       if(parseInt(partsOfStr[0],2)==0){
          if(count > displaywindow){
            //$scope.labels.shift();   
            $scope.data[0].shift();
          }
          $scope.data[0].push(parseFloat(partsOfStr[2]));
       }else if (parseInt(partsOfStr[0],2)==1){
            if(count > displaywindow){
              //$scope.labels.shift();   
              $scope.data_act2[0].shift();
            }
            $scope.data_act2[0].push(Math.abs(parseFloat(partsOfStr[2])));
       }else if(parseInt(partsOfStr[0],2)==2){
            if(count > displaywindow){
              //$scope.labels.shift();   
              $scope.data_act3[0].shift();
            }
            $scope.data_act3[0].push(Math.abs(parseFloat(partsOfStr[2])));
       }else if(parseInt(partsOfStr[0],2)==3){
            if(count > displaywindow){
              $scope.labels.shift();   
              $scope.data_act4[0].shift();
            }
            $scope.data_act4[0].push(Math.abs(parseFloat(partsOfStr[2])));
            $scope.labels.push(count/20);
            count++;  
       }
       $scope.changeValue();
       $scope.$apply();
  });
  
  lr.on('end', function () {
      // All lines are read, file is closed now.
  });

}

  $scope.onClick1 = function (points, evt) {

    setInterval(function() {  
      readfile();
  }, 1000);
  
  };

  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];




  $scope.options = {
    responsive: false,
    data: {
      labels: [],
      datasets: [{
        label: 'My First dataset',
        //backgroundColor: window.chartColors.red,
        //borderColor: window.chartColors.red,
        data: [
         
        ],
        fill: false,
      }]
    },
    scales: {      
      xAxes: [{
        ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            
        },
        scaleLabel: {
          display: true,
          labelString: 'Time [ms]'
        }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Voltage (mV)'
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
    },
    legend: {
      display: true,
      labels: {
          //fontColor: 'rgb(255, 99, 132)'
      },
      position : 'top'
    },
    color: [
      'red',    // color for data at index 0
      'blue'
    ],
    width:600,
    height:300
  };

  // at start set the invoice to an empty one
  $scope.speed = 0.0;
	$scope.editMode = true;
	$scope.printMode = false;

  $scope.speed_fpga = 0.0;
  $scope.scales= {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'probability'
      }
    }]
  };

  $scope.color = "#ff0000";
  $scope.changeValue = function() {
  }

  $scope.threshold = {
    '0': {color: 'green'},
    '40': {color: 'brown'}
  };
});
