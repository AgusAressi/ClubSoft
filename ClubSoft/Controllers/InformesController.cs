using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using Microsoft.EntityFrameworkCore;

namespace ClubSoft.Controllers;
[Authorize (Roles = "ADMINISTRADOR")]

public class InformesController : Controller
{
    private  ApplicationDbContext _context;

    public InformesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


}