using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using Microsoft.EntityFrameworkCore;
using static ClubSoft.Models.SocioAdherente;

namespace ClubSoft.Controllers;

public class SocioAdherentesController : Controller
{
    private ApplicationDbContext _context;

    public SocioAdherentesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var personas = _context.Personas.ToList();

        personas.Add(new Persona 
        { 
            PersonaID = 0, 
            Apellido = "[SELECCIONE]", 
            Nombre = "" 
        });

        var listaPersonas = personas.Select(p => new
        {
            p.PersonaID,
            NombreCompleto = p.Apellido + " " + p.Nombre
        });

        ViewBag.PersonaID = new SelectList(listaPersonas.OrderBy(c => c.NombreCompleto), "PersonaID", "NombreCompleto");

        var sociosTitulares = _context.SocioTitulares
        .Include(st => st.Persona)
        .ToList();

        // Crear una instancia de Persona y asignar el valor de selección
        sociosTitulares.Add(new SocioTitular 
        {
            SocioTitularID = 0, 
            PersonaID = 0, 
            Persona = new Persona { Nombre = "[SELECCIONE]", Apellido = "" }
        });

        var listaTitulares = sociosTitulares.Select(st => new 
        {
            st.SocioTitularID,
            NombreCompleto = st.Persona.Apellido + " " + st.Persona.Nombre
        }).OrderBy(st => st.NombreCompleto);

        ViewBag.SocioTitularID = new SelectList(listaTitulares, "SocioTitularID", "NombreCompleto");


        return View();
    }
    public IActionResult InformeSocios()
    {
          return View();
    }

   public JsonResult ListadoSociosAdherentes()
    {
        List<VistaSociosAdherentes> MostrarSociosAdherentes = new List<VistaSociosAdherentes>();
        var listadoPersonas = _context.Personas.OrderBy(n => n.Nombre).ToList();
        var listadoSociosTitulares = _context.SocioTitulares.ToList();
        var listadoSociosAdherentes = _context.SocioAdherentes.ToList();

        foreach (var socioAdherente in listadoSociosAdherentes)
        {
            var sociosTitulares = listadoSociosTitulares.FirstOrDefault(t => t.SocioTitularID == socioAdherente.SocioTitularID);
            var personasTitulares = sociosTitulares != null ? listadoPersonas.FirstOrDefault(t => t.PersonaID == sociosTitulares.PersonaID) : null;
            var personasAdherentes = listadoPersonas.FirstOrDefault(t => t.PersonaID == socioAdherente.PersonaID);

            if (personasTitulares != null)
            {
                var socioAdherenteMostar = new VistaSociosAdherentes
                {
                    SocioAdherenteID = socioAdherente.SocioAdherenteID,
                    PersonaNombre = personasAdherentes.Nombre,
                    PersonaApellido = personasAdherentes.Apellido,
                    SocioTitularNombre = sociosTitulares != null ? sociosTitulares.Persona.Apellido + " " + sociosTitulares.Persona.Nombre : "",
                };
                MostrarSociosAdherentes.Add(socioAdherenteMostar);
            }
        }

        return Json(MostrarSociosAdherentes);
    }

    public JsonResult GuardarSocioAdherente(
       int SocioAdherenteID,
       int SocioTitularID,
       int PersonaID
       )
    {
        string resultado = "";
        if (SocioAdherenteID == 0)
        {
            var socioAdherente = new SocioAdherente
            {
                SocioTitularID = SocioTitularID,
                PersonaID = PersonaID
            };
            _context.Add(socioAdherente);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }else
         {
             var editarSocioAdherente = _context.SocioAdherentes.Where(e => e.SocioAdherenteID == SocioAdherenteID).SingleOrDefault();
             if (editarSocioAdherente != null)
             {
                 editarSocioAdherente.SocioTitularID = SocioTitularID;
                 editarSocioAdherente.PersonaID = PersonaID;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
    }

    public JsonResult TraerSocioAdherente(int? SocioAdherenteID)
    {
        var socioAdherenteporID = _context.SocioAdherentes.ToList();
        if (SocioAdherenteID != null)
        {
            socioAdherenteporID = socioAdherenteporID.Where(e => e.SocioAdherenteID == SocioAdherenteID).ToList();
        }

        return Json(socioAdherenteporID.ToList());
    }

    public JsonResult EliminarSocioAdherente(int SocioAdherenteID)
    {
        var socioAdherente = _context.SocioAdherentes.Find(SocioAdherenteID);
        _context.Remove(socioAdherente);
        _context.SaveChanges();

        return Json(true);
    }

     public JsonResult InformePorSocios()
    {
        List<VistaSociosAdherentes> MostrarSociosAdherentes = new List<VistaSociosAdherentes>();
        var listadoPersonas = _context.Personas.OrderBy(n => n.Nombre).ToList();
        var listadoSociosTitulares = _context.SocioTitulares.ToList();
        var listadoSociosAdherentes = _context.SocioAdherentes.ToList();

        foreach (var socioAdherente in listadoSociosAdherentes)
        {
            var sociosTitulares = listadoSociosTitulares.FirstOrDefault(t => t.SocioTitularID == socioAdherente.SocioTitularID);
            var personasTitulares = sociosTitulares != null ? listadoPersonas.FirstOrDefault(t => t.PersonaID == sociosTitulares.PersonaID) : null;
            var personasAdherentes = listadoPersonas.FirstOrDefault(t => t.PersonaID == socioAdherente.PersonaID);

            if (personasTitulares != null)
            {
                var socioAdherenteMostar = new VistaSociosAdherentes
                {
                    SocioAdherenteID = socioAdherente.SocioAdherenteID,
                    PersonaNombre = personasAdherentes.Nombre,
                    PersonaApellido = personasAdherentes.Apellido,
                    SocioTitularNombre = sociosTitulares != null ? sociosTitulares.Persona.Apellido + " " + sociosTitulares.Persona.Nombre : "",
                };
                MostrarSociosAdherentes.Add(socioAdherenteMostar);
            }
        }

        return Json(MostrarSociosAdherentes);
    }
}