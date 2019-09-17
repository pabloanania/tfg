using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TextoFeedback_Entity : Entity
{
    public int TiempoMostrarse = 0;

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
        collisions.Add(col.gameObject.name);
    }

    void OnCollisionExit(Collision col)
    {
        collisions.Remove(col.gameObject.name);
    }
}
