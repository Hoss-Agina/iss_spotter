const request = require("request");

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const ip = data["ip"];
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ipAdd, callback) {
  request(`http://ipwho.is/${ipAdd}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    let coordinates = {};
    const dataObj = JSON.parse(body);
    if (!dataObj.success) {
      const message = `Success status was ${dataObj.success}. Server message says: ${dataObj.message} when fetching for IP ${dataObj.ip}`;
      callback(message, null);
      return;
    }
    coordinates["latitude"] = dataObj["latitude"];
    coordinates["longitude"] = dataObj["longitude"];
    callback(null, coordinates);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP};