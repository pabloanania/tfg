// Registra componente, con su controller y template
angular.module('ProtoApp').component('providerEdit', {
  template:
      '<form ng-submit="submitForm()" ng-controller="ProviderEditController">' +
      '<div class="form-group" ng-repeat="(key, val) in prov">' +
        '<label>{{key}}</label>' +
        '<input class="form-control" ng-model="prov[key]">' + 
      '</div>' +
      '<button type="submit" class="btn btn-primary">Guardar</button>' +
      '<a href="/" ><div class="btn btn-primary" style="margin-left: 20">Volver</div></a>' +
      '</form>'
});

angular.module('ProtoApp').controller('ProviderEditController', function($scope, $http){
  var id = url('?id');
  $http.get(document.location.protocol + '//' + document.location.host + '/api/providers/' + id).then(function(res) {
    // Setea la variable de scope de angular
    $scope.prov = res.data;
  });

  $scope.submitForm = function(){
    $.ajax({
      url: "/api/providers/" + this.prov.id,
      method: "PUT",
      data: JSON.stringify(this.prov),
      contentType: 'application/json',
      success: function(){alert("La operación salió OK!");}
    });
  }
});