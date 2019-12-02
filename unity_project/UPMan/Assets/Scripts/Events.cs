
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Events : MonoBehaviour {
    /* ENTITIES */
private List<System_Entity> allSystem;
private List<System_Entity> filteredSystem;
private List<UPMan_Entity> allUPMan;
private List<UPMan_Entity> filteredUPMan;
private List<Pellet_Entity> allPellet;
private List<Pellet_Entity> filteredPellet;
 

    /* PREFABS */
public GameObject SystemPrefab;
public GameObject UPManPrefab;
public GameObject PelletPrefab;


    void Start () {

	}
	
	void Update () {
/* EVENT START */
NewEvent();
if( Input.GetKeyDown("right") ){
foreach(UPMan_Entity UPMan in filteredUPMan) { UPMan.hSpeed = 0.5f; }
}
/* EVENT START */
NewEvent();
if( Input.GetKeyDown("left") ){
foreach(UPMan_Entity UPMan in filteredUPMan) { UPMan.hSpeed = -0.5f; }
}
/* EVENT START */
NewEvent();
if( true ){
foreach(UPMan_Entity UPMan in filteredUPMan) { UPMan.X = UPMan.X + UPMan.hSpeed; }
}
/* EVENT START */
NewEvent();
filteredUPMan = filteredUPMan.Where(e => e.CollidesWith("Pellet_Entity")).ToList();
filteredPellet = filteredPellet.Where(e => e.CollidesWith("UPMan_Entity")).ToList();
if( filteredUPMan.Count() > 0 && filteredPellet.Count() > 0 ){foreach(Pellet_Entity Pellet in filteredPellet) { Destroy(Pellet.gameObject); ClearCollisionData(Pellet); }
}

    }
    
	void FixedUpdate () {

    }
    
    /* EVENT INITIALIZATION */
    private void NewEvent() {
allSystem = FindObjectsOfType<System_Entity>().ToList();
filteredSystem = allSystem;
allUPMan = FindObjectsOfType<UPMan_Entity>().ToList();
filteredUPMan = allUPMan;
allPellet = FindObjectsOfType<Pellet_Entity>().ToList();
filteredPellet = allPellet;

    }

    /* CLEARS COLLISION DATA ON EACH ENTITY */
    private void ClearCollisionData(Entity entity) {
foreach (Entity System in allSystem) { System.collisions.Remove(entity.gameObject); }
foreach (Entity UPMan in allUPMan) { UPMan.collisions.Remove(entity.gameObject); }
foreach (Entity Pellet in allPellet) { Pellet.collisions.Remove(entity.gameObject); }

    }

    /* INVOKE CALLBACKS */

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
