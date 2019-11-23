
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Events : MonoBehaviour {
    /* ENTITIES */
private List<System_Entity> allSystem;
private List<System_Entity> filteredSystem;
private List<Disparo_Entity> allDisparo;
private List<Disparo_Entity> filteredDisparo;
private List<GameMaster_Entity> allGameMaster;
private List<GameMaster_Entity> filteredGameMaster;
private List<Materia_Entity> allMateria;
private List<Materia_Entity> filteredMateria;
private List<Personaje_Entity> allPersonaje;
private List<Personaje_Entity> filteredPersonaje;
private List<TextoFeedback_Entity> allTextoFeedback;
private List<TextoFeedback_Entity> filteredTextoFeedback;
 

    /* PREFABS */
public GameObject SystemPrefab;
public GameObject DisparoPrefab;
public GameObject GameMasterPrefab;
public GameObject MateriaPrefab;
public GameObject PersonajePrefab;
public GameObject TextoFeedbackPrefab;


    void Start () {
/* EVENT START */
NewEvent();
InvokeRepeating("InvokeCallback0", 1f, 1f);

	}
	
	void Update () {
/* EVENT START */
NewEvent();
if( true ){
foreach(Disparo_Entity Disparo in filteredDisparo) { Disparo.Z = Disparo.Z + 0.1f; }
foreach(Materia_Entity Materia in filteredMateria) { Materia.Z = Materia.Z - 0.1f; }
}
/* EVENT START */
NewEvent();
if( Input.GetKey("right") ){
filteredPersonaje = filteredPersonaje.Where(e => e.X < 7).ToList();
if( filteredPersonaje.Count() > 0 ){foreach(Personaje_Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X + 0.1f; }
}
}
/* EVENT START */
NewEvent();
if( Input.GetKey("left") ){
filteredPersonaje = filteredPersonaje.Where(e => e.X > -7).ToList();
if( filteredPersonaje.Count() > 0 ){foreach(Personaje_Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X - 0.1f; }
}
}
/* EVENT START */
NewEvent();
if( Input.GetKeyDown("space") ){
foreach(System_Entity System in filteredSystem) { var aux = Instantiate(DisparoPrefab, new Vector3(filteredPersonaje.First().X, filteredPersonaje.First().Y, filteredPersonaje.First().Z + 1.0f), Quaternion.identity); aux.name = "Disparo_Entity"; }
}
/* EVENT START */
NewEvent();
filteredDisparo = filteredDisparo.Where(e => e.CollidesWith("Materia_Entity")).ToList();
filteredMateria = filteredMateria.Where(e => e.CollidesWith("Disparo_Entity")).ToList();
if( filteredDisparo.Count() > 0 && filteredMateria.Count() > 0 ){foreach(Disparo_Entity Disparo in filteredDisparo) { Destroy(Disparo.gameObject); ClearCollisionData(Disparo); }
foreach(Materia_Entity Materia in filteredMateria) { Materia.Calificacion = Materia.Calificacion + 1; }
}
/* EVENT START */
NewEvent();
filteredMateria = filteredMateria.Where(e => e.Calificacion < 4).ToList();
if( filteredMateria.Count() > 0 ){filteredMateria = filteredMateria.Where(e => e.Z < -10).ToList();
if( filteredMateria.Count() > 0 ){foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "REPROBADO!!"; }
foreach(Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); ClearCollisionData(Materia); }
foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
}
}
/* EVENT START */
NewEvent();
filteredPersonaje = filteredPersonaje.Where(e => e.CollidesWith("Materia_Entity")).ToList();
filteredMateria = filteredMateria.Where(e => e.CollidesWith("Personaje_Entity")).ToList();
if( filteredPersonaje.Count() > 0 && filteredMateria.Count() > 0 ){foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "REPROBADO!!"; }
foreach(Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); ClearCollisionData(Materia); }
foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
}
/* EVENT START */
NewEvent();
filteredMateria = filteredMateria.Where(e => e.Calificacion >= 4).ToList();
if( filteredMateria.Count() > 0 ){filteredMateria = filteredMateria.Where(e => e.Z < -10).ToList();
if( filteredMateria.Count() > 0 ){foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "APROBADO CON " + filteredMateria.First().Calificacion + "!"; }
foreach(Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); ClearCollisionData(Materia); }
foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
}
}
/* EVENT START */
NewEvent();
filteredTextoFeedback = filteredTextoFeedback.Where(e => e.TiempoMostrarse <= 0).ToList();
if( filteredTextoFeedback.Count() > 0 ){foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = ""; }
}
/* EVENT START */
NewEvent();
filteredMateria = filteredMateria.Where(e => e.Calificacion > 10).ToList();
if( filteredMateria.Count() > 0 ){foreach(Materia_Entity Materia in filteredMateria) { Materia.Calificacion = 10; }
}
/* EVENT START */
NewEvent();
filteredGameMaster = filteredGameMaster.Where(e => e.TiempoCreacionMateria >= 10).ToList();
if( filteredGameMaster.Count() > 0 ){foreach(GameMaster_Entity GameMaster in filteredGameMaster) { GameMaster.TiempoCreacionMateria = 0; }
foreach(System_Entity System in filteredSystem) { var aux = Instantiate(MateriaPrefab, new Vector3(Random.Range(-7,7), 0, 40), Quaternion.identity); aux.name = "Materia_Entity"; }
}

    }
    
	void FixedUpdate () {

    }
    
    /* EVENT INITIALIZATION */
    private void NewEvent() {
allSystem = FindObjectsOfType<System_Entity>().ToList();
filteredSystem = allSystem;
allDisparo = FindObjectsOfType<Disparo_Entity>().ToList();
filteredDisparo = allDisparo;
allGameMaster = FindObjectsOfType<GameMaster_Entity>().ToList();
filteredGameMaster = allGameMaster;
allMateria = FindObjectsOfType<Materia_Entity>().ToList();
filteredMateria = allMateria;
allPersonaje = FindObjectsOfType<Personaje_Entity>().ToList();
filteredPersonaje = allPersonaje;
allTextoFeedback = FindObjectsOfType<TextoFeedback_Entity>().ToList();
filteredTextoFeedback = allTextoFeedback;

    }

    /* CLEARS COLLISION DATA ON EACH ENTITY */
    private void ClearCollisionData(Entity entity) {
foreach (Entity System in allSystem) { System.collisions.Remove(entity.gameObject); }
foreach (Entity Disparo in allDisparo) { Disparo.collisions.Remove(entity.gameObject); }
foreach (Entity GameMaster in allGameMaster) { GameMaster.collisions.Remove(entity.gameObject); }
foreach (Entity Materia in allMateria) { Materia.collisions.Remove(entity.gameObject); }
foreach (Entity Personaje in allPersonaje) { Personaje.collisions.Remove(entity.gameObject); }
foreach (Entity TextoFeedback in allTextoFeedback) { TextoFeedback.collisions.Remove(entity.gameObject); }

    }

    /* INVOKE CALLBACKS */
void InvokeCallback0(){ 
NewEvent();
foreach(TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = TextoFeedback. TiempoMostrarse - 1; }
foreach(GameMaster_Entity GameMaster in filteredGameMaster) { GameMaster.TiempoCreacionMateria = GameMaster.TiempoCreacionMateria + Random.Range(0,11); }
 }

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
