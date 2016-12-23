const app = angular.module('myApp', ['ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.resizeColumns']);

app.controller('myCtrl', mainCtrl);

function mainCtrl($uibModal) {

  let $ctrl = this;

  let tab = localStorage.getItem('tab');

  (tab) ? $ctrl.tab = Number(tab) : $ctrl.tab = 0;

  $ctrl.changeTab = (val) => {
    $ctrl.tab = val;
    localStorage.setItem('tab', val);
  };

  localStorage.getItem('week') ? $ctrl.week = Number(localStorage.getItem('week')) : $ctrl.week = 1;

  $ctrl.admin = localStorage.getItem('admin');

  $ctrl.login = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/login.html',
      controller: loginModalController,
    });
    modalInstance.result.then(
      (val) => {
        localStorage.setItem('admin', true);
        $ctrl.admin = true;
      },
      (val) => null
    );
  };

  $ctrl.logout = () => {
    let modalInstance = $uibModal.open({
      animate: false,
      templateUrl: 'modals/logout.html',
      controller: logoutModalController,
      controllerAs: '$ctrl'
    });
    modalInstance.result.then(
      (val) => {
        localStorage.setItem('admin', false);
        $ctrl.admin = false;
        $ctrl.tab = 0;
      },
      (val) => null
    );
  };

}

loginModalController = ($uibModalInstance, $scope) => {

  $scope.username = '';
  $scope.password = '';

  $scope.ok = function() {
    if ($scope.username === 'admin' && $scope.password === 'admin') {
      $uibModalInstance.close('ok');
    }
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
};

logoutModalController = ($uibModalInstance, $scope) => {

  $scope.ok = function() {
    $uibModalInstance.close('ok');
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

};

app.filter('arrayToString', ArrayToString);

function ArrayToString($filter) {

  function stringify(items) {
    return items.toString().replace(/,/g, ', ');
  }

  return function(items, field, titleCase) {

    let result = '&nbsp;', temp = [];
    if (field) {
      angular.forEach(items, function(item) {
        let value = item[field];
        if (titleCase) {
          value = $filter('titleCaseFilter')(value);
        }
        temp.push(value);
      });
      if (temp.length > 0) {
        result = stringify(temp);
      }
    }
    else {
      if (items && angular.isArray(items) && items.length > 0) {
        result = stringify(items);
        if (titleCase) {
          result = $filter('titleCaseFilter')(result);
        }
      }
    }

    return result;
  };
}
