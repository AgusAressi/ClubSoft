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
        // Obtener el RoleId del rol 'SOCIO'
        var socioRoleId = _context.Roles
            .Where(r => r.Name == "SOCIO")
            .Select(r => r.Id)
            .FirstOrDefault();

        // Si no se encuentra el rol 'SOCIO', no continuar
        if (socioRoleId == null)
        {
            // Manejar error en caso de que el rol no exista (opcional)
            // Podrías devolver un mensaje de error o manejar este caso según tu lógica
            throw new Exception("El rol SOCIO no fue encontrado.");
        }

        // Obtener los IDs de usuarios que tienen asignado el rol SOCIO
        var usuariosConRolSocioIds = _context.UserRoles
            .Where(ur => ur.RoleId == socioRoleId)
            .Select(ur => ur.UserId)
            .ToList();

        // Obtener los PersonaID de aquellos usuarios que tienen rol SOCIO
        var personasConRolSocio = _context.Personas
            .Where(p => usuariosConRolSocioIds.Contains(p.UsuarioID))
            .ToList();

        // Obtener los PersonaID que ya están en SocioTitulares
        var personaIdsEnSocioTitulares = _context.SocioTitulares
            .Select(st => st.PersonaID)
            .ToList();

        // Filtrar las personas que tienen el rol SOCIO y que NO están en SocioTitulares
        var personasNoSociosTitulares = personasConRolSocio
            .Where(p => !personaIdsEnSocioTitulares.Contains(p.PersonaID))
            .ToList();

        // Agregar opción [SELECCIONE] al inicio de la lista
        personasNoSociosTitulares.Add(new Persona
        {
            PersonaID = 0,
            Apellido = "[SELECCIONE]",
            Nombre = ""
        });

        // Proyectar a la lista para el DropDownList
        var listaPersonas = personasNoSociosTitulares.Select(p => new
        {
            p.PersonaID,
            NombreCompleto = p.Apellido + " " + p.Nombre
        }).OrderBy(p => p.NombreCompleto);

        // Asignar la lista al ViewBag para el DropDownList
        ViewBag.PersonaID = new SelectList(listaPersonas, "PersonaID", "NombreCompleto");


        var sociosTitulares = _context.SocioTitulares.ToList();

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

    // Validar si ya existe la persona registrada como socio adherente con cualquier socio titular
    var existeSocioAdherente = _context.SocioAdherentes
        .Any(sa => sa.PersonaID == PersonaID && sa.SocioAdherenteID != SocioAdherenteID);

    if (existeSocioAdherente)
    {
        resultado = "EL SOCIO QUE QUIERES INGRESAR YA ESTA REGISTRADO COMO SOCIO ADHERENTE";
        return Json(new { success = false, mensaje = resultado });
    }

    if (SocioAdherenteID == 0)
    {
        var socioAdherente = new SocioAdherente
        {
            SocioTitularID = SocioTitularID,
            PersonaID = PersonaID
        };
        _context.Add(socioAdherente);
        _context.SaveChanges();

        resultado = "EL REGISTRO SE GUARDÓ CORRECTAMENTE";
    }
    else
    {
        var editarSocioAdherente = _context.SocioAdherentes
            .Where(e => e.SocioAdherenteID == SocioAdherenteID)
            .SingleOrDefault();

        if (editarSocioAdherente != null)
        {
            editarSocioAdherente.SocioTitularID = SocioTitularID;
            editarSocioAdherente.PersonaID = PersonaID;
            _context.SaveChanges();

            resultado = "EL REGISTRO SE ACTUALIZÓ CORRECTAMENTE";
        }
    }

    return Json(new { success = true, mensaje = resultado });
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