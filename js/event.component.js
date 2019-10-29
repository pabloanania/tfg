// Registra componente, con su controller y template
angular.module('UniFaceApp').component('eventList', {
  template:
    `<div class="card mb-grid" ng-controller="EventListController">
      <div class="table-responsive-md">
        <table class="table table-actions table-striped table-hover mb-0">
          <tbody ng-repeat="(key, val) in events track by $index">
            <tr class="condition-el" ng-repeat="(k, v) in events[key].conditions">
              <td class="low-padding">
                <button class="btn btn-small oi oi-fullscreen-exit"></button>
              </td>
              <td ng-bind-html="conditionPrint(events[key].conditions[k])">
              </td>
              <td class="low-padding">
                <button class="btn btn-small oi oi-pencil"></button>
                <button class="btn btn-small oi oi-trash"></button>
              </td>
            </tr>
            <tr class="condition-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-flag"></button>
              </td>
              <td>
              </td>
              <td class="low-padding">
              </td>
            </tr>
            <tr class="action-el" ng-repeat="(k, v) in events[key].actions">
              <td class="low-padding">
              </td>
              <td ng-bind-html="actionPrint(events[key].actions[k])">
              </td>
              <td class="low-padding">
                <button class="btn btn-small oi oi-pencil"></button>
                <button class="btn btn-small oi oi-trash"></button>
              </td>
            </tr>
            <tr class="action-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-pulse"></button>
              </td>
              <td>
              </td>
              <td class="low-padding">
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr class="new-event-el">
            <td class="low-padding">
              <button class="btn btn-small oi oi-plus" ng-click="newEvent()"></button>
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

angular.module('UniFaceApp').controller('EventListController', function ($scope, $sce, $http) {
  $scope.name = eventTest.name;
  $scope.entities = eventTest.entities;
  $scope.events = eventTest.events;

  // Genera HTML para condiciones
  $scope.conditionPrint = function (el) {
    var prnt = "";
    prnt += '<span class="badge badge-pill condition-action-el badge-primary">' + el.entity + '</span>\n';

    // Imprime según condición
    switch (el.name) {
      case "key_name_hold":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Al presionar la tecla</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "key_name_press":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Al mantener presionada la tecla</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "every_x_time":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Al trascurrir</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + `</span>
                <span class="badge badge-pill condition-action-el badge-success">milisegundos</span>`;
        break;
      case "x_position_is":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Tiene una posición X</span>
              <span class="badge badge-pill condition-action-el badge-danger">` + convertEquality(el.parameters.operator) + `</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "y_position_is":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Tiene una posición Y</span>
              <span class="badge badge-pill condition-action-el badge-danger">` + convertEquality(el.parameters.operator) + `</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "z_position_is":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Tiene una posición Z</span>
              <span class="badge badge-pill condition-action-el badge-danger">` + convertEquality(el.parameters.operator) + `</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "attribute_value_is":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Tiene un valor del atributo</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.attribute_name + `</span>
              <span class="badge badge-pill condition-action-el badge-danger">` + convertEquality(el.parameters.operator) + `</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "collides_with":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Colisiona con</span>
              <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.entity + '</span>';
        break;
      case "always":
        prnt += '<span class="badge badge-pill condition-action-el badge-success">Siempre</span>';
        break;
    }

    return $sce.trustAsHtml(prnt);
  }

  // Genera HTML para acciones
  $scope.actionPrint = function (el) {
    var prnt = "";
    prnt += '<span class="badge badge-pill condition-action-el badge-primary">' + el.entity + '</span>\n';

    // Imprime según acción
    switch (el.name) {
      case "set_x_position":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Fijar la posición X</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "set_y_position":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Fijar la posición Y</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "set_z_position":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Fijar la posición Z</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "set_attribute_value":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Fijar nuevo valor al atributo</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.attribute_name + `</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
        break;
      case "create_entity":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Crear nueva instancia en</span>
                <span class="badge badge-pill condition-action-el badge-primary">X</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.x_position + `</span>
                <span class="badge badge-pill condition-action-el badge-primary">Y</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.y_position + `</span>
                <span class="badge badge-pill condition-action-el badge-primary">Z</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.z_position + '</span>';
        break;
      case "destroy_entity":
        prnt += '<span class="badge badge-pill condition-action-el badge-danger">Destruir instancia(s)</span>';
        break;
      case "set_text":
        prnt += `<span class="badge badge-pill condition-action-el badge-success">Fijar nuevo valor al texto</span>
                <span class="badge badge-pill condition-action-el badge-danger">=</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.text + '</span>';
        break;
    }

    return $sce.trustAsHtml(prnt);
  }

  $scope.newEvent = function(){
    var currentEvent = {conditions: [], actions: []};
    var ngScope = $scope;

    $("#conditionActionModal").modal();

    $(".condition-action-selected").click(function(){
      currentEvent.conditions[0] = {
        entity: this.getAttribute("entity-name"),
        name: this.getAttribute("condition-name")
      };

      $("#expressionModal").modal();
    });

    $(".expression-selected").click(function(){
      currentEvent.conditions[0]["parameters"] = {
        operator: $("#dropdownMenuButtonOperator")[0].value,
        value: $("#inputExpression")[0].value
      };

      ngScope.events.push(currentEvent);
      $scope.$apply();
      $("#expressionModal").modal("toggle");
      $("#conditionActionModal").modal("toggle");
    });
  }
});