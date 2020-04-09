// // get color depending on population density value
function getColor(d) {
  
  return d == 0
    ? "transparent"
    : d == 1
      ? "#66887a" : "pink";
}


// the hover event should highlight or crate a line around the object this below does that fuction
function highlightFeature(e) {
  var layer = e.target;

  //console.log(e);

  if (layer.options.fillColor == 'transparent') {
    
    var strFillColor = '#000';
    var strFillOpacity = .05;
  }
  else {
    var strFillColor = '#66887a';
    var strFillOpacity = .7;
  }

  layer.setStyle({
    weight: 1,
    color: "#fff",
    dashArray: "1",
    fillOpacity: strFillOpacity,
    fillColor: strFillColor
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  // this adds the details from the selected object to our hover box
  info.update(layer.feature.properties);
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
// describes the reactions on the actual layer and what to do what functions to hit on EachFeature passes in teh fture selected and the layer
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
geojson = L.geoJson(nrmData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

// ****************
// LEGEND STUFF
// adds an extra attribution to the map credit
// *******************
map.attributionControl.addAttribution(
  'Absence Data &copy; <a href="http://ala.org.au/">Atlas of Living Australa</a>'
);
// assigns where the legend should be placed and creates it
var legend = L.control({ position: "bottomleft" });
// modifies the legend adding the html structure to it
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = ["Present", "Absent"],
    labels = [];

  labels.push('<p><i style="background:#ffffff;border:1px solid #555;box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);"></i>Absent</p>');
  labels.push('<p style="margin-bottom:0px;"><i style="background:#66887a;"></i>Present</p>');

  div.innerHTML = labels.join("");
  return div;
};

legend.addTo(map);

    // listen for screen resize events
window.addEventListener('resize', function(event){
  // get the width of the screen after the resize event
  var width = document.documentElement.clientWidth;
  // tablets are between 768 and 922 pixels wide
  // phones are less than 768 pixels wide
  if (width < 960) {
      // set the zoom level to 10
      map.setZoom(4);
  }  else {
      // set the zoom level to 8
      map.setZoom(5);
  }
});