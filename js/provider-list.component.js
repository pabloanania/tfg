// Register `providerList` component, along with its associated controller and template
angular.module('CarriersApp').component('providerList', {
  template:
      '<table class="table table-dark" ng-controller="ProviderListController">' +
      '<thead><tr><th scope="col">#</th><th scope="col">Carrier</th><th scope="col">Direccion</th><th scope="col">Contacto</th><th scope="col"></th><th scope="col"></th></tr></thead>' +
      '<tbody>' + 
      '<tr ng-repeat="(key, val) in providers">' +
        '<th scope="row">{{providers[key].id}}</th>' +
        '<td>{{providers[key].name}}</td>' + 
        '<td>{{providers[key].address}}</td>' + 
        '<td>{{providers[key].contacto}}</td>' + 
        '<td><button type="button" entity="providers" onclick="makeRedirection(this)" action="edit?id={{providers[key].id}}" class="btn btn-default btn-sm">Editar</button></td>' +
        '<td><button type="button" object_id="{{providers[key].id}}" ng-click="deleteItem(providers[key].id, key)" entity="providers" action="delete" class="btn btn-default btn-sm">Eliminar</button></td>' +
      '</tr>' +
      '</tbody>' +
      '</table>'
});

angular.module('CarriersApp').controller('ProviderListController', function($scope, $http){
  $http.get('api/providers').then(function(response) {
    $scope.providers = response.data;

    $scope.deleteItem = function(id, index){
      $scope.providers.splice(index, 1);

      makeAPICall($("[object_id='" + id + "']")[0], function(){
      
      });
    }
  });
});