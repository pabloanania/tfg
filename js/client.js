var apiURL = "http://localhost:5000/api/";

function makeAPICall(e, endpoint, method, successCallback, errorCallback) {
  $.ajax({
    data: JSON.stringify(e),
    url: apiURL + endpoint,
    method: method,
    dataType: "json",
    contentType: "application/json",
    success: successCallback,
    error: errorCallback
  });
}

function persistSession(events, entities) {
  sessionStorage["eventSheet"] = customStringify({ "entities": entities, "events": events });
}

function newSheet() {
  Swal.fire({
    title: '¿Desea crear un nuevo proyecto?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aceptar'
  }).then(function (res) {
    if (res.value) {
      sessionStorage.removeItem("eventSheet");
      document.location.reload();
    }
  });
}

function openSheet(sheetName) {
  var data = {"name": sheetName};

  errorCallback = function () {
    Swal.fire({
      type: 'error',
      title: 'Error al abrir proyecto',
      text: 'Ha ocurrido un error al recuperar el proyecto desde la base de datos',
    });
  }

  makeAPICall(data, "load", "POST", function (e) { 
    sessionStorage["eventSheet"] = customStringify({ "entities": e.entities, "events": e.events });
    document.location.reload();
  }, errorCallback);
}

function saveSheet(sheetName) {
  var evAndEnt = JSON.parse(sessionStorage["eventSheet"]);
  evAndEnt.name = sheetName;

  errorCallback = function () {
    Swal.fire({
      type: 'error',
      title: 'Error al guardar proyecto',
      text: 'Ha ocurrido un error durante el guardado del proyecto en la base de datos',
    });
  }

  makeAPICall(evAndEnt, "save", "POST", function () { }, errorCallback);
}

function exportUnity() {
  var evAndEnt = JSON.parse(sessionStorage["eventSheet"]);

  errorCallback = function () {
    Swal.fire({
      type: 'error',
      title: 'Error al generar archivos',
      text: 'Ha ocurrido un error durante la generación de archivos',
    });
  }

  makeAPICall(evAndEnt, "eventcodegenerator", "POST", function (data) { downloadData(data) }, errorCallback);

  for (var i = 0; i < evAndEnt.entities.length; i++) {
    makeAPICall({ "entity": evAndEnt.entities[i] }, "entitycodegenerator", "POST", function (data) { downloadData(data) }, errorCallback);
  }
}

function getNewUniFaceSheet() {
  return { "entities": [{ "name": "System", "attributes": [] }], "events": [] };
}

function downloadData(data) {
  var blob = new Blob([data.content], { type: "text/plain" });
  var url = window.URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  a.download = data.name;
  a.click();

  window.URL.revokeObjectURL(url);
}

// Realiza stringify eliminando basura insertada por Angular
function customStringify(e) {
  var json = JSON.stringify(e, function (key, value) {
    if (key === "$$hashKey") {
      return undefined;
    }

    return value;
  });

  return json;
}

// Convierte operadores de un formato a otro
convertEquality = function (op) {
  switch (op) {
    case "=":
      return "EQ";
    case "!=":
      return "NE";
    case ">=":
      return "GE";
    case ">":
      return "GT";
    case "<=":
      return "LE";
    case "<":
      return "LT"
    case "EQ":
      return "=";
    case "NE":
      return "!=";
    case "GE":
      return ">=";
    case "GT":
      return ">";
    case "LE":
      return "<=";
    case "LT":
      return "<";
  }
}

// Construye la ventana del editor de expresiones según sea solicitado
function customizeExpressionEditor(modalParams) {
  $('.customValueContainer').empty();

  if (modalParams.hasOperatorSelector) {
    $("#expressionOperatorContainer").show();
    $("#expressionOperator").val("EQ");
  } else {
    $("#expressionOperatorContainer").hide();
  }

  if (modalParams.fields) {
    $("#expressionValueContainer").hide();

    for (var i = 0; i < modalParams.fields.length; i++) {
      var container = $("#expressionBodyContainer");

      var div = $("<div class='form-group customValueContainer' />");
      var label = $("<label class='form-label'>" + modalParams.fields[i].label + "</label>");
      var input = $("<input class='form-control' param='" + modalParams.fields[i].param + "' />");

      label.appendTo(div);
      input.appendTo(div);
      div.appendTo(container);
    }
  } else {
    $("#expressionValueContainer").show();
    $("#expressionValue").val("");
  }
}