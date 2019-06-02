using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour {
    
private List
<Disparo_Entity> allDisparo;
private List
    <Disparo_Entity> allMateria;
private List
        <Disparo_Entity> allAlumno;

	void Start () {
initializeEntitiesList();


	}
	
	void Update () {
newEvent();
if(true){
Disparo.Transform.position.y = Disparo.Y - 10;
Materia.Transform.position.y = Materia.Y + 2;
}
newEvent();
Materia.Transform.position.y = Materia.Y + 2;
Materia.Transform.position.y = Materia.Y + 2;
newEvent();
if(Input.GetKey(39)){
Filter(Avatar.XPositionIs(800, 'LT'));
Avatar.Transform.position.x = Avatar.X + 5;
}
newEvent();
if(Input.GetKey(37)){
Filter(Avatar.XPositionIs(20, 'GT'));
Avatar.Transform.position.x = Avatar.X - 5;
}
newEvent();
if(Input.GetKeyDown(16)){
Avatar.Transform.position.x = Avatar.X - 5;
}
newEvent();
Filter(Disparo.CollidesWith(Materia));
Destroy(Disparo);
Destroy(Disparo);
newEvent();
Destroy(Disparo);
Destroy(Materia);
Destroy(Materia);
newEvent();
Filter(Avatar.CollidesWith(Materia));
Destroy(Materia);
Destroy(Materia);
Destroy(Materia);
newEvent();
Destroy(Materia);
Destroy(Materia);
Destroy(Materia);
newEvent();
Destroy(Materia);
newEvent();
Destroy(Materia);
newEvent();
Destroy(Materia);
Destroy(Materia);

    }
    
	void FixedUpdate () {

	}
}