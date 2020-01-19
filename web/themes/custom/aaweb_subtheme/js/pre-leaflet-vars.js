// LEAFLET PRESENCE MAP HAS BEEN SPLIT INTO THREE FILES FOR MAINTENANCE AND OPTIMISATION PURPOSES
// ****************
// 1. pre-leaflet-vars, 2. data NRM-regions.js the JSON nrmdata var 3. species name specific column defniitions from the JSON.
// If new species are intorduced simply copy a species file and within 100 lines of code all vars are set
var speciesType = '';
var year = '';
var summer = '';
var spring = '';
var winter = '';
var autum = '';

var width = document.documentElement.clientWidth;
if (width < 960) {
    var dynamicZoom = 4;
}
else {
    var dynamicZoom = 5;
}
var map = L.map("map").setView([-28.3202, 132.948], dynamicZoom);
var mySelector = jQuery("#mySelector");    
L.tileLayer(
    "https://api.mapbox.com/styles/v1/angryantweb/ck1ifhzd81fwp1cpgtlk42k1i/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2pwcnlzeGJ2MHowbTQzbnZhZHE0dWoybCJ9.hIg1J7n1f91VwNLuz-F67w",
    {
    maxZoom: 18,
    attribution:
    'Map data &copy; <a href="http://ala.org.au">Atlas Living Australia</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // id: "mapbox.light-v9",
    accessToken: 'pk.eyJ1IjoiYW5ncnlhbnR3ZWIiLCJhIjoiY2p6b25ta2NxMGQ2ZzNibnBqdXl0ZTU1YSJ9.vZAZHUOSEatZCVyOo0pI2w'
    }
).addTo(map);