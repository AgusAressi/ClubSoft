using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;
using ClubSoft.Models;

namespace ClubSoft.Controllers;

public class CobrosController : Controller
{
    private ApplicationDbContext _context;

    public CobrosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }
     }