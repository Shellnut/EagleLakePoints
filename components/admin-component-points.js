/**
 * Created by KShellnut on 12/21/16.
 */

angular.module('myApp').component('adminComponentPoints', {
  templateUrl: 'components/admin-component-points.html',
  controller: adminComponentPointsController
});

function adminComponentPointsController($uibModal, myService) {

  const $ctrl = this;

  $ctrl.sortReverse = true;
  $ctrl.sortType = 'Big Team';
  $ctrl.lock = true;
  $ctrl.edit = -1;

  $ctrl.headings = [
    {
      key: 'pencil',
      val: '',
      sort: false
    },
    {
      key: 'bigTeam',
      val: 'Big Team',
      sort: true
    },
    {
      key: 'smallTeam',
      val: 'Small Team',
      sort: true
    },
    {
      key: 'counselors',
      val: 'Counselors',
      sort: false
    },
    {
      key: 'cabin',
      val: 'Cabin',
      sort: true
    },
    {
      key: 'cheer',
      val: 'Cheer',
      sort: true
    },
    {
      key: 'ctf',
      val: 'CTF',
      sort: true
    },
    {
      key: 'maximus',
      val: 'Maximus',
      sort: true
    },
    {
      key: 'trash',
      val: 'Trash',
      sort: true
    },
    {
      key: 'scripture',
      val: 'Scripture',
      sort: true
    },
    {
      key: 'total',
      val: 'Total',
      sort: true
    },
    {
      key: 'lock',
      val: 'Lock',
      sort: false
    }
  ];

  localStorage.getItem('week') ? $ctrl.week = Number(localStorage.getItem('week')) : $ctrl.week = 1;

  myService.getBigTeamNames()
    .success((result) => {
    $ctrl.bigTeamNames = result[0];
    $ctrl.team1 = $ctrl.bigTeamNames.team1;
    $ctrl.team2 = $ctrl.bigTeamNames.team2;
  }).catch((err) => console.log('err is:', err));

  myService.getCounselors()
    .success((result) => $ctrl.counselors = result)
    .catch((err) => console.log('err is:', err));

  myService.getSmallTeams()
    .success((result) => $ctrl.smallTeams = result)
    .catch((err) => console.log('err is:', err));

  myService.getWeek($ctrl.week)
    .success((result) => $ctrl[`week${$ctrl.week}`] = result)
    .catch((err) => console.log('err is:', err));

  $ctrl.addSmallTeamWeek = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/add-small-team-points.html',
      controller: addSmallTeamWeekModalController,
      controllerAs: '$ctrl',
      resolve: {
        bigTeamNames: () => $ctrl.bigTeamNames,
        counselors: () => $ctrl.counselors,
        smallTeams: () => $ctrl.smallTeams
      }
    });
    modalInstance.result.then(
      (val) => {
        myService.addWeekTeam($ctrl.week, val).then(() => {
          myService.getWeek($ctrl.week)
            .success((result) => $ctrl[`week${$ctrl.week}`] = result)
            .catch((err) => console.log('err is:', err));
        }, (err) => console.log('err is:', err));
      }
    );
  };

  $ctrl.editSmallTeamWeek = (data) => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/edit-small-team-points.html',
      controller: editSmallTeamWeekModalController,
      controllerAs: '$ctrl',
      resolve: {
        bigTeamNames: () => $ctrl.bigTeamNames,
        counselors: () => $ctrl.counselors,
        smallTeams: () => $ctrl.smallTeams,
        data: () => data
      }
    });
    modalInstance.result.then(
      (val) => {
        myService.updateWeekTeam($ctrl.week, val, val._id.$oid).then(() => null);
      }
    );
  };

  $ctrl.removeSmallTeam = (team, index) => {
    myService.deleteWeekTeam($ctrl.week, team._id.$oid).then(() => {
      $ctrl[`week${$ctrl.week}`].splice(index, 1)
    });
    $ctrl.lock = true;
  };

  $ctrl.updateSmallTeam = (team) => {
    myService.updateWeekTeam($ctrl.week, team, team._id.$oid).then(() => null);
  };

  $ctrl.changeWeek = (index) => {

    localStorage.setItem('week', index);
    $ctrl.week = index;

    myService.getWeek($ctrl.week)
      .success((result) => $ctrl[`week${$ctrl.week}`] = result)
      .catch((err) => console.log('err is:', err));

  };

  $ctrl.scriptureMath = (scripture) => (scripture.campers < 1) ? 0 : (scripture.verses/scripture.campers) * 2500;
  $ctrl.totalMath = (val) => val.cabin.monday + val.cabin.tuesday + val.cabin.wednesday + val.cheer.monday + val.cheer.tuesday + val.cheer.wednesday + val.ctf + val.maximus.cheer + val.maximus.race + (val.trash * 10) + $ctrl.scriptureMath(val.scripture);

}

addSmallTeamWeekModalController = function($uibModalInstance, bigTeamNames, counselors, smallTeams) {

  let $ctrl = this;

  $ctrl.bigTeamNames = angular.copy(bigTeamNames);
  $ctrl.counselors = angular.copy(counselors);
  $ctrl.smallTeams = angular.copy(smallTeams);
  $ctrl.counselor = '';
  $ctrl.checkboxes = {};

  $ctrl.data = {
    bigTeam: '',
    counselors: [],
    smallTeam: '',
    cabin: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
    },
    cheer: {
      monday: 0,
      tuesday: 0,
      wednesday: 0
    },
    ctf: 0,
    maximus: {
      cheer: 0,
      race: 0
    },
    trash: 0,
    scripture: {
      verses: 0,
      campers: 0
    }
  };

  $ctrl.addCounselor = (bool, val) => {
    if (bool) {
      $ctrl.data.counselors.push(`${val.firstName} ${val.lastName}`);
    }
    else {
      $ctrl.data.counselors = $ctrl.data.counselors.filter((el) => val.firstName !== el.firstName && val.lastName !== el.lastName);
    }
  };


  $ctrl.ok = function() {
    $uibModalInstance.close($ctrl.data);
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};


editSmallTeamWeekModalController = function($uibModalInstance, bigTeamNames, counselors, smallTeams, data) {

  let $ctrl = this;

  $ctrl.bigTeamNames = angular.copy(bigTeamNames);
  $ctrl.counselors = angular.copy(counselors);
  $ctrl.smallTeams = angular.copy(smallTeams);
  $ctrl.counselor = '';
  $ctrl.checkboxes = {};
  $ctrl.data = data;

  $ctrl.bigTeam = data.bigTeam;
  $ctrl.smallTeam = data.smallTeam;

  $ctrl.data = data;

  counselors.forEach((val, index) => {
    if (data.counselors.indexOf(`${val.firstName} ${val.lastName}`) > -1) {
      $ctrl.checkboxes[`val${index}`] = true
    }
  });

  $ctrl.addCounselor = (bool, val) => {
    if (bool) {
      $ctrl.data.counselors.push(`${val.firstName} ${val.lastName}`);
    }
    else {
      $ctrl.data.counselors = $ctrl.data.counselors.filter((el) => `${val.firstName} ${val.lastName}` !== el);
    }
  };

  $ctrl.ok = function() {
    $uibModalInstance.close($ctrl.data);
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};
