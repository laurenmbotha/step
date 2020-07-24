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
var coordiantes = [];

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
            let size = quote.pollingLocations.length;
            if (size > 10) {
                size = 10;
            }
            for(let i=0; i < size; i++) {
                let br = document.createElement("br");
                let br1 = document.createElement("br");
                let comment  = document.createElement("p");
                let line1  = document.createElement("p");
                let line2  = document.createElement("p");
                comment.innerText = quote.pollingLocations[i].address.locationName;
                line1.innerText = quote.pollingLocations[i].address.line1;
                line2.innerText = quote.pollingLocations[i].address.city +", " + quote.pollingLocations[i].address.state + " " + quote.pollingLocations[0].address.zip;
                document.getElementById("random").appendChild(comment);
                document.getElementById("random").appendChild(line1);
                document.getElementById("random").appendChild(line2);
                document.getElementById("random").appendChild(br);
                document.getElementById("random").appendChild(br1);
                addresses.push(quote.pollingLocations[i].address.line1 + " " + quote.pollingLocations[i].address.city +", " + quote.pollingLocations[i].address.state + " " + quote.pollingLocations[0].address.zip);
            }
            
        }

     });
    console.log(addresses);
    console.log(addresses[0]);
    getCoord('https://maps.googleapis.com/maps/api/geocode/json?address=' + "4145 CHOLLA DR LAS CRUCES, NM 88011" + '&key=AIzaSyAZwerlkm0gx8mVP0zpfQqeJZM3zGUUPiM');
    //  for(let i=0; i < addresses; i++) {
    //      getCoord('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(addresses[i]) + '&key=AIzaSyAZwerlkm0gx8mVP0zpfQqeJZM3zGUUPiM');
    //  }
    console.log("2");
    //  getCoord('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address.value) + '&key=AIzaSyAZwerlkm0gx8mVP0zpfQqeJZM3zGUUPiM');

     //x  before, getData, create an array for addresses
     //x dynamically add addressed as we display them
     //create an matrix 
     //call getCoordinate and in getCoordinate add each lat and lang as an array element in list of coordiantes
     //go to initmap and loop through this list of lat and lang and dynamically add markers 
     // call getCoor on every addresss, adding new lat and long as a dictionary element in an array
     // after we have that data we can 

}



function getCoord(url){ //notes: build our lat long dictionary of all address
    //fetches the lat and long of the individuals gps so we can feed to the maps API
    fetch(url).then(response => response.json()).then((geo) => {
        latmap = geo.results[0].geometry.location["lat"];
        lngmap = geo.results[0].geometry.location["lng"];
        console.log("Lat:" + latmap + "Long: " + lngmap);
        console.log([latmap,lngmap])
        coordiantes.push([latmap,lngmap]);
    });
}

function initMap() {
    var uluru = {lat: latmap, lng: lngmap};
    var map = new google.maps.Map(
    document.getElementById('map'), {zoom: 4, center: uluru});
    var marker = new google.maps.Marker({position: uluru, map: map});

  
}

// window.addEventListener('load', (event) => {
//     console.log('The page has fully loaded');
//     fetchUser();
//     addBlob();
// });

function fetchBlobstoreUrlAndShowForm() {
  fetch('/blobstore-upload-url')
      .then((response) => {
        console.log(response);
        return response.text();
      })
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('my-form');
        messageForm.action = imageUploadUrl;
        // messageForm.classList.remove('hidden');
      });
}

//helper function to get id of element
function id(text) {
    return document.getElementById(text);
}