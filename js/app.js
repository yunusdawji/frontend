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
  $scope.cputotal = 0;
  $scope.fpgatotal = 0;
  
  $scope.labels = [];
  $scope.series = ['CPU', 'CPU Average', 'FPGA', 'FPGA Average'];
 
  $scope.data = [
    [0],
    [0],
    [0],
    [0]
  ];
  

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
  $scope.programfpga = $userSettings.get('programfpga');

  var count = 1;
  var count1 = 1;
  var cpuaverage = 0;
  var fpgaaverage = 0;
  var cputotal1 = 0;
  var fpgatotal1 = 0;
  $scope.onClickSave = function (points, evt) {
    console.log(points, evt);
    $userSettings.set('program', $scope.program);
    $userSettings.set('programfpga', $scope.programfpga);
  };

  const { spawn } = require('child_process');

	const hrtime = new Date().getTime();


  function seqgenfunc(){
      var programm = $scope.program.split(' ');
      var file = programm.shift();
      var seqgen = spawn(file,programm);

	seqgen.stdout.on('data', (data) => {
	// console.log(`stderr ${data}`);
	});

	seqgen.stderr.on('data', (data) => {  
		//console.log(`stdout ${data}`);
		// see if the data line
		if(data.includes("The CPU basecaller's instantenous speed for file")){
			// split the string and get the value
			var splitdata = data.toString().split(' ');
			var value = splitdata[splitdata.length-2];
			$scope.speed = value;
			var crtime = new Date().getTime();
			
			var cpuaveragetemp = ((cpuaverage*count)+parseFloat(value))/(count + 1);
			if(!isNaN(cpuaveragetemp)){			
				cpuaverage = cpuaveragetemp;  
				cputotal1 = (cpuaverage)*(crtime - hrtime)/(5.44*Math.pow(10,9));
				//console.log(((cpuaverage)*(crtime - hrtime)))
				$scope.cputotal = cputotal1.toFixed(6);
			}
			//console.log(`stderr: ${cpuaverage} ${value}`);

			if(count < 100){
				$scope.labels.push(count);
				$scope.data[0].push(parseInt(value));
				$scope.data[1].push(cpuaveragetemp);        
				count++;
			}else{
				if(!isNaN(cpuaveragetemp)){
				$scope.labels.shift();        
				$scope.labels.push(count);
				$scope.data[0].shift();
				$scope.data[0].push(value);

				$scope.data[1].shift();
				$scope.data[1].push(cpuaveragetemp);        
				count++;
				}
				console.log(cpuaveragetemp);

			}
			//$scope.changeValue();
			$scope.$apply();
		}
	});

	seqgen.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		seqgenfunc();
	});
  }

  function fpgaseqfunc(){
var programmfpga = $scope.programfpga.split(' ');
  var filefpga = programmfpga.shift();
  var inputfilesdir = programmfpga.shift();
  programmfpga.push("1");
  programmfpga.push("0");
  console.log(filefpga);  
  const fpgaprogramreset = spawn(filefpga,programmfpga); 
  

  
    fpgaprogramreset.on('close', (code) => {
    console.log(`child process exited with code ${code}`);

    var programmfpga1 = $scope.programfpga.split(' ');
    console.log(programmfpga1);
    programmfpga1.shift();
    var inptfiledir = programmfpga1.shift();
    //2 0 0 512
    programmfpga1.push("2");
    programmfpga1.push("0");
    programmfpga1.push("0");
    programmfpga1.push("512");
    programmfpga1.push(inptfiledir);
    console.log(filefpga);
    console.log(programmfpga1);
    const fpgaprogram = spawn(filefpga,programmfpga1); 
  
    fpgaprogram.stdout.on('data', (data) => {
      // console.log(`stderr ${data}`);
     });
     
     fpgaprogram.stderr.on('data', (data) => {  
      // console.log(`stdout ${data}`);
       // see if the data line
       if(data.includes("The FPGA basecaller's instantenous speed for file")){
         // split the string and get the value
         var splitdata = data.toString().split(' ');
         var value = splitdata[splitdata.length-2];
	 var crtime = new Date().getTime();
	 if(!isNaN(fpgaaverage)){			
		fpgaaverage = ((fpgaaverage*count1)+parseFloat(value))/(count1 + 1); 
		fpgatotal1 = (fpgaaverage)*(crtime - hrtime)/(5.44*Math.pow(10,9));
		$scope.fpgatotal = fpgatotal1.toFixed(6);
   
	 }   
	
         //console.log(`stderr: ${value}`);
         $scope.speed_fpga = value;
         if(count1 < 100){
           //$scope.labels.push(count);
           //$scope.data.push(value);
           $scope.data[2].push(parseFloat(value));
           $scope.data[3].push(fpgaaverage*1);
          
           count1++;
         }else{
		 if(!isNaN(fpgaaverage)){			
		  
		 //$scope.labels.shift();        
		   //$scope.labels.push(count);
		   $scope.data[2].shift();
		   $scope.data[2].push(parseFloat(value));
		   
		   $scope.data[3].shift();
		   $scope.data[3].push(fpgaaverage*1);
	   
	   
		   count1++;
		}
         }
         $scope.changeValue();
         $scope.$apply();
       }
     });
     
     fpgaprogram.on('close', (code) => {
       console.log(`child process exited with code ${code}`);
	fpgaseqfunc();
     });
  });	
  }

  $scope.onClick1 = function (points, evt) {
  console.log(points, evt);
  //$userSettings.set('program', $scope.program);

  
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

  seqgenfunc();

  fpgaseqfunc(); 
  


  
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
      }, {
        label: 'My Second dataset',
        fill: false,
        //backgroundColor: window.chartColors.blue,
        //borderColor: window.chartColors.blue,
        data: [
        ],
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
          labelString: 'File Index'
        }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Basecalling Speed (kb/sec)'
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
