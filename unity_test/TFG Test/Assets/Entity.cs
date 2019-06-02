using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Entity : MonoBehaviour
{
    protected List<String> collisions = new List<string>();

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
        get { return transform.position.x; }
        set { transform.position = new Vector3(transform.position.x, transform.position.y, value); }
    }

    public bool CollidesWith(String entityName)
    {
        if (collisions.Where(c => c == entityName).Count() > 0)
            return true;
        else
            return false;
    }

    public void ClearCollisionData()
    {
        collisions.Clear();
    }
}
