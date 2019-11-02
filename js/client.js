function makeAPICall(e, callback) {
  $.ajax({
    url: "/api/" + e.getAttribute("entity") + "/" + e.getAttribute("object_id"),
    method: e.getAttribute("action"),
    success: callback
  });
}

function makeRedirection(e) {
  document.location = document.location.protocol + "//" + document.location.host + "/" + e.getAttribute("entity") + "/" + e.getAttribute("action");
}

function mongoInsertItem(e) {
  $.ajax({
    url: "/api/" + e.getAttribute("entity"),
    method: "post",
    success: function (obj) { document.location = document.location.protocol + "//" + document.location.host + "/" + e.getAttribute("entity") + "/edit?id=" + obj.id; }
  });
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