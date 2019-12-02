
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UPMan_Entity : Entity
{
    
public float hSpeed=0;


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
