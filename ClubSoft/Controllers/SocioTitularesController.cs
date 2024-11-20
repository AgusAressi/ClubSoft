using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.SocioTitular;

namespace ClubSoft.Controllers;
[Authorize]
public class SocioTitularesController : Controller
{
    private ApplicationDbContext _context;

    public SocioTitularesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Obtener el RoleId del rol 'SOCIO'
        var socioRoleId = _context.Roles
            .Where(r => r.Name == "SOCIO")
            .Select(r => r.Id)
            .FirstOrDefault();

        // Si no se encuentra el rol 'SOCIO', no continuar
        if (socioRoleId == null)
        {
            throw new Exception("El rol SOCIO no fue encontrado.");
        }

        // Obtener los IDs de usuarios que tienen asignado el rol SOCIO
        var usuariosConRolSocioIds = _context.UserRoles
            .Where(ur => ur.RoleId == socioRoleId)
            .Select(ur => ur.UserId)
            .ToList();

        // Obtener los PersonaID de aquellos usuarios que tienen el rol SOCIO
        var personasConRolSocio = _context.Personas
            .Where(p => usuariosConRolSocioIds.Contains(p.UsuarioID))
            .Select(p => p.PersonaID)
            .ToList();

        // Obtener los PersonaID que ya están en SocioAdherentes
        var personaIdsEnSocioAdherentes = _context.SocioAdherentes
            .Select(sa => sa.PersonaID)
            .ToList();

        // Obtener los PersonaID que ya están en SocioTitulares
        var personaIdsEnSocioTitulares = _context.SocioTitulares
            .Select(st => st.PersonaID)
            .ToList();

        // Filtrar las personas que tienen el rol SOCIO y que NO están en SocioAdherentes ni en SocioTitulares
        var personasNoRegistradas = _context.Personas
            .Where(p => personasConRolSocio.Contains(p.PersonaID) &&
                        !personaIdsEnSocioAdherentes.Contains(p.PersonaID) &&
                        !personaIdsEnSocioTitulares.Contains(p.PersonaID))
            .ToList();

        // Agregar opción [SELECCIONE] al inicio de la lista
        personasNoRegistradas.Add(new Persona
        {
            PersonaID = 0,
            Apellido = "[SELECCIONE]",
            Nombre = ""
        });

        // Proyectar a la lista para el DropDownList
        var listaPersonas = personasNoRegistradas.Select(p => new
        {
            p.PersonaID,
            NombreCompleto = p.Apellido + " " + p.Nombre
        }).OrderBy(p => p.NombreCompleto);

        // Asignar la lista al ViewBag para el DropDownList
        ViewBag.PersonaID = new SelectList(listaPersonas, "PersonaID", "NombreCompleto");


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

        // Validar si la persona ya está registrada como socio titular
        var existeSocioTitular = _context.SocioTitulares
            .Any(st => st.PersonaID == PersonaID && st.SocioTitularID != SocioTitularID);

        // Validar si la persona ya está registrada como socio adherente
        var existeSocioAdherente = _context.SocioAdherentes
            .Any(sa => sa.PersonaID == PersonaID);

        // Verificar si la persona ya está registrada como titular o adherente
        if (existeSocioTitular)
        {
            resultado = "Este socio ya está registrado como socio titular.";
            return Json(new { success = false, mensaje = resultado });
        }
        if (existeSocioAdherente)
        {
            resultado = "Este socio ya está registrado como socio adherente.";
            return Json(new { success = false, mensaje = resultado });
        }

        // Si no está registrado como titular o adherente, continuar con el guardado
        if (SocioTitularID == 0)
        {
            var socioTitular = new SocioTitular
            {
                PersonaID = PersonaID
            };
            _context.Add(socioTitular);
            _context.SaveChanges();

            resultado = "¡Socio Titular guardado correctamente!";
        }

        return Json(new { success = true, mensaje = resultado });
    }


    public JsonResult EliminarSocioTitular(int SocioTitularID)
    {
        var socioTitular = _context.SocioTitulares.Find(SocioTitularID);
        _context.Remove(socioTitular);
        _context.SaveChanges();

        return Json(true);
    }

}