function makeAPICall(e, callback){
    $.ajax({
        url: "/api/" + e.getAttribute("entity") + "/" + e.getAttribute("object_id"),
        method: e.getAttribute("action"),
        success: callback
    });
}

function makeRedirection(e){
    document.location = document.location.protocol + "//" + document.location.host + "/" + e.getAttribute("entity") + "/" + e.getAttribute("action");
}

function mongoInsertItem(e){
    $.ajax({
        url: "/api/" + e.getAttribute("entity"),
        method: "post",
        success: function(obj){document.location = document.location.protocol + "//" + document.location.host + "/" + e.getAttribute("entity") + "/edit?id=" + obj.id;}
    }); 
}

// Convierte operadores de un formato a otro
convertEquality = function(op){
    switch (op){
      case "=":
        return "EQ";
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