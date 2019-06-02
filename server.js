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
        currentNode = updateNode;
        var targetEvent = { "conditions": [], "actions": [] }
        var event = inputEvents[i];

        // Condiciones
        for (var j = 0; j < event.conditions.length; j++) {
            var condition = event.conditions[j];
            var auxCond = {};

            switch (condition.name) {
                case "always":
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "true";
                    break;

                case "key_code_hold":
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKey(" + condition.parameters.keycode + ")";
                    break;

                case "key_code_press":
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyDown(" + condition.parameters.keycode + ")";
                    break;

                case "key_code_release":
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyUp(" + condition.parameters.keycode + ")";
                    break;

                case "any_key_down":
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.anyKey";
                    break;

                case "collides_with":
                    auxCond["type"] = "filter";
                    auxCond["parameters"] = condition.entity + ".CollidesWith(" + condition.parameters.entity + ")";
                    break;

                case "x_position_is":
                    auxCond["type"] = "filter";
                    auxCond["parameters"] = condition.entity + ".XPositionIs(" + condition.parameters.x_position + ", '" + condition.parameters.operator + "')";
                    break;
            }

            targetEvent["conditions"].push(auxCond);
        }

        // Acciones
        for (var j = 0; j < event.actions.length; j++) {
            var action = event.actions[j];
            var auxAct;

            switch (action.name) {
                case "set_x_position":
                    auxAct = action.entity + ".Transform.position.x = " + action.parameters.value + ";";
                    break;
                case "set_y_position":
                    auxAct = action.entity + ".Transform.position.y = " + action.parameters.value + ";";
                    break;
                case "set_z_position":
                    auxAct = action.entity + ".Transform.position.z = " + action.parameters.value + ";";
                    break;
                case "destroy_entity":
                    auxAct = "Destroy(" + action.entity + ");";
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
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour {
    
private List<Disparo_Entity> allDisparo;
private List<Disparo_Entity> allMateria;
private List<Disparo_Entity> allAlumno;

	void Start () {
initializeEntitiesList();

`+ view.convertNodeToCode(inputNodes["startNode"]) + `
	}
	
	void Update () {
` + view.convertNodeToCode(inputNodes["updateNode"]) + `
    }
    
	void FixedUpdate () {
` + view.convertNodeToCode(inputNodes["fixedUpdateNode"]) + `
	}
}
`;

    view.inputNodes = inputNodes;

    return code;
}

var view = {
    inputNodes: [],
    convertNodeToCode: function (codeNode) {
        var code = "";

        for (var i = 0; i < codeNode.length; i++) {
            var conditions = codeNode[i].conditions;
            var actions = codeNode[i].actions;
            var curlyCloseCount = 0;

            code += "newEvent();\n";


            for (var j = 0; j < conditions.length; j++) {
                var condition = conditions[j];

                if (condition.type != null){
                    switch (condition.type) {
                        case "if":
                            code += "if(" + condition.parameters + "){\n";
                            curlyCloseCount++;
                            break;
                        case "filter":
                            code += "Filter(" + condition.parameters + ");\n";
                            break;
                    }
                }
            }

            for (var j = 0; j < actions.length; j++) {
                var action = actions[j];
                code += action + "\n";
            }

            for (var j = 0; j < curlyCloseCount; j++) {
                code += "}\n";
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