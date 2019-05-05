const express = require('express');
const bodyParser = require('body-parser');
const mongoDb = require('mongodb');

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

    res.status(200).send(generated);
});



// EJEMPLO: Obtiene providers por id
app.get('/api/providers/:id', (req, res) => {
    mongoFindOne(ObjectId(req.params.id), "pabloanania", "messages", function (foundObj) {
        if (foundObj) {
            res.json(foundObj);
        } else {
            res.status(404).end();
        }
    });
});

// EJEMPLO: Añade nuevo provider
app.post('/api/providers', (req, res) => {
    mongoInsert(req.body, "pabloanania", "messages", { "id": -1 }, function (e) {
        // FIX: Obtiene el ultimo id. Al ser string lo parsea y vuelve a convertirlo a string para ser compatible con el formato de la base
        if (e.length > 0 && e[0].id != undefined)
            req.body.id = (parseInt(e[0].id) + 1).toString();

        // En caso de que el body no traiga los campos necesarios, los crea
        if (req.body.name == undefined)
            req.body.name = "";
        if (req.body.address == undefined)
            req.body.address = "";
        if (req.body.contacto == undefined)
            req.body.contacto = "";

        // Inserta el elemento del body
        mongoInsert(req.body, "tp", "messages");

        res.status(201).send(req.body);
    });
});

// EJEMPLO: Elimina provider
app.delete('/api/providers/:id', (req, res) => {
    mongoDeleteOne({ "id": req.params.id }, "pabloanania", "messages");
    res.status(204).end();
});

// EJEMPLO: Actualiza provider
app.put('/api/providers/:id', (req, res) => {
    mongoUpdateOne({ "id": req.params.id }, req.body, "pabloanania", "messages");

    res.status(200).end();
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
                    auxCond["type"] = "if";
                    auxCond["parameters"] = condition.entity + "_Entity.CollidesWith(" + condition.parameters.entity + "_Entity)";
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
                    auxAct = action.entity + ".Transform.position.y = " + action.parameters.value + ";";
                    break;
                case "set_y_position":
                    auxAct = action.entity + ".Transform.position.y = " + action.parameters.value + ";";
                    break;
                case "set_z_position":
                    auxAct = action.entity + ".Transform.position.y = " + action.parameters.value + ";";
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