# TFG - Prototype
## TO DO
* Editor de Entidades
* Nuevo proyecto
* Almacenar proyecto
* Cargar proyecto
* Cambiar value por... (en API -conditions-):
 * elapsed-miliseconds
 * keyname
 * x_position 
 * y_position
 * z_position
 * attribute_value
 * text
 * Arreglar lo de crear nueva instancia ya no es de system sino de la entidad en si
* Descarga de .cs desde el editor visual

## TO FIX
* Mientras más veces se llama a generar código (sin apagar server), más veces se generan InvokeCallback duplicados

## CANDY
* Implementar Mustache
* El allEntity, filteredEntity y Entity (del foreach) deberían estar todos como atributo de la entidad
* GameMaster y System prestan confusión
* Destroy debería ser una función propia de Autogenerated que haga el Destroy + ClearCollisionData
* Agregar manejo de animaciones
* Que diga la puntuación del aprobado
* Tooltips para los iconos del editor de eventos
* Implementar los operators de condiciones (AND, OR, NOT)

## KNOWN BUGS
* Las condiciones de tipo "every_x_time" no pueden ir acompañadas de condiciones que generen curly braces (ej. tipo "if"). Analizar repararla con https://stackoverflow.com/questions/13019433/calling-a-method-every-x-minutes/21590665