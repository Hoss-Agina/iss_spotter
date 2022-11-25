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

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords['latitude']}&lon=${coords['longitude']}`, (error, response, body) => {
    if (error) {
      // callback(error, null);
      return (error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      return (msg, null);
    }
    const arrOfRiseTimes = JSON.parse(body)["response"];
    callback(null, arrOfRiseTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      // console.log("It didn't work!" , error);
      return (error, null);
    }
    // console.log('It worked! Returned IP:' , ip);
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        // console.log("It didn't work!" , error);
        return (error, null);
      }
      // console.log(coords);
      fetchISSFlyOverTimes(coords, (error, arrOfRiseTimes) => {
        if (error) {
          // console.log(error);
          return (error, null);
        }
        callback(error, arrOfRiseTimes);
      });
    });
  });
};

// module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes};
module.exports = { nextISSTimesForMyLocation };
