//  create teh view for the leaflet map to work of as centre
// var map = L.map("map", { zoomControl:false }).setView([-26.3202, 135.948], 4);
// var map = L.map("map", {layers: [bison, bubalus]}).setView([-26.3202, 135.948], 4);
var map = L.map("map", { zoomControl: false }).setView([-28.3202, 132.948], 5);

var lat = -28.3202;
var lng = 132.948;
var zoom = 5;

// var map = L.map('map').setView([37.8, -96], 4);
// var cities = L.layerGroup([littleton, denver, aurora, golden]);
var mySelector = jQuery("#mySelector");
// add a base map stype using API key from mapbox
L.tileLayer(
  "https://api.mapbox.com/styles/v1/angryantweb/ck7imihw11scf1io9nro4iizb/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2pwcnlzeGJ2MHowbTQzbnZhZHE0dWoybCJ9.hIg1J7n1f91VwNLuz-F67w",
  {
    maxZoom: 8,
    minZoom: 3,
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // id: "mapbox.light-v9",
    accessToken:
      "pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2p6b25ta2NxMGQ2ZzNibnBqdXl0ZTU1YSJ9.vZAZHUOSEatZCVyOo0pI2w"
  }
).addTo(map);


// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
  options: {
      position: 'topleft',
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '-',
      zoomOutTitle: 'Zoom out',
      zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
      zoomHomeTitle: 'Zoom home'
  },

  onAdd: function (map) {
      var controlName = 'gin-control-zoom',
          container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
          options = this.options;

      this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
      controlName + '-home', container, this._zoomHome);
      this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
      controlName + '-in', container, this._zoomIn);
      this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
      controlName + '-out', container, this._zoomOut);

      this._updateDisabled();
      map.on('zoomend zoomlevelschange', this._updateDisabled, this);

      return container;
  },

  onRemove: function (map) {
      map.off('zoomend zoomlevelschange', this._updateDisabled, this);
  },

  _zoomIn: function (e) {
      this._map.zoomIn(e.shiftKey ? 3 : 1);
  },

  _zoomOut: function (e) {
      this._map.zoomOut(e.shiftKey ? 3 : 1);
  },

  _zoomHome: function (e) {

    var width = document.documentElement.clientWidth;
    // tablets are between 768 and 922 pixels wide
    // phones are less than 768 pixels wide
    if (width < 960) {
      zoom = 4;
    }
    else {
      zoom = 5;
    }

      map.setView([lat, lng], zoom);
      info.update(null);
      // console.log(selected);
      // dehighlight(selected);
      // deselect(selected);
      geojson.resetStyle(selected);
        // select(eselected.target);
  },

  _createButton: function (html, title, className, container, fn) {
      var link = L.DomUtil.create('a', className, container);
      link.innerHTML = html;
      link.href = '#';
      link.title = title;

      L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
          .on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', fn, this)
          .on(link, 'click', this._refocusOnMap, this);

      return link;
  },

  _updateDisabled: function () {
      var map = this._map,
          className = 'leaflet-disabled';

      L.DomUtil.removeClass(this._zoomInButton, className);
      L.DomUtil.removeClass(this._zoomOutButton, className);

      if (map._zoom === map.getMinZoom()) {
          L.DomUtil.addClass(this._zoomOutButton, className);
      }
      if (map._zoom === map.getMaxZoom()) {
          L.DomUtil.addClass(this._zoomInButton, className);
      }
  }
});
// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);







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
      : "Click or tap a Natural Resource Management Area (NRM)");
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
  info.update(layer.feature.properties);
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

function zoomToFeature(e) {
  if(e) {
  map.fitBounds(e.target.getBounds());
  }
}

function deselect(layer) {
  if (selected !== null) {
    var previous = selected;
    dehighlight(previous);
  }
  selected = null;
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


// L.Map.prototype.panToOffset = function (latlng, offset, options) {
//   var x = this.latLngToContainerPoint(latlng).x - offset[0]
//   var y = this.latLngToContainerPoint(latlng).y - offset[1]
//   var point = this.containerPointToLatLng([x, y])
//   return this.setView(point, this._zoom, { pan: options })
// }

// L.Map.prototype.setViewOffset = function (latlng, offset, targetZoom) {
//   var targetPoint = this.project(latlng, targetZoom).subtract(offset),
//   targetLatLng = this.unproject(targetPoint, targetZoom);
//   return this.setView(targetLatLng, targetZoom);
// }



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
          // highlight(e.target);
        }
      },
      mouseout: function(e) {
        // console.log('hoverout');
        if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
          // dehighlight(e.target);
          // info.update(null);
        }
        // console.log('deselect');
      },
      click: function(e) {
        zoomToFeature(e);
        highlight(e.target);
        select(e.target);
         if (selected) {
          if (selected._leaflet_id == layer._leaflet_id) {
           console.log('zoomoutandfit')
          //  highlight(e.target);
          //  deselect(e.target);
           
          // deselect(e.target);
          // console.log('deselect');
         }
        }
          // dehighlight(e.target);
          // select(e.target);
          // highlight(e.target);

        // }
      // click: function(e) {
        // console.log(map);
        // info.update(null);
        
        // if (selected) {
        //   // console.log('passes');
        //   dehighlight(e.target);
        //   highlight(e.target);
        //   if(map.getZoom < 6) {
        //     map.setZoom(6);
        //   }
        // }
        
        //select(e.target);
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