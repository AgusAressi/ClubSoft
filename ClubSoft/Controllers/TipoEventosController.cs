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
        if (id != null) {
            traerTodasLosTiposEventos = traerTodasLosTiposEventos.Where(t => t.TipoEventoID == id).ToList();
        }
        return Json(traerTodasLosTiposEventos);
    }

    public JsonResult GuardarTipoEvento(
       int TipoEventoID,
       string Nombre
       )
    {
        string resultado = "";
        Nombre = Nombre.ToUpper();

        if (TipoEventoID == 0)
        {
            var tipoevento = new TipoEvento
            {
                TipoEventoID = TipoEventoID,
                Nombre = Nombre
            };
            _context.Add(tipoevento);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
         {
             var editarTipoEvento = _context.TipoEventos.Where(e => e.TipoEventoID == TipoEventoID).SingleOrDefault();
             if (editarTipoEvento != null)
             {
                 editarTipoEvento.TipoEventoID = TipoEventoID;
                 editarTipoEvento.Nombre = Nombre;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
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
        if (id != null) {
            traerLugaresEventos = traerLugaresEventos.Where(l => l.LugarID == id).ToList();
        }
        return Json(traerLugaresEventos);
    }


    public JsonResult GuardarLugarEvento(
       int LugarID,
       string Nombre
       )
    {
        string resultado = "";
        Nombre = Nombre.ToUpper();

        if (LugarID == 0)
        {
            var lugarevento = new Lugar
            {
                LugarID = LugarID,
                Nombre = Nombre
            };
            _context.Add(lugarevento);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
         {
             var editarLugarEvento = _context.Lugares.Where(l => l.LugarID == LugarID).SingleOrDefault();
             if (editarLugarEvento != null)
             {
                 editarLugarEvento.LugarID = LugarID;
                 editarLugarEvento.Nombre = Nombre;
                 _context.SaveChanges();
             }
          }
        return Json(resultado);
    }

    
     public JsonResult TraerLugarEvento(int? LugarID)
    {
        var tipoLugarPorID = _context.Lugares.ToList();
        if (LugarID != null)
        {
            tipoLugarPorID = tipoLugarPorID.Where(l=> l.LugarID == LugarID).ToList();
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