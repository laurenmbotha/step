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


function getData() {
    fetch('/comment').then(response => response.text()).then((quote) => {
        let dict = JSON.parse(quote);
        console.log(dict);
        for(let i = 0; i < dict.length; i++) {
            let comment  = document.createElement("p");
            comment.innerText = dict[i]["author"] + ": " +  dict[i]["title"];
            document.getElementById("data-container").appendChild(comment)
        }
  });
}
    