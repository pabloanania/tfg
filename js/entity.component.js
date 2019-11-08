// Registra componente, con su controller y template
angular.module('UniFaceApp').component('entityList', {
    template:
        `
    <!-- INICIO LISTA ENTIDADES -->
    <div class="card mb-grid" ng-controller="EntityListController">
      <div class="table-responsive-md">
        <table class="table table-actions table-striped table-hover mb-0">
          <tbody ng-repeat="(key, val) in entities track by $index">
            <tr class="action-el">
              <td>
                <span class="badge badge-pill condition-action-el badge-primary">{{entities[key].name}}</span>
              </td>
              <td>
                <ng-repeat ng-repeat="(k, v) in val.attributes track by $index">
                  <span ng-if="v.type == 'int'" class="badge badge-pill condition-action-el badge-success">{{v.name}}</span>
                  <span ng-if="v.type == 'string'" class="badge badge-pill condition-action-el badge-info">{{v.name}}</span>
                  <span ng-if="v.type == 'float'" class="badge badge-pill condition-action-el badge-secondary">{{v.name}}</span>
                </ng-repeat>
              </td>
              <td class="low-padding">
                <button class="btn btn-small oi oi-pencil" data-toggle="modal" data-target="#entityModal" ng-click="editEntity(key, parentScope)"></button>
                <button class="btn btn-small oi oi-trash" ng-click="deleteEntity(key, parentScope)"></button>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr class="new-entity-el">
              <td class="low-padding">
                  <button class="btn btn-small oi oi-plus" data-toggle="modal" data-target="#entityModal" ng-click="newEntity(parentScope)"></button>
              </td>
              <td>
              </td>
              <td class="low-padding">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    
    
      <!-- MODAL EDITOR DE ENTIDADES -->
      <div class="modal fade" id="entityModal" tabindex="-1" role="dialog" aria-labelledby="entityModalLabel"
          aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="entityModalLabel">Editor de Entidades</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <div class="form-group">
                          <label class="form-label" for="exampleInputExpression">Nombre</label>
                          <input class="form-control" id="exampleInputExpression" ng-model="currentEntity.name">
                      </div>
                      <div class="form-group">
                          <label class="form-label" for="exampleInputExpression">Atributos</label>
                          <div class="table-responsive-md">
                              <table class="table table-actions table-striped table-hover mb-0">
                                  <tbody>
                                      <tr class="action-el" ng-repeat="(key, val) in currentEntity.attributes track by $index">
                                          <td class="low-padding">
                                              <span ng-if="val.type == 'int'" class="badge badge-pill condition-action-el badge-success">{{val.name}}</span>
                                              <span ng-if="val.type == 'string'" class="badge badge-pill condition-action-el badge-info">{{val.name}}</span>
                                              <span ng-if="val.type == 'float'" class="badge badge-pill condition-action-el badge-secondary">{{val.name}}</span>
                                          </td>
                                          <td class="low-padding">
                                              <button class="btn btn-small oi oi-pencil" data-toggle="modal" data-target="#attributeModal" ng-click="editAttribute(key, parentScope)"></button>
                                              <button class="btn btn-small oi oi-trash" ng-click="deleteAttribute(key, parentScope)"></button>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td class="low-padding">
                                              <button class="btn btn-small oi oi-plus" data-toggle="modal" data-target="#attributeModal" ng-click="newAttribute(parentScope)"></button>
                                          </td>
                                          <td class="low-padding">
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="finishEditEntity(parentScope)">Aceptar</button>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN MODAL MODAL EDITOR DE ENTIDADES -->


      <!-- MODAL EDITOR DE ATRIBUTOS -->
      <div class="modal fade" id="attributeModal" tabindex="-1" role="dialog" aria-labelledby="attributeModalLabel"
          aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="attributeModalLabel">Editor de Atributos</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <div class="form-group">
                          <div class="form-group">
                              <label class="form-label">Nombre</label>
                              <input class="form-control" id="attributeName" ng-model="currentAttribute.name">
                          </div>
                          <div class="form-group">
                            <label class="form-label">Tipo</label>
                            <select class="form-control" id="attributeType" ng-model="currentAttribute.type">
                              <option class="dropdown-item" value="int">Número entero</option>
                              <option class="dropdown-item" value="float">Número real</option>
                              <option class="dropdown-item" value="string">Texto</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Valor inicial</label>
                            <input class="form-control" id="attributeValue" ng-model="currentAttribute.value">
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="finishEditAttribute(parentScope)">Aceptar</button>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN MODAL EDITOR DE ATRIBUTOS -->

    </div>
    <!-- FIN LISTA ENTIDADES -->
    `
});

angular.module('UniFaceApp').controller('EntityListController', function ($scope, $sce, $http) {
    $scope.entities = eventTest.entities;
    $scope.parentScope = $scope;

    $scope.newEntity = function (parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "newEntity";

        ngScope.currentEntity = { name: "", attributes: [] };
    }

    $scope.editEntity = function (entityIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editType = "editEntity";
        ngScope.entityIndex = entityIndex;

        // Genera una copia del objeto para evitar que quede bindeado
        entity = parentScope.entities[entityIndex];
        ngScope.currentEntity = JSON.parse(JSON.stringify(entity));
    }

    $scope.deleteEntity = function (entityIndex, parentScope) {
        var ngScope = parentScope;

        Swal.fire({
            title: '¿Desea eliminar la entidad?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar entidad'
        }).then(function (res) {
            if (res.value) {
                ngScope.entities.splice(entityIndex, 1);
                ngScope.$apply();
            }
        });
    }

    $scope.newAttribute = function (parentScope) {
        var ngScope = parentScope;
        ngScope.editAttributeType = "newAttribute";

        ngScope.currentAttribute = { name: "", type: "int", value: null };
    }

    $scope.editAttribute = function (attributeIndex, parentScope) {
        var ngScope = parentScope;
        ngScope.editAttributeType = "editAttribute";
        ngScope.attributeIndex = attributeIndex;

        // Genera una copia del objeto para evitar que quede bindeado
        attr = ngScope.currentEntity.attributes[attributeIndex];
        ngScope.currentAttribute = { name: attr.name, type: attr.type, value: attr.value };
    }

    $scope.deleteAttribute = function (attributeIndex, parentScope) {
        var ngScope = parentScope;

        ngScope.currentEntity.attributes.splice(attributeIndex, 1);
    }

    $scope.finishEditAttribute = function (parentScope) {
        var ngScope = parentScope;

        switch (ngScope.editAttributeType) {
            case "newAttribute":
                ngScope.currentEntity.attributes.push(ngScope.currentAttribute);
                break;
            case "editAttribute":
                ngScope.currentEntity.attributes[ngScope.attributeIndex] = ngScope.currentAttribute;
                break;
        }
    }

    $scope.finishEditEntity = function (parentScope) {
        var ngScope = parentScope;

        switch (ngScope.editType) {
            case "newEntity":
                ngScope.entities.push(ngScope.currentEntity);
                break;
            case "editEntity":
                ngScope.entities[ngScope.entityIndex] = ngScope.currentEntity;
                break;
        }
    }
});