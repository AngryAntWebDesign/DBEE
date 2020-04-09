//  create teh view for the leaflet map to work of as centre
// var map = L.map("map", { zoomControl:false }).setView([-26.3202, 135.948], 4);
// var map = L.map("map", {layers: [bison, bubalus]}).setView([-26.3202, 135.948], 4);
var map = L.map("map").setView([-28.3202, 132.948], 5);
// var map = L.map('map').setView([37.8, -96], 4);
// var cities = L.layerGroup([littleton, denver, aurora, golden]);
var mySelector = jQuery("#mySelector");
// add a base map stype using API key from mapbox
L.tileLayer(
  "https://api.mapbox.com/styles/v1/angryantweb/ck7imihw11scf1io9nro4iizb/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2pwcnlzeGJ2MHowbTQzbnZhZHE0dWoybCJ9.hIg1J7n1f91VwNLuz-F67w",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // id: "mapbox.light-v9",
    accessToken:
      "pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2p6b25ta2NxMGQ2ZzNibnBqdXl0ZTU1YSJ9.vZAZHUOSEatZCVyOo0pI2w"
  }
).addTo(map);

// ********************************
// ALL CONNECTED TO OUR HOVER LABEL
// ********************************
// // control that shows state info on hover
var info = L.control();

// using the control that was created in the variable info above describe the contents div with info L stands for layer
// UNCOMMNET TO DO
info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");

  this.update();
  return this._div;
};

var speciesName = "";

// we have this layer called info update it use a function to look at props and assign text within the layer
info.update = function(props) {
  if (props) {
    if (props.Species) {
      // speciesName = '<a href="#">'+props.Species+'</a></br>';
      speciesName = props.Species;
    } else {
      speciesName = "";
    }
  }
  this._div.innerHTML =
    "<h4></h4>" +
    (props
      ? "<b>NRM:</b> " +
        " " +
        props.NRM_REGION +
        "<br /><b>STATE: </b>" +
        props.STATE +
        "<br><p>" +
        speciesName +
        "</p>" +
        ""
      : "Hover over a Natural Resource Management Area (NRM)");
};
// this adds the info layer to the map object
info.addTo(map);
// ************ FINISH HOVER DEFINITION

// // get color depending on population density value
function getColor(d) {
  //   return d == 0 ? "gray" : d == 1 ? "black" : "red";
  return d > 10
    ? "#800026"
    : d > 8
    ? "#BD0026"
    : d > 6
    ? "#E31A1C"
    : d > 4
    ? "#FC4E2A"
    : d > 2
    ? "#FD8D3C"
    : d > 1
    ? "#FEB24C"
    : d > 0
    ? "#FED976"
    : "gray";
}

// styling the tile or feature sing teh fillcolour function above and the prop densicey from the GEOjson
function style(feature) {
  // console.log(feature.properties.Varieties);
  return {
    weight: 0.8,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 0.5,
    // fillColor: getColor(feature.properties.density)
    fillColor: getColor(feature.properties.Varieties)
  };
}

// the hover event should highlight or crate a line around the object this below does that fuction
function highlightFeature(e) {
  geojson.setStyle(style);

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
  // this adds the details from the selected object to our hover box
  info.update(layer.feature.properties);
}

function dehighlight(layer) {
  if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
    geojson.resetStyle(layer);
  }
}
// Variable to store selection
var selected = null;

function select(layer) {
  // See if there is already a selection
  if (selected !== null) {
    // Store for now
    var previous = selected;
  }
  map.fitBounds(layer.getBounds());

  // console.log(layer.getBounds());
  // Set new selection
  selected = layer;
  // If there was a previous selection
  if (previous) {
    // Dehighlight previous
    dehighlight(previous);
  }
}

// initialises the geojson variable with nothing
var geojson;

function highlight(layer) {
  // highlightFeature(layer);
  layer.setStyle({
    weight: 2,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.3
    // fillColor: "#66887a"
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
  // console.log(selected);
  // if (selected !== null || selected._leaflet_id !== null) {
  info.update(layer.feature.properties);
  // }
}

function dehighlight(layer) {
  if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
    geojson.resetStyle(layer);
  }
}

function select(layer) {
  if (selected !== null) {
    var previous = selected;
  }
  map.fitBounds(layer.getBounds());
  selected = layer;
  if (previous) {
    dehighlight(previous);
  }
}

var selected = null;

var geojson = L.geoJson(nrmData, {
  style: function(feature) {
    return {
      weight: 0.8,
      opacity: 1,
      color: "white",
      dashArray: "1",
      fillOpacity: 0.5,
      fillColor: getColor(feature.properties.Varieties)
    };
  },
  onEachFeature: function(feature, layer) {
    layer.on({
      mouseover: function(e) {
        if (selected === null || selected._leaflet_id === layer._leaflet_id) {
          highlight(e.target);
        }
      },
      mouseout: function(e) {
        if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
          dehighlight(e.target);
        }
      },
      click: function(e) {
        if (selected) {
          dehighlight(e.target);
          highlight(e.target);
        }
        select(e.target);
      }
    });
  }
}).addTo(map);

// ****************
// LEGEND STUFF
// adds an extra attribution to the map credit
// *******************
map.attributionControl.addAttribution(
  'Absence Data &copy; <a href="http://ala.org.au/">Atlas of Living Australa</a>'
);
// assigns where the legend should be placed and creates it
var legend = L.control({ position: "bottomright" });
// modifies the legend adding the html structure to it
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = ["Present", "Absent"],
    labels = [];

  labels.push('<i style="background:#800026;"></i>10+ species');
  labels.push('<i style="background:#BD0026;"></i>8-9 species');
  labels.push('<i style="background:#E31A1C;"></i>7-8 species');
  labels.push('<i style="background:#FC4E2A;"></i>5-6 species');
  labels.push('<i style="background:#FEB24C;"></i>3-4 species');
  labels.push('<i style="background:#FED976;"></i>1-2 species');
  labels.push('<i style="background:gray;"></i>0 species');

  div.innerHTML = labels.join("<br>");
  return div;
};

legend.addTo(map);
