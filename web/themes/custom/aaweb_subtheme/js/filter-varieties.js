
var speciesType = '';
var year = '';
var summer = '';
var spring = '';
var winter = '';
var autum = '';
var conceptName = '';
// $('#speciesdrodown').on('change',function(){
//   var speciesType = $('#speciesdrodown').val();
//   var year = 'props.season_' + speciesType +'_Yr';
//   var summer = 'props.season_' + speciesType +'_S';
//   var spring = 'props.season_' + speciesType +'_Sp';
//   var winter = 'props.season_' + speciesType +'_W';
//   var autum = 'props.season_' + speciesType +'_A';
//   //alert(speciesType);
//   console.log(autum);
//   var conceptName = $('#speciesdrodown').find(":selected").text();
//   console.log(conceptName);
//   map.removeLayer(L.geoJson);
//   });
  

//  create teh view for the leaflet map to work of as centre
// var map = L.map("map", { zoomControl:false }).setView([-26.3202, 135.948], 4);
// var map = L.map("map", {layers: [bison, bubalus]}).setView([-26.3202, 135.948], 4);
var map = L.map("map").setView([-26.3202, 135.948], 5);
// var map = L.map('map').setView([37.8, -96], 4);
// var cities = L.layerGroup([littleton, denver, aurora, golden]);
var mySelector = jQuery("#mySelector");
// add a base map stype using API key from mapbox
L.tileLayer(
  "https://api.mapbox.com/styles/v1/angryantweb/ck1ifhzd81fwp1cpgtlk42k1i/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2pwcnlzeGJ2MHowbTQzbnZhZHE0dWoybCJ9.hIg1J7n1f91VwNLuz-F67w",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // id: "mapbox.light-v9",
    accessToken: 'pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2p6b25ta2NxMGQ2ZzNibnBqdXl0ZTU1YSJ9.vZAZHUOSEatZCVyOo0pI2w'
  }
).addTo(map);

// *******************
// LABEL another label type control on the page
//  *******************
  infoother = L.control();

  infoother.onAdd = function(map) {
 this._div = L.DomUtil.create("div", "infoother");
 this.update();
 return this._div;
};

  infoother.update = function(props) {
  this._div.innerHTML = ''
};
// this adds the info layer to the map object
infoother.addTo(map);
// *******************
// END LABEL
//  *******************


var arr = ["1","5"];

function evaluateLayerName () {
x = 1 + 1;

return x;
}    

var sname = ['Bubas_Bison', 'Bubas_Bubalus'];
var x;
var iCount = 0;

// for (x of sname) {
info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");
  
  this.update();
  return this._div;
};

info.update = function(props,title) {
  // SET SOME DEFAULTS FOR OUR VARIABLES
  presence = 'NOT PRESENT';
  presence_a = '';
  presence_w = '';
  presence_s = '';
  presence_sp = '';

  // FIRST CHECK ITS GOT A HOVER STATE OTHERWISE ERRORS
  if(props) {
  presence = (eval('props.season_'+title+'_Yr') == 1) ?  'PRESENT - ' :  'NOT PRESENT';
  presence_a = (eval('props.season_'+title+'_A') == 1) ? 'Autum' : '';
  presence_w = (eval('props.season_'+title+'_W') == 1) ? 'Winter' : '';
  presence_s = (eval('props.season_'+title+'_S') == 1) ?  'Summer' : '';
  presence_sp = (eval('props.season_'+title+'_Sp') == 1) ? 'Spring' : '';
  
  }
  this._div.innerHTML =
    (props
      ? 
        // "<h4>"+x+"</h4>" +
        "<b>NRM:</b> " + " " + props.NRM_REGION + "<br /><b>STATE: </b>" + props.STATE +
        "<br /><br />" + 
        "<b>" +
        presence + ' ' + presence_a + presence_w + ' ' + presence_s + ' ' + presence_sp + "</b>"
      : "Select your species then hover over a Natural Resource Management Area (NRM)");
};
// this adds the info layer to the map object
info.addTo(map);

// // get color depending on population density value
function getColor(d) {
  
  return d == 0
    ? "gray"
    : d == 1
      ? "black" : "pink";
}

// styling the tile or feature sing teh fillcolour function above and the prop densicey from the GEOjson
function style(feature) {
  // console.log(feature.properties.season_Bubas_Bison_Yr);
return {
    weight: 0.8,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.5,
    // fillColor: getColor(feature.properties.density)
    fillColor: getColor(feature.properties.season_Bubas_Bison_Yr)
};
}


function style2(feature) {
  // console.log(feature.properties.season_Bubas_Bison_Yr);
return {
    weight: 0.8,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.5,
    // fillColor: getColor(feature.properties.density)
    fillColor: getColor(feature.properties.season_Bubas_Bubalus_Yr)
};
}

// the hover event should highlight or crate a line around the object this below does that fuction
function highlightFeature(e) {
var layer = e.target;

layer.setStyle({
    weight: 2,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.3,
    fillColor: "#66887a"
});

if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
}
var title = 'bang';
  // this adds the details from the selected object to our hover box
info.update(layer.feature.properties,title);
}

// initialises the geojson variable with nothing
var geojson;

// nothing is highlighted if the mouse goes out this function defineds that off action
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}
// on click the zoomTofeature will fit the zoom to the sected area
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
// describes the reactions on the actual layer and what to do what functions to hit on EachFeature passes in the feature selected and the layer
function onEachFeature(feature, layer) {
    layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight //,
    // click: zoomToFeature
});
}
// ****** This is our key fuction adding all the data to our map
// takes our empty geojson variable and assigns the StatesData on a layer L and adds it to the initialised map
// geojson = L.geoJson(stateData, {

// below stuff from the census example 

//LAYER FUNCTIONALITY x2
    //  layer 1
    var species1 = new L.geoJson(nrmData, {
        style: style,
        onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style,
            that = this;//NEW

        layer.on('mouseover', function (e) {
            this.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

            info.update(layer.feature.properties,'Bubas_Bison');
        });
        layer.on('mouseout', function (e) {
            species1.resetStyle(e.target); //NEW
                info.update();
        });
        }
        });
    //  layer 2
    var species2 = new L.geoJson(nrmData, {
        style: style2,
        onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style,
            that = this;//NEW

        layer.on('mouseover', function (e) {
            this.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
            });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

            info.update(layer.feature.properties,'Bubas_Bubalus');
        });
        layer.on('mouseout', function (e) {
            species2.resetStyle(e.target); //NEW
            info.update();
        });
        }
        });

    //LAYER CONTROL	
    var overlays = {
        "Bubas Bison": species1,
        "Bubas Bubalus": species2
    };

    let layerControl = L.control.layers(overlays, null, {collapsed: true}).addTo(map);
    $('.leaflet-control-layers').on('mouseleave', () => {
      layerControl.collapse();
  });
  $('.leaflet-control-layers-toggle').on('mouseenter', () => {
      layerControl.expand();
  });
        

    // LEGEND
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend"),
    grades = ["Present", "Absent"],
    labels = [];

  labels.push('<i style="background:gray;"></i>Absent');
  labels.push('<i style="background:black;"></i>Present');

  div.innerHTML = labels.join("<br>");
  return div;
    };

    legend.addTo(map);
// var zoomcontrol = L.control.zoom()
// ***** END LEGEND 

