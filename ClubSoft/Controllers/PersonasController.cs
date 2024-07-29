using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;

namespace ClubSoft.Controllers;

public class PersonasController : Controller
{
    private  ApplicationDbContext _context;

    public PersonasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

 public JsonResult ListadoPersonas(int? PersonaID)
    {
        var MostrarPersonas = _context.Personas.ToList();
        if (PersonaID != null) {
            MostrarPersonas = MostrarPersonas.Where(p=> p.PersonaID == PersonaID).ToList();
        }
        return Json(MostrarPersonas);
    }

      public JsonResult GuardarRegistro(
       int PersonaID,
       string? Nombre,
       string? Apellido,
       string? Direccion,
       string? Telefono,
       string? DNI,
       int LocalidadID,
       string? UsuarioID
       
       )
    {
        string resultado = "";
        if (PersonaID == 0)
        {
            var persona = new Persona
            {
                PersonaID = PersonaID,
                Nombre = Nombre,
                Apellido = Apellido,
                Direccion = Direccion,
                Telefono = Telefono,
                DNI = DNI,
                LocalidadID = LocalidadID,
                UsuarioID = UsuarioID
               
            };
            _context.Add(persona);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
          {
              var editarPersona = _context.Personas.Where(p => p.PersonaID == PersonaID).SingleOrDefault();
              if (editarPersona != null)
             {
                  editarPersona.PersonaID = PersonaID;
                  editarPersona.Nombre = Nombre;
                  editarPersona.Apellido = Apellido;
                  editarPersona.Direccion = Direccion;
                  editarPersona.Telefono = Telefono;
                  editarPersona.LocalidadID = LocalidadID;
                  editarPersona.UsuarioID = UsuarioID;
                  _context.SaveChanges();
             }
          }
        return Json(resultado);
    }
    public JsonResult TraerPersona(int? PersonaID)
    {
        var personasConId = _context.Personas.ToList();
        if (personasConId != null)
        {
            personasConId = personasConId.Where(p => p.PersonaID == PersonaID).ToList();
        }

        return Json(personasConId.ToList());
    }

    
     public JsonResult EliminarPersona(int PersonaID)
   {
    var persona = _context.Personas.Find(PersonaID);
    _context.Remove(persona);
    _context.SaveChanges();

    return Json(true);
   }

    }
