// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

  
var latmap = 0;
var lngmap = 0;
var address = '';
let addresses = [];
var coordinates = [];
var places = [];

function getData() {
    //fetches address from the form and displays nearby polling locations
    let form = document.getElementById("my-form");
    address = document.getElementById("my-form").elements["address"];
    fetch('https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=' + encodeURIComponent(address.value) +'&electionId=2000&officialOnly=true&returnAllAvailableData=true&key=AIzaSyClf-1yO8u6fBpnDyI9u_WTQZX4gYkbkWs').then(response => response.json()).then((quote) => {
        let address = document.getElementById("random");
        address.innerHTML = "";
        if (quote.pollingLocations === undefined) {
            let comment  = document.createElement("p");
            comment.innerText = "No polling locations in the same zipcode as your address";
            document.getElementById("random").appendChild(comment);
        } else {
            addAddresses(quote);
            // console.log(addresses);
            buildCoordinates(addresses);
            console.log(coordinates);
            initMap();
            makePlaces(coordinates);
            console.log(places);
            // makeMarkers(places);
            initMap();
        }
     });

}

function addAddresses(pollingInfo) {
    let size = pollingInfo.pollingLocations.length;
    if (size > 10) {
        size = 10;
    }
    for(let i=0; i < size; i++) {
        let br = document.createElement("br");
        let br1 = document.createElement("br");
        let comment  = document.createElement("p");
        let line1  = document.createElement("p");
        let line2  = document.createElement("p");
        comment.innerText = pollingInfo.pollingLocations[i].address.locationName;
        line1.innerText = pollingInfo.pollingLocations[i].address.line1;
        line2.innerText = pollingInfo.pollingLocations[i].address.city +", " + pollingInfo.pollingLocations[i].address.state + " " + pollingInfo.pollingLocations[0].address.zip;
        document.getElementById("random").appendChild(comment);
        document.getElementById("random").appendChild(line1);
        document.getElementById("random").appendChild(line2);
        document.getElementById("random").appendChild(br);
        document.getElementById("random").appendChild(br1);
        // console.log('appending to address:' + addresses.length);
        addresses.push(pollingInfo.pollingLocations[i].address.line1 + " " + pollingInfo.pollingLocations[i].address.city +", " + pollingInfo.pollingLocations[i].address.state + " " + pollingInfo.pollingLocations[0].address.zip);
    }
            
}

function getHomeCoord(url){ //notes: build our lat long dictionary of all address
    //fetches the lat and long of the individuals gps so we can feed to the maps API
    fetch(url).then(response => response.json()).then((geo) => {
        let homeLat = geo.results[0].geometry.location["lat"];
        let homeLng = geo.results[0].geometry.location["lng"];
        
    });
}

function getCoord(url){ //notes: build our lat long dictionary of all address
    //fetches the lat and long of the individuals gps so we can feed to the maps API
    fetch(url).then(response => response.json()).then((geo) => {
        latmap = geo.results[0].geometry.location["lat"];
        lngmap = geo.results[0].geometry.location["lng"];
        coordinates.push({lat: latmap, lng: lngmap});

    });
}

function buildCoordinates(adds) {
    for(let i=0; i < adds.length; i++) {
         getCoord('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(adds[i]) + '&key=AIzaSyAZwerlkm0gx8mVP0zpfQqeJZM3zGUUPiM');
     }
}


function initMap() {
    var uluru = {lat: latmap, lng: lngmap};
    var map = new google.maps.Map(
    document.getElementById('map'), {zoom: 4, center: uluru});
    var marker = new google.maps.Marker({position: uluru, map: map});

}

function makePlaces(coords) {
    for(let i=0; i < coords.length; i++) {
        console.log("entering make places " + i );
        var place = {lat: coords[0], lng: coords[1]};
        places.push(place);
        // console.log(places);
    }
}
// function makeMarkers(plcs) {
//     for(let i=0; i < plcs.length; i++) {
//         console.log("entering make markers " + i );
//         new google.maps.Marker({position: places[i], map: map});
//     }
// }




// function fetchBlobstoreUrlAndShowForm() {
//   fetch('/blobstore-upload-url')
//       .then((response) => {
//         console.log(response);
//         return response.text();
//       })
//       .then((imageUploadUrl) => {
//         const messageForm = document.getElementById('my-form');
//         messageForm.action = imageUploadUrl;
//         // messageForm.classList.remove('hidden');
//       });
// }
