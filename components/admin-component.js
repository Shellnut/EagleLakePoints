/**
 * Created by KShellnut on 12/20/16.
 */

angular.module('myApp').component('adminComponent', {
  templateUrl: 'components/admin-component.html',
  controller: adminComponentController
});

function adminComponentController($uibModal, myService) {

  const $ctrl = this;

  $ctrl.counselorLock = true;
  $ctrl.smallTeamLock = true;
  $ctrl.counselorEdit = -1;

  myService.getBigTeamNames()
    .success((result) => $ctrl.bigTeamNames = result[0])
    .catch((err) => console.log('err is:', err));

  myService.getCounselors()
    .success((result) => $ctrl.counselors = result)
    .catch((err) => console.log('err is:', err));

  myService.getSmallTeams()
    .success((result) => $ctrl.smallTeams = result)
    .catch((err) => console.log('err is:', err));

  $ctrl.editBigTeams = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/edit-big-teams.html',
      controller: editBigTeamsModalController,
      controllerAs: '$ctrl',
      resolve: {
        bigTeamNames: $ctrl.bigTeamNames
      }
    });
    modalInstance.result.then(
      (val) => {
        myService.updateBigTeamNames($ctrl.bigTeamNames._id.$oid, $ctrl.bigTeamNames).then(() => {
          $ctrl.bigTeamNames = val;
        }, (err) => console.log('err is:', err));
      }
    );
  };


  $ctrl.addCounselor = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/add-counselor.html',
      controller: addCounselorModalController,
      controllerAs: '$ctrl'
    });
    modalInstance.result.then(
      (val) => {
        myService.addCounselor(val).then((val) => {
          $ctrl.counselors.push(val.data);
        });
      },
      (err) => console.log('err is:', err)
    );
  };

  $ctrl.removeCounselor = (counselor, index) => {
    myService.deleteCounselor(counselor._id.$oid).then(()=> {
      $ctrl.counselors.splice(index, 1)
    });
    $ctrl.counselorLock = true;
  };

  $ctrl.editCounselor = (counselor) => {
    myService.updateCounselor(counselor, counselor._id.$oid)
      .then(() => null, (err) => console.log('err is', err));
  };

  $ctrl.addSmallTeam = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/add-small-team.html',
      controller: addSmallTeamModalController,
      controllerAs: '$ctrl'
    });
    modalInstance.result.then(
      (val) => {
        myService.addSmallTeam(val).then((val) => {
          $ctrl.smallTeams.push(val.data);
        });
      },
      (err) => console.log('err is:', err)
    );
  };

  $ctrl.removeSmallTeam = (smallTeam, index) => {
    myService.deleteSmallTeam(smallTeam._id.$oid).then(()=> {
      $ctrl.smallTeams.splice(index, 1)
    });
  };

  $ctrl.editSmallTeam = (smallTeam) => {
    myService.updateSmallTeam(smallTeam, smallTeam._id.$oid)
      .then(() => null, (err) => console.log('err is', err));
  };

}

editBigTeamsModalController = function($uibModalInstance, bigTeamNames) {

  let $ctrl = this;

  $ctrl.bigTeamNames = bigTeamNames;

  $ctrl.ok = function() {
    $uibModalInstance.close($ctrl.bigTeamNames);
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};

addCounselorModalController = function($uibModalInstance) {

  let $ctrl = this;

  $ctrl.name = {
    firstName: '',
    lastName: '',
    years: 'First Year',
  };

  $ctrl.ok = function() {
    $uibModalInstance.close($ctrl.name);
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};

addSmallTeamModalController = function($uibModalInstance) {

  let $ctrl = this;

  $ctrl.data = {
    name: ''
  };

  $ctrl.ok = function() {
    $uibModalInstance.close($ctrl.data);
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};
