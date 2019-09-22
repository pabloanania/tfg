# TFG - Prototype
## TO DO
* Ver porque al colisionar con una materia suma calificacion a todas las que están en escena (parece tener que ver con guardar strings en lugar de guardar objetos)
* Ver porque cuando el personaje choca con una materia desaparecen todas las materias (parece tener que ver con info sucia de colisiones una vez que se destruye el objeto -tiene el nombre en el listado pero ya no existe mas-)

## TO FIX


## CANDY
* Implementar Mustache
* El allEntity, filteredEntity y Entity (del foreach) deberían estar todos como atributo de la entidad
* GameMaster y System prestan confusión
* Agregar manejo de animaciones
* Que diga la puntuación del aprobado

## KNOWN BUGS
* Las condiciones de tipo "every_x_time" no pueden ir acompañadas de condiciones que generen curly braces (ej. tipo "if"). Analizar repararla con https://stackoverflow.com/questions/13019433/calling-a-method-every-x-minutes/21590665