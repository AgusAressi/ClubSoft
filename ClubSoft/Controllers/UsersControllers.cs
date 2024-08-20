using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using ClubSoft.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using static ClubSoft.Models.Persona;


namespace ClubSoft.Controllers;
[Authorize]
public class UsersController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public UsersController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }
    public IActionResult Users()
    {
        var roles = _context.Roles.ToList();
        ViewBag.RolID = new SelectList(roles.OrderBy(t => t.Name), "Name", "Name");

        return View();
    }
    public JsonResult ListadoUsuarios(string UsuarioID)
    {
        var listadoUsuarios = _context.Users.ToList();
        if (UsuarioID != null)
        {
            listadoUsuarios = _context.Users.Where(l => l.Id == UsuarioID).ToList();
        }

        List<VistaUsuarios> usuariosMostrar = new List<VistaUsuarios>();
        foreach (var usuario in listadoUsuarios)
        {
            var rolNombre = "";
            //POR CADA USUARIO VAMOS A BUSCAR SI TIENE ROL ASIGNADO
            var rolUsuario = _context.UserRoles.Where(l => l.UserId == usuario.Id).FirstOrDefault();
            if (rolUsuario != null)
            {
                rolNombre = _context.Roles.Where(l => l.Id == rolUsuario.RoleId).Select(r => r.Name).FirstOrDefault();
            }
            var usuarioMostrar = new VistaUsuarios
            {
                UsuarioID = usuario.Id,
                Email = usuario.Email,
                RolNombre = rolNombre,
            };
            usuariosMostrar.Add(usuarioMostrar);
        }

        return Json(usuariosMostrar);
    }
    public async Task<JsonResult> GuardarUsuario(string Username, string Email, string Password, string rol)
    {
        var user = new IdentityUser { UserName = Username, Email = Email };
        var result = await _userManager.CreateAsync(user, Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, rol);
            // Retorna el UsuarioID (que es el mismo que el ID del usuario recién creado)
            return Json(new { Success = true, UsuarioID = user.Id });
        }

        return Json(new { Success = false });
    }
    
    public JsonResult EditarUsuario(string UsuarioID)
    {
        var usuarioporID = _context.Users.ToList();
        if (UsuarioID != null)
        {
            usuarioporID = usuarioporID.Where(e => e.Id == UsuarioID).ToList();
        }

        return Json(usuarioporID.ToList());

    }

    public JsonResult EliminarUsuario(string UsuarioID)
    {

            var eliminarUsuario = _context.Users.Find(UsuarioID);
            _context.Remove(eliminarUsuario);
            _context.SaveChanges();

        return Json(true);
    }

}