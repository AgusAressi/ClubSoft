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
    private ApplicationDbContext _context;

    public PersonasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var localidades = _context.Localidades.ToList();

        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE LA LOCALIDAD...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        var roles = _context.Roles.ToList();
        ViewBag.RolID = new SelectList(roles.OrderBy(t => t.Name), "Name", "Name", "Socio");

        return View();
    }

    public JsonResult ListadoPersonas()
    {
        List<VistaPersonas> MostrarPersonas = new List<VistaPersonas>();
        var listadoPersonas = _context.Personas.ToList();
        var listadoLocalidades = _context.Localidades.ToList();
        var listadoProvincias = _context.Provincias.ToList();
        var listadoUsuarios = _context.Users.ToList();
        var listadoUserRoles = _context.UserRoles.ToList();
        var listadoRoles = _context.Roles.ToList();

        foreach (var personas in listadoPersonas)
        {
            var localidades = listadoLocalidades.FirstOrDefault(t => t.LocalidadID == personas.LocalidadID);
            var provincias = localidades != null ? listadoProvincias.FirstOrDefault(t => t.ProvinciaID == localidades.ProvinciaID) : null;
            var usuarios = listadoUsuarios.FirstOrDefault(t => t.Id == personas.UsuarioID);
            var userRole = listadoUserRoles.FirstOrDefault(ur => ur.UserId == usuarios.Id);
            var rol = userRole != null ? listadoRoles.FirstOrDefault(r => r.Id == userRole.RoleId) : null;

            if (localidades != null && provincias != null && usuarios != null)
            {
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
                    UsuarioID = personas.UsuarioID,
                    Email = usuarios.Email,
                    RolNombre = rol != null ? rol.Name : "Sin Rol"
                };
                MostrarPersonas.Add(personaMostar);
            }
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
        if (!ModelState.IsValid)
        {
            return Json(new { success = false, message = "Error al validar las entradas" });
        }

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                if (PersonaID == 0)
                {
                    var persona = new Persona
                    {
                        Nombre = Nombre.ToUpper(),
                        Apellido = Apellido.ToUpper(),
                        Direccion = Direccion.ToUpper(),
                        Telefono = Telefono,
                        DNI = DNI,
                        LocalidadID = LocalidadID,
                        UsuarioID = UsuarioID
                    };

                    _context.Add(persona);
                    _context.SaveChanges();

                    transaction.Commit();

                    return Json(new { success = true, message = "Registro guardado correctamente" });
                }
                else
                {
                    var editarPersona = _context.Personas.Where(p => p.PersonaID == PersonaID).SingleOrDefault();
                    if (editarPersona != null)
                    {
                        editarPersona.Nombre = Nombre;
                        editarPersona.Apellido = Apellido;
                        editarPersona.Direccion = Direccion;
                        editarPersona.Telefono = Telefono;
                        editarPersona.DNI = DNI;
                        editarPersona.LocalidadID = LocalidadID;
                        editarPersona.UsuarioID = UsuarioID;

                        _context.SaveChanges();

                        transaction.Commit();

                        return Json(new { success = true, message = "Registro actualizado correctamente" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Persona no encontrada" });
                    }
                }
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                return Json(new { success = false, message = "Error al guardar la persona: " + ex.Message });
            }
        }
    }


    public JsonResult EliminarPersona(int PersonaID)
    {
        var persona = _context.Personas.Find(PersonaID);
        _context.Remove(persona);
        _context.SaveChanges();

        return Json(true);
    }

}
