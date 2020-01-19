    var conceptName = 'Onthophagus sagittarius';
    var dynamicVar = "season_Onthophagus_sagittarius";
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
      presence = (eval('props.'+dynamicVar+'_Yr') == 1) ?  'PRESENT - ' :  'NOT PRESENT';
      presence_a = (eval('props.'+dynamicVar+'_A') == 1) ? 'Autum' : '';
      presence_w = (eval('props.'+dynamicVar+'_W') == 1) ? 'Winter' : '';
      presence_s = (eval('props.'+dynamicVar+'_S') == 1) ?  'Summer' : '';
      presence_sp = (eval('props.'+dynamicVar+'_Sp') == 1) ? 'Spring' : '';
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
    // styling the tile or feature sing teh fillcolour function above and the prop densicey from the GEOjson
    function style(feature) {
      return {
        weight: 0.8,
        opacity: 1,
        color: "white",
        dashArray: "1",
        fillOpacity: 0.5,
        fillColor: getColor(eval('feature.properties.'+dynamicVar+'_Yr'))
      };
    }