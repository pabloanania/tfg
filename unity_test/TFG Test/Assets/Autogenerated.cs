﻿
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Autogenerated : MonoBehaviour
{

    private IEnumerable<Disparo_Entity> allDisparo;
    private IEnumerable<Materia_Entity> allMateria;
    private IEnumerable<Personaje_Entity> allPersonaje;
    private IEnumerable<TextoFeedback_Entity> allTextoFeedback;
    private IEnumerable<GameMaster_Entity> allGameMaster;
    private IEnumerable<System_Entity> allSystem;
    private IEnumerable<Disparo_Entity> filteredDisparo;
    private IEnumerable<Materia_Entity> filteredMateria;
    private IEnumerable<Personaje_Entity> filteredPersonaje;
    private IEnumerable<TextoFeedback_Entity> filteredTextoFeedback;
    private IEnumerable<GameMaster_Entity> filteredGameMaster;
    private IEnumerable<System_Entity> filteredSystem;

    void Start()
    {

    }

    void Update()
    {
        /* EVENT START */
        NewEvent();
        if (true)
        {
            foreach (Disparo_Entity Disparo in filteredDisparo) { Disparo.Y = Disparo.Y - 10; }
            foreach (Materia_Entity Materia in filteredMateria) { Materia.Y = Materia.Y + 2; }
        }
        /* EVENT START */
        NewEvent();
        InvokeRepeating("InvokeCallback0", 1f, 1f);
        /* EVENT START */
        NewEvent();
        if (Input.GetKey("right"))
        {
            filteredPersonaje = filteredPersonaje.Where(e => e.X < 7);
            foreach (Personaje_Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X + 5; }
        }
        /* EVENT START */
        NewEvent();
        if (Input.GetKey("left"))
        {
            filteredPersonaje = filteredPersonaje.Where(e => e.X > -7);
            foreach (Personaje_Entity Personaje in filteredPersonaje) { Personaje.X = Personaje.X - 5; }
        }
        /* EVENT START */
        NewEvent();
        if (Input.GetKeyDown("16"))
        {
            foreach (System_Entity System in filteredSystem) { Instantiate(allDisparo.First(), new Vector3(filteredPersonaje.First().X, filteredPersonaje.First().Y, filteredPersonaje.First().Z), Quaternion.identity); }
        }
        /* EVENT START */
        NewEvent();
        filteredDisparo = filteredDisparo.Where(e => e.CollidesWith("Materia_Entity"));
        foreach (Disparo_Entity Disparo in filteredDisparo) { Destroy(Disparo.gameObject); }
        foreach (Materia_Entity Materia in filteredMateria) { Materia.Calificacion = Materia.Calificacion + 1; }
        /* EVENT START */
        NewEvent();
        filteredMateria = filteredMateria.Where(e => e.Calificacion < 4);
        filteredMateria = filteredMateria.Where(e => e.Y > 600);
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "REPROBADO!!"; }
        foreach (Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); }
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
        /* EVENT START */
        NewEvent();
        filteredPersonaje = filteredPersonaje.Where(e => e.CollidesWith("Materia_Entity"));
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "REPROBADO!!"; }
        foreach (Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); }
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
        /* EVENT START */
        NewEvent();
        filteredMateria = filteredMateria.Where(e => e.Calificacion >= 4);
        filteredMateria = filteredMateria.Where(e => e.Y > 600);
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = "APROBADO CON " + filteredMateria.First().Calificacion + "!"; }
        foreach (Materia_Entity Materia in filteredMateria) { Destroy(Materia.gameObject); }
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = 3; }
        /* EVENT START */
        NewEvent();
        filteredTextoFeedback = filteredTextoFeedback.Where(e => e.TiempoMostrarse <= 0);
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.GetComponent<UnityEngine.UI.Text>().text = ""; }
        /* EVENT START */
        NewEvent();
        filteredMateria = filteredMateria.Where(e => e.Calificacion > 10);
        foreach (Materia_Entity Materia in filteredMateria) { Materia.Calificacion = 10; }
        /* EVENT START */
        NewEvent();
        filteredGameMaster = filteredGameMaster.Where(e => e.TiempoCreacionMateria >= 10);
        foreach (GameMaster_Entity GameMaster in filteredGameMaster) { GameMaster.TiempoCreacionMateria = 0; }
        foreach (System_Entity System in filteredSystem) { Instantiate(allMateria.First(), new Vector3(0, Random.Range(0, 800), 0), Quaternion.identity); }

    }

    void FixedUpdate()
    {

    }

    /* EVENT INITIALIZATION */
    private void NewEvent()
    {
        allPersonaje = FindObjectsOfType<Personaje_Entity>().ToList<Personaje_Entity>();
        allMateria = FindObjectsOfType<Materia_Entity>().ToList<Materia_Entity>();
        allDisparo = FindObjectsOfType<Disparo_Entity>().ToList<Disparo_Entity>();
        allTextoFeedback = FindObjectsOfType<TextoFeedback_Entity>().ToList<TextoFeedback_Entity>();
        allSystem = FindObjectsOfType<System_Entity>().ToList<System_Entity>();
        filteredPersonaje = allPersonaje;
        filteredDisparo = allDisparo;
        filteredMateria = allMateria;
        filteredTextoFeedback = allTextoFeedback;
        filteredSystem = allSystem;
    }

    /* INVOKE CALLBACKS */
    void InvokeCallback0()
    {
        foreach (TextoFeedback_Entity TextoFeedback in filteredTextoFeedback) { TextoFeedback.TiempoMostrarse = TextoFeedback.TiempoMostrarse - 1; }
        foreach (GameMaster_Entity GameMaster in filteredGameMaster) { GameMaster.TiempoCreacionMateria = GameMaster.TiempoCreacionMateria + Random.Range(0, 11); }
    }

}
