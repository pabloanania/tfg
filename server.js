const express = require('express');
const bodyParser = require('body-parser');
const mongoDb = require('mongodb');
const mustache = require('mustache');
const app = express();
const ObjectId = require('mongodb').ObjectID;

const databaseName = 'pabloanania';
const secret = 'universidaddepalermo2018';



// SERVER
// Parsear body de request como json
app.use(bodyParser.json());

// get home
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/eventeditor.html");
});

// devuelve archivos del servidor
app.get(['/libs/*', '/css/*', '/ico/*', '/js/*', '/fonts/*', '/views/*'], (req, res) => {
    res.sendFile(__dirname + req.originalUrl);
});

// Inicia servidor
app.listen(5000, function () {
    console.log('Servidor escuchando en port 5000');
});



// API

// Genera el código a partir del json de eventos pasado por parámetro
app.post('/api/eventcodegenerator', (req, res) => {
    var events = req.body.events;
    var entities = req.body.entities;

    var generated = generateCSharpNodes(events);
    var code = generateCSharpCode(generated, entities);

    res.status(200).json({ "content": code, "name": "Events.cs" });
});

// Genera la clase en código de C# para la entidad pasada por parámetro
app.post('/api/entitycodegenerator', (req, res) => {
    var entity = req.body.entity;

    var code = createEntityCode(entity);

    res.status(200).json({ "content": code, "name": req.body.entity.name + "_Entity.cs" });
});

// Guarda hoja de eventos
app.post('/api/save/', (req, res) => {
    // Primero busca, en caso de existir actualiza, sino lo crea
    mongoFind({ "name": req.body.name }, databaseName, "uniface", {}, function (data, err) {
        if (err) {
            endByError(res, "Error al intentar guardar el proyecto", 400);
        } else {
            if (data.length == 0) {
                mongoInsert(req.body, databaseName, "uniface", function (i_res, err) {
                    if (err) {
                        if (err.code == 11000)
                            endByError(res, "El proyecto que intenta crear ya existe", 400);
                    } else {
                        res.status(201).send();
                    }
                });
            } else {
                mongoUpdateOne({ "name": req.body.name }, req.body, databaseName, "uniface");
            }
        }
    });
});

// Carga hoja de eventos
app.post('/api/load/', (req, res) => {
    mongoFind({ "name": req.body.name }, databaseName, "uniface", {}, function (data, err) {
        if (err) {
            endByError(res, "Error al intentar cargar el proyecto", 400);
        } else {
            if (data.length == 0) {
                endByError(res, "El proyecto que intenta cargar no existe", 400);
            } else {
                res.status(200).send(data[0]);
            }
        }

    });
});

// Envía response con fin abrupto por error
function endByError(res, message, code) {
    res.status(code).send({ "error": message }).end();
}

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
                    auxCond["parameters"] = "Input.GetKey(\"" + condition.parameters.value + "\")";
                    break;

                case "key_name_press":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyDown(\"" + condition.parameters.value + "\")";
                    break;

                case "key_name_release":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.GetKeyUp(\"" + condition.parameters.value + "\")";
                    break;

                case "any_key_down":
                    currentNode = updateNode;
                    auxCond["type"] = "if";
                    auxCond["parameters"] = "Input.anyKey";
                    break;

                case "collides_with":
                    currentNode = updateNode;
                    auxCond["type"] = "twosidefilter&&if";
                    auxCond["parameters"] = [];
                    auxCond["entity"] = [];
                    auxCond["parameters"][0] = "e => e.CollidesWith(\"" + condition.parameters.entity + "_Entity\")";
                    auxCond["parameters"][1] = "e => e.CollidesWith(\"" + condition.entity + "_Entity\")";
                    auxCond["entity"][0] = condition.entity;
                    auxCond["entity"][1] = condition.parameters.entity;
                    break;

                case "x_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.X " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.value;
                    auxCond["entity"] = condition.entity;
                    break;

                case "y_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.Y " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.value;
                    auxCond["entity"] = condition.entity;
                    break;

                case "z_position_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e.Z " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.value;
                    auxCond["entity"] = condition.entity;
                    break;

                case "attribute_value_is":
                    currentNode = updateNode;
                    auxCond["type"] = "filter&&if";
                    auxCond["parameters"] = "e => e." + condition.parameters.attribute_name + " " + getCSharpComparer(condition.parameters.operator) + " " + condition.parameters.value;
                    auxCond["entity"] = condition.entity;
                    break;

                case "every_x_time":
                    currentNode = startNode;
                    auxCond["type"] = "invoke";
                    auxCond["parameters"] = ", " + condition.parameters.value / 1000 + "f, " + condition.parameters.value / 1000 + "f);\n";
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
                    auxAct["parameters"] = action.entity + ".GetComponent<UnityEngine.UI.Text>().text = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "set_attribute_value":
                    auxAct["parameters"] = action.entity + "." + action.parameters.attribute_name + " = " + action.parameters.value + ";";
                    auxAct["entity"] = action.entity;
                    break;

                case "create_entity":
                    auxAct["parameters"] = "var aux = Instantiate(" + action.entity + "Prefab, new Vector3(" + action.parameters.x_position + ", " + action.parameters.y_position + ", " + action.parameters.z_position + "), Quaternion.identity); aux.name = \"" + action.entity + "_Entity\";";
                    auxAct["entity"] = "System";
                    break;

                case "destroy_entity":
                    auxAct["parameters"] = "Destroy(" + action.entity + ".gameObject); ClearCollisionData(" + action.entity + ");";
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

function generateCSharpCode(inputNodes, entities) {
    view.entities = entities;
    var code =
        `
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Events : MonoBehaviour {
    /* ENTITIES */
` + view.createEntitiesListCode() + ` 

    /* PREFABS */
` + view.createPrefabsCode() + `

    void Start () {
` + view.convertNodeToCode(inputNodes["startNode"]) + `
	}
	
	void Update () {
` + view.convertNodeToCode(inputNodes["updateNode"]) + `
    }
    
	void FixedUpdate () {
` + view.convertNodeToCode(inputNodes["fixedUpdateNode"]) + `
    }
    
    /* EVENT INITIALIZATION */
    private void NewEvent() {
` + view.createNewEventCode() + `
    }

    /* CLEARS COLLISION DATA ON EACH ENTITY */
    private void ClearCollisionData(Entity entity) {
` + view.createCollisionDataClearingCode() + `
    }

    /* INVOKE CALLBACKS */
` + view.invokeCallbacks + `
}

/* ENTITY CLASS. EACH UNIFACE ENTITY INHERITS FROM THIS */
public class Entity : MonoBehaviour
{
    public List<GameObject> collisions = new List<GameObject>();

    public float X
    {
        get { return transform.position.x; }
        set { transform.position = new Vector3(value, transform.position.y, transform.position.z); }
    }
    public float Y
    {
        get { return transform.position.y; }
        set { transform.position = new Vector3(transform.position.x, value, transform.position.z); }
    }
    public float Z
    {
        get { return transform.position.z; }
        set { transform.position = new Vector3(transform.position.x, transform.position.y, value); }
    }

    public bool CollidesWith(string entityName)
    {
        if (collisions.Where(c => c.name == entityName).Count() > 0)
            return true;
        else
            return false;
    }
}
`;

    view.inputNodes = inputNodes;

    return code;
}

function createEntityCode(entity) {
    var code =
        `
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ` + entity.name + `_Entity : Entity
{
    
`
    if (entity.attributes != undefined) {
        for (var i = 0; i < entity.attributes.length; i++) {
            code += "public " + entity.attributes[i].type + " " + entity.attributes[i].name;

            if (entity.attributes[i].value != undefined) {
                code += "=" + entity.attributes[i].value;
            }

            code += ";\n";
        }
    }

    code += `

// Use this for initialization
void Start()
{

}

// Update is called once per frame
void Update()
{

}

void OnCollisionEnter(Collision col)
{
    collisions.Add(col.gameObject);
}

void OnCollisionExit(Collision col)
{
    collisions.Remove(col.gameObject);
}
}
`;
    return code;
}

var view = {
    inputNodes: [],
    invokeCallbacks: "",
    entities: [],
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
                            code += "filtered" + condition.entity + " = filtered" + condition.entity + ".Where(" + condition.parameters + ").ToList();\n";
                            break;
                        case "filter&&if":
                            code += "filtered" + condition.entity + " = filtered" + condition.entity + ".Where(" + condition.parameters + ").ToList();\nif( filtered" + condition.entity + ".Count() > 0 ){";
                            curlyCloseCount++;
                            break;
                        case "twosidefilter&&if":
                            code += "filtered" + condition.entity[0] + " = filtered" + condition.entity[0] + ".Where(" + condition.parameters[0] + ").ToList();\nfiltered" + condition.entity[1] + " = filtered" + condition.entity[1] + ".Where(" + condition.parameters[1] + ").ToList();\nif( filtered" + condition.entity[0] + ".Count() > 0 && filtered" + condition.entity[1] + ".Count() > 0 ){";
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
    },
    createEntitiesListCode: function () {
        var code = "";

        for (var i = 0; i < this.entities.length; i++) {
            var entityName = this.entities[i].name;
            code += "private List<" + entityName + "_Entity> all" + entityName + ";\n";
            code += "private List<" + entityName + "_Entity> filtered" + entityName + ";\n";
        }

        return code;
    },
    createPrefabsCode: function () {
        var code = "";

        for (var i = 0; i < this.entities.length; i++) {
            var entityName = this.entities[i].name;
            code += "public GameObject " + entityName + "Prefab;\n";
        }

        return code;
    },
    createNewEventCode: function () {
        var code = "";

        for (var i = 0; i < this.entities.length; i++) {
            var entityName = this.entities[i].name;
            code += "all" + entityName + " = FindObjectsOfType<" + entityName + "_Entity>().ToList();\n";
            code += "filtered" + entityName + " = all" + entityName + ";\n";
        }

        return code;
    },
    createCollisionDataClearingCode: function () {
        var code = "";

        for (var i = 0; i < this.entities.length; i++) {
            var entityName = this.entities[i].name;
            code += "foreach (Entity " + entityName + " in all" + entityName + ") { " + entityName + ".collisions.Remove(entity.gameObject); }\n";
        }

        return code;
    }
}


// DATABASE
// Se conecta a la Base
function mongoConnect(onSuccessCallback) {
    mongoDb.connect("mongodb://" + databaseName + ":" + secret + "@ds115753.mlab.com:15753/pabloanania", { useNewUrlParser: true }, function (err, db) {
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