using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Personaje_Entity : Entity {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
        float x = this.X;
	}

    void OnCollisionEnter(Collision col)
    {
        collisions.Add(col.gameObject.name);
    }
}
