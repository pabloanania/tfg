const express = require('express');
const bodyParser = require('body-parser');
const mongoDb = require('mongodb');
const mustache = require('mustache');

const app = express();
const ObjectId = require('mongodb').ObjectID;



// SERVER
// Parsear body de request como json
app.use(bodyParser.json());

// get home
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/eventeditor.html");
});

// devuelve archivos del servidor
app.get(['/libs/*', '/css/*', '/ico/*', '/js/*'], (req, res) => {
    res.sendFile(__dirname + req.originalUrl);
});

// Inicia servidor
app.listen(5000, function () {
    console.log('Server NodeJs + Express encendido...');
});



// API

// Genera el código a partir del json pasado por parámetro
app.post('/api/nodegenerator', (req, res) => {
    var events = req.body.events;

    var generated = generateCSharpNodes(events);
    var code = generateCSharpCode(generated)

    res.status(200).send(code);
});


// CODE GENERATOR
function generateCSharpNodes(inputEvents) {
    var codeNodes = {};
    var startNode = [];
    var updateNode = [];
    var fixedUpdateNode = [];
    var targetConditions = [];

    var currentNode;

    // Eventos
    for (var i = 0; i < inputEvents.length; i++) {
        var targetEvent = { "conditions": [], "actions": [] }
        var event = inputEvents[i];

        // Condiciones
        for (var j = 0; j < event.conditions.length; j++) {
            var condition = event.conditions[j];
            var auxCond = {};

            switch (condition.name) {
                case "always":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "true";
                    break;

                case "key_name_hold":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKey(\"" + condition.parameters.keyname + "\")";
                    break;

                case "key_name_press":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyDown(\"" + condition.parameters.keyname + "\")";
                    break;

                case "key_name_release":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyUp(\"" + condition.parameters.keyname + "\")";
                    break;

                case "any_key_down":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.anyKey";
                    break;

                case "collides_with":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.CollidesWith(\"" + condition.parameters.entity + "_Entity\")";
                    auxCond["entity"] = condition.entity;
                    break;

                case "x_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.X " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.x_position;
                    auxCond["entity"] = condition.entity;
                    break;

                case "y_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.Y " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.y_position;
                    auxCond["entity"] = condition.entity;
                    break;

                case "z_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.Z " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.z_position;
                    auxCond["entity"] = condition.entity;
                    break;

                case "attribute_value_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e." + condition.parameters.attribute_name + " " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.attribute_value;
                    auxCond["entity"] = condition.entity;
                    break;

                case "every_x_time":
                    currentNode = startNode;
                    auxCond["type"] = "invoke";
                    auxCond["parameters"] = ", " + condition.parameters.elapsed_milliseconds / 1000 + "f, " + condition.parameters.elapsed_milliseconds / 1000 + "f);\n";
                    break;
            }

            targetEvent["conditions"].push(auxCond);
        }

        // Acciones
        for (var j = 0; j < event.actions.length; j++) {
            var action = event.actions[j];
            var auxAct = {};

            switch (action.name) {
                case "set_x_position":
                    auxAct["parameters"] = action.entity + ".X = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "set_y_position":
                    auxAct["parameters"] = action.entity + ".Y = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "set_z_position":
                    auxAct["parameters"] = action.entity + ".Z = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "set_text":
                    auxAct["parameters"] = action.entity + ".GetComponent<UnityEngine.UI.Text>().text = " + action.parameters.text + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "set_attribute_value":
                    auxAct["parameters"] = action.entity + "." + action.parameters.attribute_name + " = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "create_entity":
                    auxAct["parameters"] = "var aux = Instantiate(" + action.parameters.entity + "Prefab, new Vector3(" + action.parameters.x_position + ", " + action.parameters.y_position + ", " + action.parameters.z_position + "), Quaternion.identity); aux.name = \"" + action.parameters.entity + "_Entity\";";
                    auxAct["entity"] = action.entity;
                    break;

                case "destroy_entity":
                    auxAct["parameters"] = "Destroy(" + action.entity + ".gameObject);";
                    auxAct["entity"] = action.entity;
                    break;
            }

            targetEvent["actions"].push(auxAct);
        }

        currentNode.push(targetEvent);
    }

    codeNodes["startNode"] = startNode;
    codeNodes["updateNode"] = updateNode;
    codeNodes["fixedUpdateNode"] = fixedUpdateNode;

    return codeNodes;
}

function generateCSharpCode(inputNodes) {
    var code =
        `
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Autogenerated : MonoBehaviour {
    
    private IEnumerable<Disparo_Entity> allDisparo;
    private IEnumerable<Materia_Entity> allMateria;
    private IEnumerable<Personaje_Entity> allPersonaje;
    private IEnumerable<TextoFeedback_Entity> allTextoFeedback;
    private IEnumerable<GameMaster_Entity> allGameMaster;
    private IEnumerable<System_Entity> allSystem;
    private IEnumerable<Disparo_Entity> filteredDisparo;
    private IEnumerable<Materia_Entity> filteredMateria;
    private IEnumerable<Personaje_Entity> filteredPersonaje;
    private IEnumerable<TextoFeedback_Entity> filteredTextoFeedback;
    private IEnumerable<GameMaster_Entity> filteredGameMaster;
    private IEnumerable<System_Entity> filteredSystem;

    /* PREFABS */
    public GameObject DisparoPrefab;
    public GameObject MateriaPrefab;
    public GameObject PersonajePrefab;
    public GameObject TextoFeedbackPrefab;
    public GameObject GameMasterPrefab;
    public GameObject SystemPrefab;

	void Start () {
`+ view.convertNodeToCode(inputNodes["startNode"]) + `
	}
	
	void Update () {
` + view.convertNodeToCode(inputNodes["updateNode"]) + `
    }
    
	void FixedUpdate () {
` + view.convertNodeToCode(inputNodes["fixedUpdateNode"]) + `
    }
    
    /* EVENT INITIALIZATION */
    private void NewEvent()
    {
        allPersonaje = FindObjectsOfType<Personaje_Entity>().ToList<Personaje_Entity>();
        allMateria = FindObjectsOfType<Materia_Entity>().ToList<Materia_Entity>();
        allDisparo = FindObjectsOfType<Disparo_Entity>().ToList<Disparo_Entity>();
        allTextoFeedback = FindObjectsOfType<TextoFeedback_Entity>().ToList<TextoFeedback_Entity>();
        allGameMaster = FindObjectsOfType<GameMaster_Entity>().ToList<GameMaster_Entity>();
        allSystem = FindObjectsOfType<System_Entity>().ToList<System_Entity>();
        filteredPersonaje = allPersonaje;
        filteredDisparo = allDisparo;
        filteredMateria = allMateria;
        filteredTextoFeedback = allTextoFeedback;
        filteredGameMaster = allGameMaster;
        filteredSystem = allSystem;
    }

    /* INVOKE CALLBACKS */
` + view.invokeCallbacks + `
}
`;

    view.inputNodes = inputNodes;

    return code;
}

var view = {
    inputNodes: [],
    invokeCallbacks: "",
    convertNodeToCode: function (codeNode) {
        var code = "";

        for (var i = 0; i < codeNode.length; i++) {
            var conditions = codeNode[i].conditions;
            var actions = codeNode[i].actions;
            var curlyCloseCount = 0;
            var invokeCallbackCount = 0;
            var invokeCallbackCode = false;

            code += "/* EVENT START */\nNewEvent();\n";


            for (var j = 0; j < conditions.length; j++) {
                var condition = conditions[j];

                if (condition.type != null) {
                    switch (condition.type) {
                        case "if":
                            code += "if( " + condition.parameters + " ){\n";
                            curlyCloseCount++;
                            break;
                        case "filter":
                            code += "filtered" + condition.entity + " = filtered" + condition.entity + ".Where(" + condition.parameters + ");\n";
                            break;
                        case "filter&&if":
                            code += "filtered" + condition.entity + " = filtered" + condition.entity + ".Where(" + condition.parameters + ");\nif( filtered" + condition.entity + ".Count() > 0 ){";
                            curlyCloseCount++;
                            break;
                        case "invoke":
                            invokeCallbackCode = true;
                            code += "InvokeRepeating(\"InvokeCallback" + invokeCallbackCount + "\"" + condition.parameters;
                            break;
                    }
                }
            }

            var aux = "";
            for (var j = 0; j < actions.length; j++) {
                var action = actions[j];

                aux += "foreach(" + action.entity + "_Entity " + action.entity + " in filtered" + action.entity + ") { " + action.parameters + " }\n";
            }

            for (var j = 0; j < curlyCloseCount; j++) {
                aux += "}\n";
            }

            if (invokeCallbackCode) {
                this.invokeCallbacks += "void InvokeCallback" + invokeCallbackCount + "(){ \nNewEvent();\n" + aux + " }\n";

                invokeCallbackCount++;
                invokeCallbackCode = false;
            } else {
                code += aux;
            }
        }

        return code;
    }
}


// DATABASE
// Se conecta a la Base
function mongoConnect(onSuccessCallback) {
    mongoDb.connect("mongodb://pabloanania:universidaddepalermo2018@ds115753.mlab.com:15753/pabloanania", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        onSuccessCallback(db);
    });
}

function mongoInsert(objToInsert, databaseName, collectionName) {
    mongoConnect(function (db) {
        db.db(databaseName).collection(collectionName).insertOne(objToInsert, function (err, res) {
            if (err) throw err;
            console.log("1 documento insertado");
            db.close();
        });
    });
}

function mongoFindOne(objToFind, databaseName, collectionName, onSuccessCallback) {
    mongoConnect(function (db) {
        db.db(databaseName).collection(collectionName).findOne(objToFind, function (err, res) {
            if (err) throw err;
            onSuccessCallback(res);
            db.close();
        });
    });
}

function mongoFind(objToFind, databaseName, collectionName, objSortRules, onSuccessCallback) {
    mongoConnect(function (db) {
        db.db(databaseName).collection(collectionName).find(objToFind).sort(objSortRules).toArray(function (err, res) {
            if (err) throw err;
            onSuccessCallback(res);
            db.close();
        });
    });
}

function mongoDeleteOne(objToFind, databaseName, collectionName) {
    mongoConnect(function (db) {
        db.db(databaseName).collection(collectionName).deleteOne(objToFind, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
}

function mongoUpdateOne(objToFind, updateObj, databaseName, collectionName) {
    mongoConnect(function (db) {
        db.db(databaseName).collection(collectionName).updateOne(objToFind, { $set: updateObj }, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
}


// HELPERS
function getCSharpComparer(comp) {
    switch (comp) {
        case "GT":
            return ">";
        case "LT":
            return "<";
        case "GE":
            return ">=";
        case "LE":
            return "<=";
        case "EQ":
            return "=";
    }
}