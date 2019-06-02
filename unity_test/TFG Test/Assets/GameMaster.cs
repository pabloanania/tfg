using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class GameMaster : MonoBehaviour
{
    private IEnumerable<Entity> allDisparo;
    private IEnumerable<Entity> allMateria;
    private IEnumerable<Entity> allPersonaje;
    private IEnumerable<Entity> filteredDisparo;
    private IEnumerable<Entity> filteredMateria;
    private IEnumerable<Entity> filteredPersonaje;


    void Start()
    {
        
    }

    void Update()
    {
        /* EVENT START */
        NewEvent();
        /* CONDITIONS */
        if (Input.GetKey("right"))
        {
            filteredPersonaje = filteredPersonaje.Where(e => e.X <= 7);

            /* ACTIONS */
            foreach (Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X + 0.1f; }
        }

        /* EVENT START */
        NewEvent();
        /* CONDITIONS */
        if (Input.GetKey("left"))
        {
            filteredPersonaje = filteredPersonaje.Where(e => e.X >= -7);

            /* ACTIONS */
            foreach (Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X - 0.1f; }
        }

        /* EVENT START */
        NewEvent();
        /* CONDITIONS */
        filteredPersonaje = filteredPersonaje.Where(e => e.CollidesWith("Materia_Entity"));
        filteredMateria = filteredMateria.Where(e => e.CollidesWith("Personaje_Entity"));

        /* ACTIONS */
        foreach (Entity Materia in filteredMateria) { Destroy(Materia.gameObject); }

        /* EVENT CLEANUP */
        Cleanup();
    }

    void FixedUpdate()
    {

    }

    private void NewEvent()
    {
        allPersonaje = FindObjectsOfType<Personaje_Entity>().ToList<Entity>();
        allMateria = FindObjectsOfType<Materia_Entity>().ToList<Entity>();
        allDisparo = FindObjectsOfType<Disparo_Entity>().ToList<Entity>();
        filteredPersonaje = allPersonaje;
        filteredDisparo = allDisparo;
        filteredMateria = allMateria;
    }

    private void Cleanup()
    {
        foreach (Entity e in filteredPersonaje)
        {
            e.ClearCollisionData();
        }
        foreach (Entity e in filteredMateria)
        {
            e.ClearCollisionData();
        }
        foreach (Entity e in filteredDisparo)
        {
            e.ClearCollisionData();
        }
    }
}
