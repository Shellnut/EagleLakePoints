angular.module('myApp').service('myService', function($http) {

  const url = 'https://api.mongolab.com/api/1/databases/mydb/collections/';

  const apiKey = '?apiKey=7dwZtQjBFYhef4N4WHi6xuTnveN46vNQ';

  // ---------------------------
  // BIG TEAM
  // ---------------------------
  this.getBigTeamNames = function() {
    const collection = 'bigTeamNames';
    return $http.get(`${url}${collection}${apiKey}`)
  };

  this.updateBigTeamNames = function(id, data) {
    const collection = 'bigTeamNames';
    return $http.put(`${url}${collection}/${id}${apiKey}`, data);
  };

  this.getCounselors = function() {
    const collection = 'counselors';
    return $http.get(`${url}${collection}${apiKey}`)
  };

  // ---------------------------
  // SMALL TEAM
  // ---------------------------
  this.addCounselor = function(data) {
    const collection = 'counselors';
    return $http.post(`${url}${collection}${apiKey}`, data)
  };

  this.updateCounselor = function(data, id) {
    const collection = 'counselors';
    return $http.put(`${url}${collection}/${id}${apiKey}`, data)
  };

  this.deleteCounselor = function(id) {
    const collection = 'counselors';
    return $http.delete(`${url}${collection}/${id}${apiKey}`)
  };

  this.getSmallTeams = function() {
    const collection = 'smallTeams';
    return $http.get(`${url}${collection}${apiKey}`)
  };

  // ---------------------------
  // SMALL TEAM
  // ---------------------------
  this.addSmallTeam = function(data) {
    const collection = 'smallTeams';
    return $http.post(`${url}${collection}${apiKey}`, data)
  };

  this.updateSmallTeam = function(data, id) {
    const collection = 'smallTeams';
    return $http.put(`${url}${collection}/${id}${apiKey}`, data)
  };

  this.deleteSmallTeam = function(id) {
    const collection = 'smallTeams';
    return $http.delete(`${url}${collection}/${id}${apiKey}`)
  };

  // ---------------------------
  // WEEK POINTS
  // ---------------------------
  this.getWeek = function(weekNumber) {
    const collection = `week${weekNumber}`;
    return $http.get(`${url}${collection}${apiKey}`)
  };

  this.addWeekTeam = function(weekNumber, data) {
    const collection = `week${weekNumber}`;
    return $http.post(`${url}${collection}${apiKey}`, data)
  };

  this.updateWeekTeam = function(weekNumber, data, id) {
    const collection = `week${weekNumber}`;
    return $http.put(`${url}${collection}/${id}${apiKey}`, data)
  };

  this.deleteWeekTeam = function(weekNumber, id) {
    const collection = `week${weekNumber}`;
    return $http.delete(`${url}${collection}/${id}${apiKey}`)
  };

  //  myService.setWeekTeams().then((val) => console.log('val is:', val));
//  this.setWeekTeams = function() {
//    const collection = 'week1';
//    const data = [{
//      bigTeam: 'Rip Tide Riders',
//      counselors: [],
//      smallTeam: 'Poets of Podonk',
//      cabin: {
//        monday: 100,
//        tuesday: 100,
//        wednesday: 100,
//      },
//      cheer: {
//        monday: 100,
//        tuesday: 100,
//        wednesday: 100
//      },
//      ctf: 100,
//      maximus: {
//        cheer: 100,
//        race: 100
//      },
//      trash: 100,
//      scripture: {
//        verses: 0,
//        campers: 0
//      }
//    }];
//    return $http.post(`${url}${collection}${apiKey}`, data);
//  };

  //  myService.setBigTeamNames().then((val) => console.log('val is:', val));
  //  this.setBigTeamNames = function() {
  //    const collection = 'bigteamnames';
  //    const data = {
  //      team1: 'Big Surf Shredders',
  //      team2: 'Rip Tide Riders'
  //    };
  //    return $http.post(`${url}${collection}${apiKey}`, data);
  //  };

  //  myService.setSmallTeams().then((val) => console.log('val is:', val));
  //  this.setSmallTeams = function() {
  //    const collection = 'smallTeams';
  //    const data = [
  //      {
  //        name: 'Little Bo\'s peeps'
  //      },
  //      {
  //        name: 'Dublin Dubsteppers'
  //      },
  //      {
  //        name: 'Farmers pf Philippe'
  //      }
  //    ];
  //
  //    return $http.post(`${url}${collection}${apiKey}`, data);
  //  };

  //  myService.setCounselors().then((val) => console.log('val is:', val));
  //  this.setCounselors = function() {
  //    const collection = 'counselors';
  //    const data = [
  //      {
  //        firstName: 'Ryan',
  //        lastName: 'Hanstad',
  //        years: 'First Year',
  //      },
  //      {
  //        firstName: 'Emily',
  //        lastName: 'Evers',
  //        years: 'Second Year',
  //      },
  //      {
  //        firstName: 'Shane',
  //        lastName: 'Klackner',
  //        years: 'Third Year',
  //      }
  //    ];
  //
  //    return $http.post(`${url}${collection}${apiKey}`, data);
  //  };

});
