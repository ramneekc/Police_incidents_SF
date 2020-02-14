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

function createMap(markers){

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

d3.json("/leaflet").then(data => { console.log(data);createFeatures(data) })

function createFeatures(data){
    var markers = L.markerClusterGroup();
    for (var i=0; i< data.length; i++){
        var coord = [data[i].Lat, data[i].Lon];

        var marker = L.marker(coord);
                    //   .bindPopup("<h1"+data[i].Category);
        markers.addLayer(marker).bindPopup("<h1"+data[i].Category);                
    }
    myMap.addLayer(markers);
    createMap(markers);
}