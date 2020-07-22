// Alternatively, you can set a GOOGLE_API_KEY environment variable and instantiate like so:
var civicInfo = require("civic-info")();

civicInfo.elections(function(error, data) {
  console.log(data);
});