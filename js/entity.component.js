// Registra componente, con su controller y template
angular.module('UniFaceApp').component('entityList', {
  template:
    `<div class="card mb-grid" ng-controller="EntityListController">
      <div class="table-responsive-md">
        <table class="table table-actions table-striped table-hover mb-0">
          <tbody ng-repeat="(key, val) in entities">
            <tr class="action-el">
              <td>
                <span class="badge badge-pill condition-action-el badge-primary">{{entities[key].name}}</span>
              </td>
              <td ng-bind-html="attributePrint(entities[key].attributes)">
              </td>
              <td class="low-padding">
                <button class="btn btn-small oi oi-pencil"></button>
                <button class="btn btn-small oi oi-trash"></button>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr class="new-entity-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-plus"></button>
              </td>
              <td>
              </td>
              <td class="low-padding">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`
});

angular.module('UniFaceApp').controller('EntityListController', function ($scope, $sce, $http) {
  $scope.entities = eventTest.entities;

  // Genera HTML para atributos
  $scope.attributePrint = function (el) {
    var prnt = "";

    // Imprime cada atributo
    if (el != undefined){
      for (var i = 0; i < el.length; i++) {
        var stl = "";
        // Elige estilo segùn tipo de atributo
        switch (el[i].type) {
          case "int":
            stl = "badge badge-pill condition-action-el badge-success";
            break;
          case "float":
            stl = "badge badge-pill condition-action-el badge-secondary";
            break;
          case "string":
            stl = "badge badge-pill condition-action-el badge-info";
            break;
        }
  
        prnt += '<span class="' + stl + '">' + el[i].name  + '</span>';
      }
    }

    return $sce.trustAsHtml(prnt);
  }
});