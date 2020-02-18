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

function stuffToRezie() {
  var h_window = $(window).height();
  var h_map = h_window - 125;
  $('#map1').css('height', h_map);
}

$(window).on("resize", stuffToRezie).trigger('resize');

function chooseColor(dist) {
  switch (dist) {
    case "SOUTHERN":
      return "yellow";
    case "MISSION":
      return "red";
    case "TENDERLOIN":
      return "orange";
    case "CENTRAL":
      return "green";
    case "OUT OF SF":
      return "black";
    case "BAYVIEW":
      return "blue";
    case "INGLESIDE":
      return "brown";
    case "TARAVAL":
      return "pink";
    case "RICHMOND":
      return "lime";
    case "NORTHERN":
      return "gold";
    case "PARK":
      return "purple";
    default:
      return "black";
  }
}

function createMap(markers, Prostitution, Counterfeiting, Drug_offense, districs) {

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
    "Incidents": markers,
    "Prostitution": Prostitution,
    "Counterfeiting": Counterfeiting,
    "Drug Offense": Drug_offense,
    "Districts": districs
  };

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}

d3.json("/leaflet").then(data => {
  console.log(data);
  d3.json("/geojson").then(geodata => {
    console.log(geodata);
    d3.json("/districts").then(distric => {
      console.log(distric);
      var selector = d3.select("#selDataset");
      // Use the list of sample names to populate the select options
      d3.json("/names").then((districtNames) => {
        console.log(districtNames);
        districtNames.forEach((dstrict) => {
          selector
            .append("option")
            .text(dstrict)
            .property("value", dstrict);
        });
      });
      createFeatures(data, geodata, distric);
    })
  })
})


function createFeatures(data, geodata, distric) {
  var markers = L.markerClusterGroup();

  function geticon(response) {
    if ("Larceny Theft" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/thief_PNG38.png',
        iconSize: [30, 30]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else if ("Other Miscellaneous" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/anonymous_mask_PNG2.png',
        iconSize: [30, 30]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else if ("Weapons Offense" === response || "Weapons Carrying Etc" === response) {
      var iconOptions = {
        iconUrl: 'static/icons/gangster_PNG77.png',
        iconSize: [30, 30]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }
    else {
      var iconOptions = {
        iconUrl: 'static/icons/pin-80.png',
        iconSize: [30, 30]
      }
      let customIcon = L.icon(iconOptions);
      return customIcon
    }


  }

  var district_array = [];
  district_array["Northern"] = 0; district_array["Park"] = 0; district_array["Ingleside"] = 0; district_array["Southern"] = 0;
  district_array["Richmond"] = 0; district_array["Mission"] = 0; district_array["Taraval"] = 0; district_array["Tenderloin"] = 0; 
  district_array["Central"] = 0; district_array["Bayview"] = 0;
 
  for (var i = 0; i < data.length; i++) {
    var coord = [data[i].Lat, data[i].Lon];
    var marker = L.marker(coord, { icon: geticon(data[i].Category) })
      .bindPopup("<h3>Category:<strong> " + data[i].Category + " </strong></h3><h4><br>Description: <strong>" + data[i].Description);
    markers.addLayer(marker);
    district_array[data[i].Police_Dist]++;
  }
  myMap.addLayer(markers);

  var Prostitution = L.geoJson(geodata, {
    filter: function (feature, layer) {
      return feature.properties.incident_category == "Prostitution" && feature.properties.incident_year == "2020";
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: geticon(feature.properties.incident_category)
      }).on('mouseover', function () {
        this.bindPopup(feature.properties.incident_description).openPopup();
      });
    }
  });

  var coord_line = [];
  var Counterfeiting = L.geoJson(geodata, {
    filter: function (feature, layer) {
      return feature.properties.incident_category == "Forgery And Counterfeiting" && feature.properties.incident_year == "2020";
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: geticon(feature.properties.incident_category)
      }).on('mouseover', function () {
        this.bindPopup(feature.properties.incident_description).openPopup();
      });
    },
    onEachFeature: function (feature, layer) {
      var coords = feature.geometry.coordinates;
      var lengthOfCoords = feature.geometry.coordinates.length;
      let holdLon;
      holdLon = coords[0];
      coords[0] = coords[1];
      coords[1] = holdLon;
      coord_line.push(coords);
    }
  });

  // var offset = L.polyline(coord_line, {
  //   offset: 5,
  //   color: "black"
  // }).addTo(myMap);

  var Drug_offense = L.geoJson(geodata, {
    filter: function (feature, layer) {
      return feature.properties.incident_category == "Drug Offense" && feature.properties.incident_year == "2020";
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: geticon(feature.properties.incident_category)
      }).on('mouseover', function () {
        this.bindPopup(feature.properties.incident_description).openPopup();
      });
    }
  });

  var districs = L.geoJson(distric, {
    // Style each feature (in this case a neighborhood)
    style: function (feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.district),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function (event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      tempCount = district_array[firstLetterUpperCase(feature.properties.district)];
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h2>District: " + feature.properties.district + "</h2><hr><h2>Total Incidents: "+ tempCount);

    }
  });

  createMap(markers, Prostitution, Counterfeiting, Drug_offense, districs);
}

L.polygon([
  [37.777228, -122.416272],
  [37.786046, -122.418722],
  [37.789039, -122.408580],
  [37.780899, -122.402637]
], {
  renderer: L.Canvas.roughCanvas(),
  fillColor: 'grey',
  fillStyle: 'zigzag-line',
  fillWeight: 1,
  hachureAngle: -41,
  hachureGap: 3
}).bindTooltip('Drug Offense').addTo(myMap);

// L.polygon([
//   [37.785792, -122.412989],
//   [37.782977, -122.412431],
//   [37.782349, -122.417355],
//   [37.785131, -122.417913]
// ], {
//   renderer: L.Canvas.roughCanvas(),
//   fillColor: 'green',
//   fillStyle: 'cross-hatch',
//   fillWeight: 2,
//   hachureAngle: -10,
//   hachureGap: 3
// }).bindTooltip('Counterfeiting money').addTo(myMap);

L.polygon([[
  [37.788217, -122.408397],
  [37.787301, -122.408193],
  [37.786903, -122.411497],
  [37.787844, -122.411733]
], [
  [37.758866, -122.414705],
  [37.758679, -122.417988],
  [37.763455, -122.418428],
  [37.763599, -122.416250]
]], {
  renderer: L.Canvas.roughCanvas(),
  fillColor: 'blue',
  fillStyle: 'dashed',
  fillWeight: 2,
  hachureAngle: -60,
  hachureGap: 3
}).bindTooltip('Prostitution').addTo(myMap);

function optionChanged(newSample) {
  d3.json(`/samples/${newSample}`).then((data) => {
    console.log(data);

    // fmarkers.clearLayers();
    // myMap.removeLayer(fmarkers);
    var fmarkers = L.markerClusterGroup();

    for (var i = 0; i < data.length; i++) {
      var coord = [data[i].Lat, data[i].Lon];
      var marker = L.marker(coord)
        .bindPopup("<h4>Category:<strong> " + data[i].Category + "</strong><br><h4>Description:" + data[i].Description + "<br><h4>District: " + data[i].Police_Dist);
      fmarkers.addLayer(marker);

    }
    myMap.addLayer(fmarkers);
  })
}

function firstLetterUpperCase (word){
  temp = word.toLowerCase();
  return (temp.charAt(0).toUpperCase()+ temp.slice(1)); 
}
