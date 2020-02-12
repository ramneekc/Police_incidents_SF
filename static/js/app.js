

var markers = [];

function createFeatures(data){
    for (var i=0; i< data.length; i++){
        var coord = [data[i].Lat, data[i].Lon];

        var marker = L.marker(coord)
                      .bindPopup("<h1"+data[i].Category);
        markers.push(marker);                
    }
    console.log("function createfeatures")
    createMap(markers);
}

function createMap(markers){
    console.log(markers);
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
    
    var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
    
    var pencil = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.pencil",
      accessToken: API_KEY
    });
    
    var baseMaps = {
      Satellite: satellite,
      Dark: dark,
      Pencil: pencil
    };
    console.log("basemap");
    var markerGroup = L.layerGroup(markers);
    var overlayMaps = {
      "Incidents": markerGroup
    };
    console.log(markerGroup);
    var myMap = L.map("map", {
      center: [37.7749, -122.4194],
      zoom: 3,
      layers: [satellite, markerGroup]
    });
    // legend.addTo(myMap)
    console.log("map")
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
  }

// d3.json("/leaflet").then(data => {
//     console.log("this is app.js");
//     console.log(data);
//     createFeatures(data)
// })

createMap([]);