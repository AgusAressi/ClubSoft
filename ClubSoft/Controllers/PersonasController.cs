using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Persona;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ClubSoft.Controllers;

public class PersonasController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public PersonasController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }

    public IActionResult Index()
    {
        var localidades = _context.Localidades.ToList();

        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        var roles = _context.Roles.ToList();
        roles.Insert(0, new IdentityRole { Id = "0", Name = "[SELECCIONE]" });
        ViewBag.RolID = new SelectList(roles.OrderBy(t => t.Name), "Id", "Name");

        var sociosTitulares = _context.SocioTitulares
        .Include(st => st.Persona)
        .ToList();

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

    public JsonResult ListadoPersonas()
    {
        List<VistaPersonas> MostrarPersonas = new List<VistaPersonas>();
        var listadoPersonas = _context.Personas.OrderBy(n => n.Nombre).ToList();
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

    public async Task<JsonResult> GuardarRegistro(
        int PersonaID,
        string? Nombre,
        string? Apellido,
        string? Direccion,
        string? Telefono,
        string? DNI,
        int LocalidadID,
        string? UsuarioID,
        string? UserName,
        string? Email,
        string? Password,
        string? rol,
        int TipoSocio,
        int SocioTitularID,
        int? SocioAdherenteID
    )
    {
        string resultado = "";

        rol = "SOCIO";

        //SI EL USUARIO ID ES VACIO, QUIERE DECIR QUE VAMOS A CREAR UN USUARIO NUEVO Y DEMAS REGISTROS
        if (UsuarioID == "0")
        {           
            //INICIALIAMOS EL OBJETO USUARIO
            var user = new IdentityUser { UserName = UserName, Email = Email };
            //EJECUTAMOS EL METODO PARA CREARLO DE FORMA ASINCRONA
            var result = await _userManager.CreateAsync(user, Password);
            if (result.Succeeded)
            {
                //SI EL REGISTRO FUE CORRECTO
                //DEBE ASIGNARLE EL ROL CORRESPONDIENTE
                await _userManager.AddToRoleAsync(user, rol);

                //LUEGO DEBEMOS CREAR LA PERSONA GUARDANDO EL USUARIO ID REGISTRADO
                var persona = new Persona
                {
                    Nombre = Nombre,
                    Apellido = Apellido,
                    Direccion = Direccion,
                    Telefono = Telefono,
                    DNI = DNI,
                    LocalidadID = LocalidadID,
                    UsuarioID = user.Id
                };
                _context.Personas.Add(persona);
                _context.SaveChanges();

                //LUEGO VERIFICAR SI EL ROL ES SOCIO
                if (rol == "SOCIO")
                {
                    // Verifica si es SocioTitular o SocioAdherente y guarda en la tabla correspondiente
                    if (TipoSocio == 1)
                    {
                        SocioTitular socioTitular = new SocioTitular
                        {
                            PersonaID = persona.PersonaID
                        };
                        _context.SocioTitulares.Add(socioTitular);
                        _context.SaveChanges();
                        resultado = "Socio Titular creado exitosamente";
                    }
                    else if (TipoSocio == 2)
                    {
                        SocioAdherente socioAdherente = new SocioAdherente
                        {
                            PersonaID = persona.PersonaID,
                            SocioTitularID = SocioTitularID
                        };
                        _context.SocioAdherentes.Add(socioAdherente);
                        _context.SaveChanges();
                        resultado = "Socio Adherente creado exitosamente";
                    }
                  
                }
            }
            else
            {
                //SI NO REGISTRA, DEVUELVE EL ERROR Y NO HACE MAS NADA
                return Json(new { Success = false, message = "Error al crear el usuario" });
            }
        }    

        return Json(new { success = true, message = resultado });
    }


    public JsonResult TraerPersona(int? PersonaID)
    {
        var personaporID = _context.Personas.ToList();
        if (PersonaID != null)
        {
            personaporID = personaporID.Where(e => e.PersonaID == PersonaID).ToList();
        }

        return Json(personaporID.ToList());
    }

    public JsonResult EliminarPersona(int PersonaID)
    {
        var persona = _context.Personas.Find(PersonaID);
        _context.Remove(persona);
        _context.SaveChanges();

        return Json(true);
    }

}
