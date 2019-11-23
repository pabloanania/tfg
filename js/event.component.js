// Registra componente, con su controller y template
angular.module('UniFaceApp').component('eventList', {
    template:
        `
    <!-- INICIO LISTA EVENTOS -->
    <div class="card mb-grid" ng-controller="EventListController">
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
                <button class="btn btn-small oi oi-pencil" data-toggle="modal" data-target="#conditionModal" ng-click="editCondition(key, k, parentScope)"></button>
                <button class="btn btn-small oi oi-trash" ng-click="deleteCondition(key, k, parentScope)"></button>
              </td>
            </tr>
            <tr class="condition-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-flag" data-toggle="modal" data-target="#conditionModal" ng-click="newCondition(key, parentScope)"></button>
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
                <button class="btn btn-small oi oi-pencil" data-toggle="modal" data-target="#actionModal" ng-click="editAction(key, k, parentScope)"></button>
                <button class="btn btn-small oi oi-trash" ng-click="deleteAction(key, k, parentScope)"></button>
              </td>
            </tr>
            <tr class="action-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-fire" data-toggle="modal" data-target="#actionModal" ng-click="newAction(key, parentScope)"></button>
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
              <button class="btn btn-small oi oi-plus" data-toggle="modal" data-target="#conditionModal" ng-click="newEvent(parentScope)"></button>
            </td>
            <td>
            </td>
            <td class="low-padding">
            </td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- MODAL SELECTOR DE CONDICIONES -->
      <div class="modal fade" id="conditionModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="conditionModalLabel">Editor de Condiciones</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <div class="card mb-grid">
                          <div class="table-responsive-md">
                              <table class="table table-actions table-striped table-hover mb-0">
                                  <tbody>
                                      <tr class="action-el" ng-repeat="(key, val) in entities">
                                          <td class="low-padding">
                                              <div class="dropdown">
                                                  <span class="badge badge-pill condition-action-el badge-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ entities[key].name }}</span>
                                                  <div class="dropdown-menu">
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-if="entities[key].name == 'System'" ng-click="conditionSelected(entities[key].name, 'key_name_press', {}, parentScope)">Al presionar una tecla</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-if="entities[key].name == 'System'" ng-click="conditionSelected(entities[key].name, 'key_name_hold', {}, parentScope)">Al mantener presionada una tecla</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-if="entities[key].name == 'System'" ng-click="conditionSelected(entities[key].name, 'every_x_time', {}, parentScope)">Al transcurrir cierta cantidad de tiempo</div>
                                                        <div class="dropdown-item" ng-if="entities[key].name == 'System'" ng-click="conditionSelected(entities[key].name, 'always', {}, parentScope); expressionSelected(parentScope)">Siempre</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="conditionSelected(entities[key].name, 'x_position_is', { hasOperatorSelector: true }, parentScope)">Cuando la posición X tiene cierto valor</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="conditionSelected(entities[key].name, 'y_position_is', { hasOperatorSelector: true }, parentScope)">Cuando la posición Y tiene cierto valor</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="conditionSelected(entities[key].name, 'z_position_is', { hasOperatorSelector: true }, parentScope)">Cuando la posición Z tiene cierto valor</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="conditionSelected(entities[key].name, 'attribute_value_is', { hasOperatorSelector: true, fields: [ { label: 'Ingrese el nombre del atributo', param: 'attribute_name' }, { label: 'Ingrese expresión', param: 'value' } ] }, parentScope)">Cuando el valor de un atributo tiene cierto valor</div>
                                                        <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="conditionSelected(entities[key].name, 'collides_with', { fields: [{ label: 'Ingrese entidad o expresión', param: 'entity' }] }, parentScope)">Al colisionar con una instancia de otra entidad</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN MODAL SELECTOR DE CONDICIONES -->


      <!-- MODAL SELECTOR DE ACCIONES -->
      <div class="modal fade" id="actionModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Editor de Acciones</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <div class="card mb-grid">
                          <div class="table-responsive-md">
                              <table class="table table-actions table-striped table-hover mb-0">
                                  <tbody>
                                      <tr class="action-el" ng-repeat="(key, val) in entities">
                                          <td class="low-padding">
                                              <div class="dropdown">
                                                  <span class="badge badge-pill condition-action-el badge-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ entities[key].name }}</span>
                                                  <div class="dropdown-menu">
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'set_x_position', {}, parentScope)">Establecer nueva posición X</div>
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'set_y_position', {}, parentScope)">Establecer nueva posición Y</div>
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'set_z_position', {}, parentScope)">Establecer nueva posición Z</div>
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'set_attribute_value', { fields: [ { label: 'Ingrese el nombre del atributo', param: 'attribute_name' }, { label: 'Ingrese expresión', param: 'value' } ] }, parentScope)">Establecer nuevo valor a un atributo</div>
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'set_text', {}, parentScope)">Establecer nuevo valor de texto</div>                                                      
                                                      <div class="dropdown-item" data-toggle="modal" data-target="#expressionModal" ng-click="actionSelected(entities[key].name, 'create_entity', { fields: [ { label: 'Ingrese posición X inicial', param: 'x_position' }, { label: 'Ingrese posición Y inicial', param: 'y_position' }, { label: 'Ingrese posición Z inicial', param: 'z_position' } ] }, parentScope)">Crear nueva instancia de la entidad</div>
                                                      <div class="dropdown-item" ng-click="actionSelected(entities[key].name, 'destroy_entity', {}, parentScope); expressionSelected(parentScope)">Destruir instancias de la entidad</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN MODAL SELECTOR DE ACCIONES -->


      <!-- MODAL EDITOR DE EXPRESIONES -->
      <div class="modal fade" id="expressionModal" tabindex="-1" role="dialog" aria-labelledby="expressionModalLabel"
          aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Editor de Expresiones</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body" id="expressionBodyContainer">
                      <div class="form-group" id="expressionOperatorContainer">
                          <label class="form-label">Seleccione operador</label>
                            <select class="form-control" param="operator">
                                <option class="dropdown-item" value="EQ">EQ</option>
                                <option class="dropdown-item" value="NE">NE</option>
                                <option class="dropdown-item" value="GT">GT</option>
                                <option class="dropdown-item" value="GE">GE</option>
                                <option class="dropdown-item" value="LE">LE</option>
                                <option class="dropdown-item" value="LT">LT</option>
                            </select>
                      </div>
                      <div class="form-group" id="expressionValueContainer">
                          <label class="form-label">Ingrese expresión</label>
                          <input class="form-control" param="value" id="expressionValue">
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-primary expression-selected" data-toggle="modal"
                      data-target="#expressionModal" ng-click="expressionSelected(parentScope)">Aceptar</button>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN MODAL EDITOR DE EXPRESIONES -->


    </div>
    <!-- FIN LISTA EVENTOS -->
    `
});

angular.module('UniFaceApp').controller('EventListController', function ($scope, $sce, $http) {
    // Recupera datos de session de ser posible, sino crea una nueva sheet
    if (sessionStorage["eventSheet"] != undefined) {
        var eventSheet = JSON.parse(sessionStorage["eventSheet"]);
    } else {
        var eventSheet = getNewUniFaceSheet();
    }

    // Setea variables de scope
    $scope.name = eventSheet.name;
    $scope.entities = eventSheet.entities;
    $scope.events = eventSheet.events;
    $scope.parentScope = $scope;

    // Genera HTML para condiciones
    $scope.conditionPrint = function (el) {
        var prnt = "";
        prnt += '<span class="badge badge-pill condition-action-el badge-primary">' + el.entity + '</span>\n';

        // Imprime según condición
        switch (el.name) {
            case "key_name_hold":
                prnt += `<span class="badge badge-pill condition-action-el badge-success">Al mantener presionada la tecla</span>
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
                break;
            case "key_name_press":
                prnt += `<span class="badge badge-pill condition-action-el badge-success">Al presionar la tecla</span>
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
                <span class="badge badge-pill condition-action-el badge-primary">` + el.parameters.value + '</span>';
                break;
        }

        return $sce.trustAsHtml(prnt);
    }

    $scope.newEvent = function (parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "newEvent";
        ngScope.currentEvent = { conditions: [], actions: [] };
        ngScope.currentCondition = {};
    }

    $scope.newCondition = function (eventIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "newCondition";
        ngScope.currentCondition = {};
        ngScope.eventIndex = eventIndex;
    }

    $scope.editCondition = function (eventIndex, conditionIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "editCondition";
        ngScope.currentCondition = {};
        ngScope.eventIndex = eventIndex;
        ngScope.conditionIndex = conditionIndex;
    }

    $scope.deleteCondition = function (eventIndex, conditionIndex, parentScope) {
        var ngScope = parentScope;

        if (ngScope.events[eventIndex].conditions.length > 1) {
            ngScope.events[eventIndex].conditions.splice(conditionIndex, 1);
        } else {
            Swal.fire({
                title: '¿Desea eliminar el evento por completo?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Borrar evento'
            }).then(function (res) {
                if (res.value) {
                    ngScope.events.splice(eventIndex, 1);
                    ngScope.$apply();

                    persistSession(ngScope.events, ngScope.entities);
                }
            });
        }
    }

    $scope.deleteAction = function (eventIndex, actionIndex, parentScope) {
        var ngScope = parentScope;

        ngScope.events[eventIndex].actions.splice(actionIndex, 1);

        persistSession(ngScope.events, ngScope.entities);
    }

    $scope.newAction = function (eventIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "newAction";
        ngScope.currentAction = {};
        ngScope.eventIndex = eventIndex;
    }

    $scope.editAction = function (eventIndex, actionIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "editAction";
        ngScope.currentAction = {};
        ngScope.eventIndex = eventIndex;
        ngScope.actionIndex = actionIndex;
    }

    $scope.conditionSelected = function (entityName, conditionName, modalParams, parentScope) {
        var ngScope = parentScope;
        ngScope.currentCondition = {
            entity: entityName,
            name: conditionName
        };

        // Construye el editor de expresiones como sea necesario
        customizeExpressionEditor(modalParams);
    }

    $scope.actionSelected = function (entityName, actionName, modalParams, parentScope) {
        var ngScope = parentScope;
        ngScope.currentAction = {
            entity: entityName,
            name: actionName
        };

        // Construye el editor de expresiones como sea necesario
        customizeExpressionEditor(modalParams);
    }

    $scope.expressionSelected = function (parentScope) {
        var ngScope = parentScope;

        // Define parámetros
        var params = {};
        switch (ngScope.editType) {
            case "newEvent": case "newCondition": case "editCondition": case "newAction": case "editAction":
                $("#expressionBodyContainer input, #expressionBodyContainer select").each(function (index, value) {
                    if ($(this).is(":visible")) {
                        params[$(this).attr("param")] = $(this).val();
                    }
                });
                break;
        }

        // Almacena condición / acción en la lista de eventos
        switch (ngScope.editType) {
            case "newEvent":
                ngScope.currentCondition.parameters = params;
                ngScope.currentEvent.conditions.push(ngScope.currentCondition);
                ngScope.events.push(ngScope.currentEvent);
                break;
            case "newCondition":
                ngScope.currentCondition.parameters = params;
                ngScope.events[ngScope.eventIndex].conditions.push(ngScope.currentCondition);
                break;
            case "editCondition":
                ngScope.currentCondition.parameters = params;
                ngScope.events[ngScope.eventIndex].conditions[ngScope.conditionIndex] = ngScope.currentCondition;
                break;
            case "newAction":
                ngScope.currentAction.parameters = params;
                ngScope.events[ngScope.eventIndex].actions.push(ngScope.currentAction);
                break;
            case "editAction":
                ngScope.currentAction.parameters = params;
                ngScope.events[ngScope.eventIndex].actions[ngScope.actionIndex] = ngScope.currentAction;
                break;
        }

        // Cierra modals
        if ($("#conditionModal").is(":visible"))
            $("#conditionModal").modal("toggle");

        if ($("#actionModal").is(":visible"))
            $("#actionModal").modal("toggle");

        if ($("#expressionModal").is(":visible"))
            $("#expressionModal").modal("toggle");

        persistSession(ngScope.events, ngScope.entities);
    }
});