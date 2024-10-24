using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;
using ClubSoft.Models;

namespace ClubSoft.Controllers;

public class TipoEventosController : Controller
{
    private ApplicationDbContext _context;

    public TipoEventosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoTipoEventos(int? id)
    {
        var traerTodasLosTiposEventos = _context.TipoEventos.ToList();
        if (id != null)
        {
            traerTodasLosTiposEventos = traerTodasLosTiposEventos.Where(t => t.TipoEventoID == id).ToList();
        }
        return Json(traerTodasLosTiposEventos);
    }
public JsonResult GuardarTipoEvento(int TipoEventoID, string Nombre)
{
    string resultado = "";
    Nombre = Nombre.ToUpper();

    // Verificar si el tipo de evento ya existe
    if (_context.TipoEventos.Any(te => te.Nombre == Nombre && te.TipoEventoID != TipoEventoID))
    {
        return Json(new { success = false, message = "Ya existe un tipo de evento con este nombre." });
    }

    if (TipoEventoID == 0)
    {
        var tipoevento = new TipoEvento
        {
            Nombre = Nombre
        };
        _context.Add(tipoevento);
        _context.SaveChanges();

        resultado = "¡Tipo de evento guardado correctamente!";
    }
    else
    {
        var editarTipoEvento = _context.TipoEventos.Where(e => e.TipoEventoID == TipoEventoID).SingleOrDefault();
        if (editarTipoEvento != null)
        {
            editarTipoEvento.Nombre = Nombre;
            _context.SaveChanges();
        }
    }
    return Json(new { success = true, message = resultado });
}


    public JsonResult TraerTipoEvento(int? TipoEventoID)
    {
        var tipoEventoPorID = _context.TipoEventos.ToList();
        if (TipoEventoID != null)
        {
            tipoEventoPorID = tipoEventoPorID.Where(e => e.TipoEventoID == TipoEventoID).ToList();
        }

        return Json(tipoEventoPorID.ToList());
    }

    public JsonResult EliminarTipoEvento(int TipoEventoID)
    {
        var tipoEvento = _context.TipoEventos.Find(TipoEventoID);
        _context.Remove(tipoEvento);
        _context.SaveChanges();

        return Json(true);
    }


    public JsonResult ListadoLugaresEventos(int? id)
    {
        var traerLugaresEventos = _context.Lugares.ToList();
        if (id != null)
        {
            traerLugaresEventos = traerLugaresEventos.Where(l => l.LugarID == id).ToList();
        }
        return Json(traerLugaresEventos);
    }


public JsonResult GuardarLugarEvento(int LugarID, string Nombre)
{
    string resultado = "";
    Nombre = Nombre.ToUpper();

    // Verificar si el lugar ya existe
    if (_context.Lugares.Any(l => l.Nombre == Nombre && l.LugarID != LugarID))
    {
        return Json(new { success = false, message = "El lugar ya existe." });
    }

    if (LugarID == 0)
    {
        var lugarevento = new Lugar
        {
            Nombre = Nombre
        };
        _context.Add(lugarevento);
        _context.SaveChanges();

        resultado = "EL REGISTRO SE GUARDÓ CORRECTAMENTE";
    }
    else
    {
        var editarLugarEvento = _context.Lugares.Where(l => l.LugarID == LugarID).SingleOrDefault();
        if (editarLugarEvento != null)
        {
            editarLugarEvento.Nombre = Nombre; // Solo actualiza el nombre
            _context.SaveChanges();
            resultado = "EL REGISTRO SE ACTUALIZÓ CORRECTAMENTE";
        }
    }
    return Json(new { success = true, message = resultado });
}



    public JsonResult TraerLugarEvento(int? LugarID)
    {
        var tipoLugarPorID = _context.Lugares.ToList();
        if (LugarID != null)
        {
            tipoLugarPorID = tipoLugarPorID.Where(l => l.LugarID == LugarID).ToList();
        }

        return Json(tipoLugarPorID.ToList());
    }


    public JsonResult EliminarLugarEvento(int LugarID)
    {
        var lugarEvento = _context.Lugares.Find(LugarID);
        _context.Remove(lugarEvento);
        _context.SaveChanges();

        return Json(true);
    }

}