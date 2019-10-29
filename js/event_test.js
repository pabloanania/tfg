var eventTest =
{
	"name": "EventTest",
	"entities": [
		{
			"name": "System"
		},
		{
			"name": "Disparo"
		},
		{
			"name": "GameMaster",
			"attributes": [
				{
					"name": "TiempoCreacionMateria",
					"type": "int",
					"value": 0
				}
			]
		},
		{
			"name": "Materia",
			"attributes": [
				{
					"name": "Calificacion",
					"type": "int"
				}
			]
		},
		{
			"name": "Personaje"
		},
		{
			"name": "TextoFeedback",
			"attributes": [
				{
					"name": "TiempoMostrarse",
					"type": "int",
					"value": 0
				}
			]
		}
	],
	"events": [
		{
			"conditions": [
				{
					"name": "always",
					"entity": "System"
				}
			],
			"actions": [
				{
					"name": "set_z_position",
					"entity": "Disparo",
					"parameters": {
						"value": "Disparo.Z + 0.1f"
					}
				},
				{
					"name": "set_z_position",
					"entity": "Materia",
					"parameters": {
						"value": "Materia.Z - 0.1f"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "every_x_time",
					"entity": "System",
					"parameters": {
						"value": "1000"
					}
				}
			],
			"actions": [
				{
					"name": "set_attribute_value",
					"entity": "TextoFeedback",
					"parameters": {
						"attribute_name": "TiempoMostrarse",
						"value": "TextoFeedback. TiempoMostrarse - 1"
					}
				},
				{
					"name": "set_attribute_value",
					"entity": "GameMaster",
					"parameters": {
						"attribute_name": "TiempoCreacionMateria",
						"value": "GameMaster.TiempoCreacionMateria + Random.Range(0,11)"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "key_name_hold",
					"entity": "System",
					"parameters": {
						"value": "right"
					}
				},
				{
					"name": "x_position_is",
					"entity": "Personaje",
					"operators": [
						"AND"
					],
					"parameters": {
						"operator": "LT",
						"value": "7"
					}
				}
			],
			"actions": [
				{
					"name": "set_x_position",
					"entity": "Personaje",
					"parameters": {
						"value": "Personaje.X + 0.1f"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "key_name_hold",
					"entity": "System",
					"parameters": {
						"value": "left"
					}
				},
				{
					"name": "x_position_is",
					"entity": "Personaje",
					"operators": [
						"AND"
					],
					"parameters": {
						"operator": "GT",
						"value": "-7"
					}
				}
			],
			"actions": [
				{
					"name": "set_x_position",
					"entity": "Personaje",
					"parameters": {
						"value": "Personaje.X - 0.1f"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "key_name_press",
					"entity": "System",
					"parameters": {
						"value": "space"
					}
				}
			],
			"actions": [
				{
					"name": "create_entity",
					"entity": "System",
					"parameters": {
						"entity": "Disparo",
						"x_position": "filteredPersonaje.First().X",
						"y_position": "filteredPersonaje.First().Y",
						"z_position": "filteredPersonaje.First().Z + 1.0f"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "collides_with",
					"entity": "Disparo",
					"parameters": {
						"entity": "Materia"
					}
				}
			],
			"actions": [
				{
					"name": "destroy_entity",
					"entity": "Disparo"
				},
				{
					"name": "set_attribute_value",
					"entity": "Materia",
					"parameters": {
						"attribute_name": "Calificacion",
						"value": "Materia.Calificacion + 1"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "attribute_value_is",
					"entity": "Materia",
					"parameters": {
						"attribute_name": "Calificacion",
						"operator": "LT",
						"value": "4"
					}
				},
				{
					"name": "z_position_is",
					"entity": "Materia",
					"operators": [
						"AND"
					],
					"parameters": {
						"operator": "LT",
						"value": "-10"
					}
				}
			],
			"actions": [
				{
					"name": "set_text",
					"entity": "TextoFeedback",
					"parameters": {
						"text": "\"REPROBADO!!\""
					}
				},
				{
					"name": "destroy_entity",
					"entity": "Materia"
				},
				{
					"name": "set_attribute_value",
					"entity": "TextoFeedback",
					"parameters": {
						"attribute_name": "TiempoMostrarse",
						"value": "3"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "collides_with",
					"entity": "Personaje",
					"parameters": {
						"entity": "Materia"
					}
				}
			],
			"actions": [
				{
					"name": "set_text",
					"entity": "TextoFeedback",
					"parameters": {
						"text": "\"REPROBADO!!\""
					}
				},
				{
					"name": "destroy_entity",
					"entity": "Materia"
				},
				{
					"name": "set_attribute_value",
					"entity": "TextoFeedback",
					"parameters": {
						"attribute_name": "TiempoMostrarse",
						"value": "3"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "attribute_value_is",
					"entity": "Materia",
					"parameters": {
						"attribute_name": "Calificacion",
						"operator": "GE",
						"value": "4"
					}
				},
				{
					"name": "z_position_is",
					"entity": "Materia",
					"operators": [
						"AND"
					],
					"parameters": {
						"operator": "LT",
						"value": "-10"
					}
				}
			],
			"actions": [
				{
					"name": "set_text",
					"entity": "TextoFeedback",
					"parameters": {
						"text": "\"APROBADO CON \" + filteredMateria.First().Calificacion + \"!\""
					}
				},
				{
					"name": "destroy_entity",
					"entity": "Materia"
				},
				{
					"name": "set_attribute_value",
					"entity": "TextoFeedback",
					"parameters": {
						"attribute_name": "TiempoMostrarse",
						"value": "3"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "attribute_value_is",
					"entity": "TextoFeedback",
					"parameters": {
						"attribute_name": "TiempoMostrarse",
						"operator": "LE",
						"value": "0"
					}
				}
			],
			"actions": [
				{
					"name": "set_text",
					"entity": "TextoFeedback",
					"parameters": {
						"text": "\"\""
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "attribute_value_is",
					"entity": "Materia",
					"parameters": {
						"attribute_name": "Calificacion",
						"operator": "GT",
						"value": "10"
					}
				}
			],
			"actions": [
				{
					"name": "set_attribute_value",
					"entity": "Materia",
					"parameters": {
						"attribute_name": "Calificacion",
						"value": "10"
					}
				}
			]
		},
		{
			"conditions": [
				{
					"name": "attribute_value_is",
					"entity": "GameMaster",
					"parameters": {
						"attribute_name": "TiempoCreacionMateria",
						"operator": "GE",
						"value": "10"
					}
				}
			],
			"actions": [
				{
					"name": "set_attribute_value",
					"entity": "GameMaster",
					"parameters": {
						"attribute_name": "TiempoCreacionMateria",
						"value": "0"
					}
				},
				{
					"name": "create_entity",
					"entity": "System",
					"parameters": {
						"entity": "Materia",
						"x_position": "Random.Range(-7,7)",
						"y_position": "0",
						"z_position": "40"
					}
				}
			]
		}
	]
};