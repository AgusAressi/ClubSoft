using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;

namespace ClubSoft.Controllers;

public class EventosController : Controller
{
    private ApplicationDbContext _context;

    public EventosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();

    }
     }