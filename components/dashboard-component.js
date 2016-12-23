/**
 * Created by KShellnut on 12/20/16.
 */

angular.module('myApp').component('dashboardComponent', {
  templateUrl: 'components/dashboard-component.html',
  controller: dashboardComponentController
});

function dashboardComponentController(myService, uiGridConstants) {
  const $ctrl = this;

  localStorage.getItem('week') ? $ctrl.week = Number(localStorage.getItem('week')) : $ctrl.week=1;

  myService.getBigTeamNames().success((result)=> {
    $ctrl.bigTeams = result[0];

    // Nesting because both are needed for table and async is lame
    myService.getWeek($ctrl.week).success((result)=> {
      $ctrl.allData = result;
      $ctrl.gridOptions.data = transformedData(result);
    });

  });

  $ctrl.changeWeek = function(index) {
    localStorage.setItem('week', index);
    $ctrl.week = index;

    myService.getBigTeamNames().success((result)=> {
      $ctrl.bigTeams = result[0];

      // Nesting because both are needed for table and async is lame
      myService.getWeek($ctrl.week).success((result)=> {
        $ctrl.allData = result;
        $ctrl.gridOptions.data = transformedData(result);
      });

    });

  };

  $ctrl.gridOptions = {
    enableColumnMenus: false,
    enableColumnResizing: true,
    enableFiltering: false,
    enableGridMenu: true,
    exporterMenuCsv: false,
    exporterMenuPdf: false,
    enableSorting: true,
    showGridFooter: false,
    onRegisterApi: (gridApi) => {
      $ctrl.gridApi = gridApi;
    }
  };

  $ctrl.gridBackgroundColor = (val) => {
    let color = 'ui-grid-class-primary';
    if (val.entity.bigTeam === $ctrl.bigTeams.team1) {
      color = 'ui-grid-class-success';
    }
    else if (val.entity.bigTeam === $ctrl.bigTeams.team2) {
      color = 'ui-grid-class-danger';
    }
    return color;
  };

  $ctrl.gridOptions.columnDefs = [
    {
      name:'smallTeam',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
    },
    {
      name:'bigTeam',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
    },
    {
      name:'counselors',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
    },
    {
      name:'cabin',
      displayName:'Cabin Points',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'cheer',
      displayName:'Cheer Points',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'ctf',
      displayName:'Capture The Flag',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'maximus',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'trash',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'scripture',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number'
    },
    {
      name:'total',
      allowCellFocus: false,
      cellClass: (grid, row) => $ctrl.gridBackgroundColor(row),
      cellFilter: 'number: 0',
      type: 'number',
      sort: {
        direction: uiGridConstants.DESC,
        priority: 1
      }
    }
  ];

  $ctrl.scriptureMath = (scripture) => (scripture.campers < 1) ? 0 : (scripture.verses/scripture.campers) * 2500;
  $ctrl.totalMath = (val) => val.cabin.monday + val.cabin.tuesday + val.cabin.wednesday + val.cheer.monday + val.cheer.tuesday + val.cheer.wednesday + val.ctf + val.maximus.cheer + val.maximus.race + (val.trash * 10) + $ctrl.scriptureMath(val.scripture);

  $ctrl.exportData = () => {
    $ctrl.gridOptions.exporterCsvFilename = `Eagle_Lake_Points_Week_${$ctrl.week}.csv`;
    $ctrl.gridApi.exporter.csvExport( 'all', 'all' );
  };

  const transformedData = (data) => {

    $ctrl.bigTeamTotal = {
      team1: {
        name: $ctrl.bigTeams.team1,
        scriptureTotal: 0,
        cabinTotal: 0,
        total: 0,
      },
      team2: {
        name: $ctrl.bigTeams.team2,
        scriptureTotal: 0,
        cabinTotal: 0,
        total: 0,
      }
    };

    let transformedData = [];
    data.forEach((val) => {
      let transformedVal = {
        bigTeam: val.bigTeam,
        counselors: val.counselors.join(', '),
        smallTeam: val.smallTeam,
        cabin: (val.cabin.monday + val.cabin.tuesday + val.cabin.wednesday),
        cheer: (val.cheer.monday + val.cheer.tuesday + val.cheer.wednesday),
        ctf: val.ctf,
        maximus: (val.maximus.cheer + val.maximus.race),
        trash: val.trash,
        scripture: $ctrl.scriptureMath(val.scripture),
        total: $ctrl.totalMath(val)
      };

      transformedData.push(transformedVal);

      if (val.bigTeam === $ctrl.bigTeamTotal.team1.name) {
        $ctrl.bigTeamTotal.team1.cabinTotal += (val.cabin.monday + val.cabin.tuesday + val.cabin.wednesday);
        $ctrl.bigTeamTotal.team1.scriptureTotal += $ctrl.scriptureMath(val.scripture);
        $ctrl.bigTeamTotal.team1.total += $ctrl.totalMath(val);
      }
      else if (val.bigTeam === $ctrl.bigTeamTotal.team2.name) {
        $ctrl.bigTeamTotal.team2.cabinTotal += (val.cabin.monday + val.cabin.tuesday + val.cabin.wednesday);
        $ctrl.bigTeamTotal.team2.scriptureTotal += $ctrl.scriptureMath(val.scripture);
        $ctrl.bigTeamTotal.team2.total += $ctrl.totalMath(val);
      }

    });
    return transformedData;
  }

}
