﻿//John Morrison 2014
//javascript port based on code by Jeff Kaufman 
//Boston Apartment Prices 2011
//http://www.jefftk.com/apartment_prices/index

#target photoshop;
var data =
#include "./cities.json";
var colors = 
#include "./colors.js";

//adjust variables
var stepSize = 2;
var everyApt = 1;
var midpoint = 1300;
var rectSize = 6;
var enlarge = 16;
var opacity = 50.0;
var lowRes = false;
var nameAppend = "_0000";
var priceMin = 600;
var priceMax = 4000;
var clipMin = 0;
var clipMax = 6000;

//change the dateString to match the files you want to process
//var dateString = 0;
var maxLat, maxLon, minLat, minLon, maxX, maxY, deltaLat, deltaLon, fileData, arrayXY, offset,file ,colorScale,fgColor,valueOpacity ;
colorScale = blue_green_orange_yellow_52; 

//~ nameAppend = "_600-4000";
//~ priceMin = 600;
//~ priceMax = 4000;


//~ for(var i=3000;i<6300;i+=1000){
//~ clipMin = i;
//~ clipMax = i+1000;
//~ nameAppend = "_" + clipMin + "-" + clipMax;
//~ $.writeln(nameAppend);
//~ run(20140502);
//~ }





for(var i=600;i>200;i-=200){
clipMin = i;
clipMax = i+200;
nameAppend = "_" + clipMin + "-" + clipMax;
$.writeln(nameAppend);
run(20140502);
}






function formatDate(){
var date = new Date();
var year = date.getFullYear();
var month;
var day;

if (date.getMonth()>=9){month = date.getMonth()+1;} else {month = '0'+ (date.getMonth()+1);};
if (date.getDate()>=10){day = date.getDate();} else {day = '0'+ (date.getDate());};
return '' + year + month + day;
}


function readCSV ( _fileName ){
    var _path1 = (new File($.fileName)).parent + '/' + _fileName;

  //var _path1 = File.openDialog ( 'Select a csv file to parse:', '*.csv', false );
    var _fileObject = File (_path1);                    // Make fileObject
        _fileObject.open ('r') ;                           // Open for reading.
    var _returnArray = new Array ( ) ;
    while ( ! _fileObject.eof )                         // repeat until eof (End Of File)
    {  
        var _currentLine = _fileObject.readln () ;       // Read one line
        _returnArray.push(_currentLine.split(',')) ; 

//~ if(lowRes){
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~                 _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~                 _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~                         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;
//~         _fileObject.readln () ;

//~ }

    }
    _fileObject.close();                                // close the file
    return _returnArray;
}







function calculatePricePerBedroom(){
    
    
    // calculate price/bedroom
    for (var i=0; i<fileData.length; ++i) 
    {
        if (fileData[i][1] < 1) //bedrooms
        {
            fileData[i][1] = 1;
        }
        var price = fileData[i][0] / fileData[i][1];
        fileData[i][6] = price;
        if (fileData[i][6]<200)
        {
            fileData[i][6]=200;
        }
        //$.writeln(fileData[i][6]);
    }
}

function populateXY(){
    for (var i=0;i<fileData.length;++i){ 
        //populate arrayXY
        arrayXY[i] = ll_to_pixel(fileData[i][4],fileData[i][3]);     
    }
}
function pixel_to_ll(_x,_y){
    // (x,y) to (lat,lon)
    // x is lon, y is lat;
    //0,0 is upper left (minLon, maxLat);

    var _xFrac, _yFrac;
    _xFrac =  _x / maxX;
    _yFrac = _y / maxY;

    var _lon, _lat;
    _lon = minLon + _xFrac * deltaLon;
    _lat = maxLat - _yFrac * deltaLat;

    return [_lon,_lat];
}



function ll_to_pixel(_lat,_lon){
    //(lat,lon) to (x,y)
    var _adjLat, _adjLon;
    _adjLat = _lat - minLat;
    _adjLon = _lon - minLon;
    
    //x is lon, y is lat
    //0,0 is upper left (minLon, maxLat);
    
    var _fractionLat, _fractionLon;
    _fractionLat = _adjLat / deltaLat;
    _fractionLon = _adjLon / deltaLon;
      
    _x = Math.floor(_fractionLon * maxX);
    _y = Math.floor(1-_fractionLat * maxY);
    
    return [_x,_y];
}

function distance(_x1,_y1,_x2,_y2){  
    return Math.sqrt((_x1-_x2)*(_x1-_x2) + (_y1-_y2)*(_y1-_y2));
}
function toRad(_value){
    /** Converts numeric degrees to radians */
    return _value * Math.PI / 180;
}
function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function k_nearest(_x, _y){
    var _distance = [];
    var _minDistance = maxX*maxY;
    var _index = 0;
    //distance (x,y) to  (arrayX,arrayY)
    for (var i=0;i<arrayXY.length;++i)
    {
        _distance[i] = distance(_x,_y,arrayXY[i][0],arrayXY[i][1]);
        //$.write(Math.floor(_distance[i]) + ',');
        if(_distance[i]<_minDistance) //nearest neighbor
        {
            _minDistance = _distance[i];
            _index = i;
        }
    }
    if (_minDistance > stepSize)
    {
        _index = 0;
    }
return _index;
//var min = Math.min(null,distances);
}


function inverted_Distance_Weighted_Average(prices, lat, lon){
    var number = 0;
    var dividedBy = 0;
    var count = 0;
    
    for (var i=0;i<fileData.length;++i)
    {
        var plat = fileData[i][3];
        var plon = fileData[i][4];
        var dist = distance(lat,lon,plat,plon) + 0.0001;
        
        if (dist > ignoreDist) 
        {
            continue;
        }
        var inverseDist = 1/dist;
        number = number + (price * inverseDist);
        dividedBy = inverseDist;
        count ++;
    }
    if (c<5)
    {
        return false;
    }
    return number/dividedBy;
}
function newImage(){

    strtRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.PIXELS
    app.displayDialogs = DialogModes.NO 


    //Close all the open documents;
    while (app.documents.length){app.activeDocument.close();};
    // add a new document
    aptDoc = app.documents.add(maxX, maxY, 300.0, file, NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
    

 
}



function closeImage(){
    //app.preferences.rulerUnits = strtRulerUnits;
    
    var pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.compression=9;  // [0-9]       0 == uncompressed     9==smallest/slowest
    pngSaveOptions.interlaced=false;

    var outputFolder = Folder((new File($.fileName)).parent);
    $.writeln(outputFolder +'/'+ file + ".png");
    aptDoc.saveAs(new File(outputFolder +'/images/'+ file + nameAppend + ".png"), pngSaveOptions);
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}


function pasteLayer(_source, _destination){
    
    var srcDoc = _source;
    if (srcDoc.activeLayer.kind != LayerKind.TEXT)
    {

      // Select the document. Selections are always expressed
      // in pixels regardless of the current ruler unit type, so we're computing
      // the selection corner points based on the inch unit width and height
      // of the document
      var x2 = (srcDoc.width * srcDoc.resolution);
      var y2 = srcDoc.height * srcDoc.resolution;

      srcDoc.selection.select(Array (Array(0, 0), Array(x2, 0), Array(x2, y2), Array(0, y2)), SelectionType.REPLACE, 0, false);

      srcDoc.selection.copy();

      // The new doc is created 
      // need to change ruler units to pixels because x2 and y2 are pixel units.
      app.preferences.rulerUnits = Units.PIXELS;

      var pasteDoc = _destination;
      //open (_destination);
      //var pasteDoc = app.documents.add(Number(x2), Number(y2), srcDoc.resolution, "Paste Target");
      pasteDoc.paste();
      pasteDoc = null;
    }
    else
    {
      alert ("You cannot copy from a text layer");
    }
    srcDoc = null;
}


function ramp( value ){ 

 //   var _limit = [ midpoint*0.2,midpoint*0.8,midpoint,midpoint*1.2,midpoint*1.8 ];
 
//_limit[0]    200      260
//_limit[1]    800      1040
//_limit[2]    1000     1300
//_limit[3]    1200     1560
//_limit[4]    1800     2340
  
  
  //variable opacity
  //valueOpacity = map (value, 700, 1900, 30, 100);
  //if(valueOpacity<30){valueOpacity=30;}else if(valueOpacity>100){valueOpacity=100}
  
  //700,1900
  var colorIndex = Math.floor(map(value,priceMin,priceMax,0,colorScale.length-1));
  if(colorIndex<0){colorIndex = 0; } else if(colorIndex>colorScale.length-1){colorIndex=colorScale.length-1;}
  
fgColor = new SolidColor;
fgColor.rgb.hexValue = colorScale[colorIndex];
  
    //app.foregroundColor = fgColor;



}





function pixel(_x,_y){
    //variable rectangle size
//var valueRect = Math.floor(rectSize*(1.4-(valueOpacity/100.0)));
var valueRect = rectSize;
if(_x -Math.floor(valueRect/2)<0 || _x + Math.ceil(valueRect)>maxX || _y -Math.floor(valueRect/2)<0 || _y + Math.ceil(valueRect)>maxY){return;}


        var _rectSelect =Array
                      ( Array( _x -Math.floor(valueRect/2), _y -Math.floor(valueRect/2)),
                        Array( _x + Math.ceil(valueRect), _y -Math.floor(valueRect/2)),
                        Array( _x + Math.ceil(valueRect), _y + Math.ceil(valueRect)),
                        Array( _x-Math.floor(valueRect/2) , _y + Math.ceil(valueRect) )
                      );
        aptDoc.selection.select(_rectSelect);
    //variable opacity        
    //aptDoc.selection.fill (fgColor, ColorBlendMode.NORMAL, valueOpacity, false)
    //aptDoc.selection.feather (Math.floor(1));
    aptDoc.selection.fill (fgColor, ColorBlendMode.NORMAL, opacity, false)

    //aptDoc.selection.fill(fgColor);
        aptDoc.selection.deselect();
    
}

function rectangle(x,y){

    var _rectSelect =Array(
                            Array( x - Math.floor(offset), y - Math.floor(offset) ),
                            Array( x + Math.floor(offset), y - Math.floor(offset) ),
                            Array( x + Math.floor(offset), y + Math.floor(offset) ),
                            Array( x - Math.floor(offset), y + Math.floor(offset) )
                          );
    aptDoc.selection.select(_rectSelect);
    aptDoc.selection.fill(app.foregroundColor);
    aptDoc.selection.deselect();
}




function colorPixels(){
    for (var i=0;i<arrayXY.length;i+=everyApt)
    {
          
        //$.write("i");
            //clipping for layered .psd
        if(fileData[i][6]>=clipMin){
        if(fileData[i][6]>clipMax){return;}
        
          if(i%100==0){$.writeln("i="+i);}
        ramp(fileData[i][6]);
        pixel(arrayXY[i][0],arrayXY[i][1]+maxY);
        }
    }
/*
    for (var y=stepSize/2; y<maxY; y+=stepSize) 
    {
        $.writeln('printing y = ' + y);
        for (var x=stepSize/2; x<maxX; x+=stepSize)
        {
            var _i = 1;
            ramp(fileData[_i][6]);
            rectangle(x,y);
        }    
    }
*/
}



function run(dates){
var dateString = dates;
if (dateString == 0)
{dateString = formatDate();}
var newDocumentReference;
var strtRulerUnits;





/*
//current folder
var folderPath = Folder((new File($.fileName)).parent);
//Get all the files in the folder;
var folderList = folderPath.getFiles(); 
for (var i = 0; i <folderList.length ; ++i){
    $.writeln(folderList[i].name );
}
*/
       
        
//    for (var i=data.cities.length-1;i>=0;i--){
    for(var i=0;i<data.cities.length;++i){

        var cityName = data.cities[i].CITY;
        file = ('apt-'+ cityName + '-' + dateString );    



        var backgroundFolder = Folder((new File($.fileName)).parent);
        var background = new File (backgroundFolder + "/images/" + cityName + ".png");
        //$.writeln(background);
     

        //var backgroundFile = open( new File(backgroundFolder + "/" + cityName + ".png"));
        
        





     
        fileData = readCSV ( 'data/' + file +'.csv' );
        calculatePricePerBedroom ();
        offset = (stepSize/2);
        $.writeln(file);
        minLat=data.cities[i].MIN_LAT;
        maxLat=data.cities[i].MAX_LAT;
        minLon=data.cities[i].MIN_LON;
        maxLon=data.cities[i].MAX_LON;
        maxX = data.cities[i].maxX*enlarge;
        maxY = data.cities[i].maxY*enlarge;
        deltaLat = maxLat-minLat;
        deltaLon = maxLon-minLon;
        arrayXY = [];
        populateXY ();


        newImage();
        //pasteLayer(open(background),aptDoc);
        colorPixels();
        closeImage();

    }
}
//end functions**************************************************************************