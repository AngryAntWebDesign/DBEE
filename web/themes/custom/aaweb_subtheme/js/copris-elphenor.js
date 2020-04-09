    var conceptName = 'Copris elphenor';
    var dynamicVar = "season_Copris_elphenor";
    // ********************************
    // ALL CONNECTED TO OUR HOVER LABEL
    // ********************************     
    // // control that shows state info on hover
    var info = L.control({ position: "topleft" });
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

  presence = (eval('props.'+dynamicVar+'_Yr') == 1) ?  '' :  'absent';
    presence_a = (eval('props.'+dynamicVar+'_A') == 1) ? ' autumn' : '';
    presence_w = (eval('props.'+dynamicVar+'_W') == 1) ? ' winter' : '';
    presence_s = (eval('props.'+dynamicVar+'_S') == 1) ?  ' summer' : '';
    presence_sp = (eval('props.'+dynamicVar+'_Sp') == 1) ? ' spring' : '';
  presence_joined = presence + presence_a + presence_w  + presence_s + presence_sp;
    i = 0;
    presence_joined = presence_joined.replace(/\s/g, m  => !i++ ? m : ', ');
    }
    this._div.innerHTML =
      "<h4>" + conceptName + "</h4>" +
      (props
        ? 
          "<b>NRM:</b> " + " " + props.NRM_REGION + "<br /><b>STATE: </b>" + props.STATE +
          "<br /><br />" +
          "<b>" +
      presence_joined + "</b>"
        : "Hover over a Natural Resource Management Area (NRM)");
    };
    // this adds the info layer to the map object
    info.addTo(map);
    // ************ FINISH HOVER DEFINITION
    // styling the tile or feature sing teh fillcolour function above and the prop densicey from the GEOjson
function style(feature) {
  return {
    weight: 0.4, // line width
    opacity: 1, // opacity
    color: "#fff", // border colour
    dashArray: "",
    fillOpacity: .6,
    fillColor: getColor(eval('feature.properties.'+dynamicVar+'_Yr'))
  };
}