using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;

namespace ClubSoft.Controllers;

public class SocioAdherentesController : Controller
{
    private  ApplicationDbContext _context;

    public SocioAdherentesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

}