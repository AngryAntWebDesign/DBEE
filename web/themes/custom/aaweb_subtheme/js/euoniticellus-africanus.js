

var speciesType = '';
    var year = '';
    var summer = '';
    var spring = '';
    var winter = '';
    var autum = '';
    var conceptName = 'Euoniticellus africanus';
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
          'Map data &copy; <a href="http://ala.org.au">Atlast Living Australia</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        // id: "mapbox.light-v9",
        accessToken: 'pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2p6b25ta2NxMGQ2ZzNibnBqdXl0ZTU1YSJ9.vZAZHUOSEatZCVyOo0pI2w'
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
    // we have this layer called info update it use a function to look at props and assign text within the layer
    info.update = function(props) {
      // SET SOME DEFAULTS FOR OUR VARIABLES
      presence = 'NOT PRESENT';
      presence_a = '';
      presence_w = '';
      presence_s = '';
      presence_sp = '';
      // FIRST CHECK ITS GOT A HOVER STATE OTHERWISE ERRORS
      if(props) {
      presence = (props.season_Euoniticellus_Africanus_Yr == 1) ?  'PRESENT - ' :  'NOT PRESENT';
      presence_a = (props.season_Euoniticellus_Africanus_A == 1) ? 'Autum' : '';
      presence_w = (props.season_Euoniticellus_Africanus_W == 1) ? 'Winter' : '';
      presence_s = (props.season_Euoniticellus_Africanus_S == 1) ?  'Summer' : '';
      presence_sp = (props.season_Euoniticellus_Africanus_Sp == 1) ? 'Spring' : '';
      }
      this._div.innerHTML =
        "<h4>" + conceptName + "</h4>" +
        (props
          ? 
            "<b>NRM:</b> " + " " + props.NRM_REGION + "<br /><b>STATE: </b>" + props.STATE +
            "<br /><br />" +
            "<b>" +
            presence + ' ' + presence_a + presence_w + ' ' + presence_s + ' ' + presence_sp + "</b>"
          : "Hover over a Natural Resource Management Area (NRM)");
    };
    // this adds the info layer to the map object
    info.addTo(map);
// ************ FINISH HOVER DEFINITION


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
        fillColor: getColor(feature.properties.season_Euoniticellus_Africanus_Yr)
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
    var legend = L.control({ position: "bottomright" });
    // modifies the legend adding the html structure to it
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = ["Present", "Absent"],
        labels = [];

      labels.push('<i style="background:gray;"></i>Absent');
      labels.push('<i style="background:black;"></i>Present');

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);