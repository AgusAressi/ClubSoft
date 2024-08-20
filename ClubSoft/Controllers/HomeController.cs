using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Identity;
using ClubSoft.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace ClubSoft.Controllers;


public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public IActionResult Index()
    {
        return View();
    }
    
    
    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }
    
    
    public async Task<IActionResult> Inicio()
    {
        await CrearRolesyPrimerUsuario();
        // Una vez creado el primer usuario comentar
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        string nombreUsuario = "No se encontró el usuario";

        var tieneRolUsuario = await _context.UserRoles.FirstOrDefaultAsync(p => p.UserId == usuarioLogueadoID);
        if (tieneRolUsuario != null)
        {
            //BUSCAMOS EL NOMBRE DEL ROL
            var rolUsuario = await _context.Roles.FirstOrDefaultAsync(p => p.Id == tieneRolUsuario.RoleId);
            if (rolUsuario.Name == "EMPLEADO" || rolUsuario.Name == "ADMINISTRADOR")
            {
                var persona = await _context.Personas.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
                nombreUsuario = persona?.Nombre ?? "Nombre no disponible";
            }
            // else if (rolUsuario.Name == "SOCIO")
            // {
            //     var socio = await _context.Socio.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
            //     nombreUsuario = socio?.dni ?? "DNI no disponible";
            // }
        }

        ViewBag.NombreTitulo = nombreUsuario;

        return View();
    }

    public async Task<JsonResult> CrearRolesyPrimerUsuario()
    {
        //CREAMOS ROL ADMINISTRADOR
        var crearRolAdmin = _context.Roles.Where(c => c.Name == "ADMINISTRADOR").SingleOrDefault();
        if (crearRolAdmin == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("ADMINISTRADOR"));
        }

        //CREAMOS ROL EMPLEADO
        var crearRolEmpl = _context.Roles.Where(c => c.Name == "EMPLEADO").SingleOrDefault();
        if (crearRolEmpl == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("EMPLEADO"));
        }

        //CREAMOS ROL SOCIO
        var crearRolCli = _context.Roles.Where(c => c.Name == "SOCIO").SingleOrDefault();
        if (crearRolCli == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("SOCIO"));
        }

        //CREAMOS USUARIO PRINCIPAL (ADMIN)
        bool creado = false;

        var usuario = _context.Users.Where(u => u.Email == "admin@clubsoft.com").SingleOrDefault();
        if (usuario == null)
        {
            var user = new IdentityUser { UserName = "admin@clubsoft.com", Email = "admin@clubsoft.com" };
            var result = await _userManager.CreateAsync(user, "clubsoft24");

            await _userManager.AddToRoleAsync(user, "ADMINISTRADOR");
            creado = result.Succeeded;
        }

        //CODIGO PARA BUSCAR EL USUARIO EN CASO DE NECESITARLO
        var superusuario = _context.Users.Where(s => s.Email == "admin@clubsoft.com").SingleOrDefault();
        if (superusuario != null)
        {

            //var personaSuperusuario = _contexto.Personas.Where(r => r.UsuarioID == superusuario.Id).Count();

            var usuarioID = superusuario.Id;

        }

        return Json(creado);
    }
    
    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
