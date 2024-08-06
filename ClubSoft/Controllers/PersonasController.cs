using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Persona;

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
        var localidades = _context.Localidades.ToList();

        localidades.Add(new Localidad{LocalidadID = 0, Nombre = "[SELECCIONE LA LOCALIDAD...]"});
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        return View();
    }

 public JsonResult ListadoPersonas()
    {
        List<VistaPersonas> MostrarPersonas = new List<VistaPersonas>();
        var listadoPersonas = _context.Personas.ToList();
        var listadoLocalidades = _context.Localidades.ToList();
        var listadoProvincias = _context.Provincias.ToList();

         foreach (var personas in listadoPersonas)
        {
            var localidades = listadoLocalidades.Where(t => t.LocalidadID == personas.LocalidadID).Single();
            var provincias = listadoProvincias.Where(t => t.ProvinciaID == localidades.ProvinciaID).Single();
            
            var personaMostar = new VistaPersonas
            {
                PersonaID = personas.PersonaID,
                Nombre = personas.Nombre,
                Apellido = personas.Apellido,
                Direccion = personas.Direccion,
                Telefono = personas.Telefono,
                DNI = personas.DNI,
                LocalidadID = personas.LocalidadID,
                NombreLocalidad = localidades.Nombre,
                NombreProvincia = provincias.Nombre,
                UsuarioID = personas.UsuarioID
            };
            MostrarPersonas.Add(personaMostar);
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
