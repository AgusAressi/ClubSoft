using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.SocioTitular;

namespace ClubSoft.Controllers;

public class SocioTitularesController : Controller
{
    private ApplicationDbContext _context;

    public SocioTitularesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var personas = _context.Personas.ToList();

        personas.Add(new Persona { PersonaID = 0, Apellido = "[SELECCIONE]", Nombre = "" });
        var listaPersonas = personas.Select(p => new
        {
            p.PersonaID,
            NombreCompleto = p.Apellido + " " + p.Nombre
        });
        ViewBag.PersonaID = new SelectList(listaPersonas.OrderBy(c => c.NombreCompleto), "PersonaID", "NombreCompleto");

        return View();
    }

    public JsonResult ListadoSociosTitulares()
    {
        List<VistaSociosTitulares> MostrarSociosTitulares = new List<VistaSociosTitulares>();
        var listadoPersonas = _context.Personas.OrderBy(n => n.Nombre).ToList();
        var listadoSociosTitulares = _context.SocioTitulares.ToList();

        foreach (var socioTitular in listadoSociosTitulares)
        {
            var personas = listadoPersonas.FirstOrDefault(t => t.PersonaID == socioTitular.PersonaID);


            if (personas != null)
            {
                var socioTitularMostar = new VistaSociosTitulares
                {
                    SocioTitularID = socioTitular.SocioTitularID,
                    PersonaID = socioTitular.PersonaID,
                    PersonaNombre = personas.Nombre,
                    PersonaApellido = personas.Apellido
                };
                MostrarSociosTitulares.Add(socioTitularMostar);
            }
        }

        return Json(MostrarSociosTitulares);
    }

    public JsonResult GuardarSocioTitular(
       int SocioTitularID,
       int PersonaID
       )
    {
        string resultado = "";
        if (SocioTitularID == 0)
        {
            var socioTitular = new SocioTitular
            {
                PersonaID = PersonaID
            };
            _context.Add(socioTitular);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
        return Json(resultado);
    }

    public JsonResult EliminarSocioTitular(int SocioTitularID)
    {
        var socioTitular = _context.SocioTitulares.Find(SocioTitularID);
        _context.Remove(socioTitular);
        _context.SaveChanges();

        return Json(true);
    }

}