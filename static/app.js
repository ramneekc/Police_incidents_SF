var myMap = L.map("map1", {
  center: [37.7749, -122.4194],
  zoom: 13
});

var run_bike_hike = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.run-bike-hike",
  accessToken: API_KEY
}).addTo(myMap);

function stuffToRezie(){
  var h_window = $(window).height();
  var h_map = h_window - 125;
  $('#map1').css('height', h_map);
}

$(window).on("resize", stuffToRezie).trigger('resize'); 

var mapStyle = {
  color: "black",
  fillColor: "yellow",
  fillOpacity: 0.5,
  weight: 1.5
};

function createMap(markers) {

  var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var emerald = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.emerald",
    accessToken: API_KEY
  });

  var baseMaps = {
    Default: run_bike_hike,
    Pirates: pirates,
    Dark: dark,
    Emerald: emerald
  };

  var overlayMaps = {
    "Incidents": markers
  };

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}

d3.json("/leaflet").then(data => {
  console.log(data);
  d3.json("/dist_plots").then(dataplots => {
    console.log(dataplots);
    L.geoJson(dataplots, {
      style: mapStyle
    }).addTo(myMap);
  });
  createFeatures(data);
})

function createFeatures(data) {
  var markers = L.markerClusterGroup();

  function geticon(response) {
    if ("Larceny Theft" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/thief_PNG38.png',
        iconSize: [35, 35]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else if ("Other Miscellaneous" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/anonymous_mask_PNG2.png',
        iconSize: [35, 35]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else if ("Weapons Offense" === response || "Weapons Carrying Etc" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/gangster_PNG77.png',
        iconSize: [35, 35]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else {
      var iconOptions = {
        iconUrl: 'static/icons/pin-80.png',
        iconSize: [35, 35]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }


  }

  for (var i = 0; i < data.length; i++) {
    var coord = [data[i].Lat, data[i].Lon];
    var marker = L.marker(coord, { icon: geticon(data[i].Category) })
      .bindPopup("<h3>Category:<strong> " + data[i].Category + " </strong></h3><h4><br>Description: <strong>" + data[i].Description);
    markers.addLayer(marker);
  }
  myMap.addLayer(markers);
  createMap(markers);
}



// d3.json("/dist_plots").then(dataplots => {  
//   L.geoJson(dataplots, {
//     style: mapStyle
//   }).addTo(myMap);
// });

