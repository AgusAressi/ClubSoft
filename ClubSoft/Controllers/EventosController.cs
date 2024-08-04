using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Evento;

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

        var tipoEventos = _context.TipoEventos.ToList();

        tipoEventos.Add(new TipoEvento{TipoEventoID = 0, Nombre = "[SELECCIONE EL TIPO DE EVENTO]"});
        ViewBag.TipoEventoID = new SelectList(tipoEventos.OrderBy(c => c.Nombre), "TipoEventoID", "Nombre");

        return View();

    }

    public JsonResult ListadoEventos()
    {
        List<VistaTipoEventos> EventosMostar = new List<VistaTipoEventos>();
        var listadoEventos = _context.Eventos.ToList();
        var listadoTipoEventos = _context.TipoEventos.ToList();

         foreach (var evento in listadoEventos)
        {
            var tipoEvento = listadoTipoEventos.Where(t => t.TipoEventoID == evento.TipoEventoID).Single();
            
            var eventoMostar = new VistaTipoEventos
            {
                EventoID = evento.EventoID,
                Descripcion = evento.Descripcion, 
                FechaEvento = evento.FechaEvento,
                Lugar = evento.Lugar,
                TipoEventoID = evento.TipoEventoID,
                NombreTipoEvento = tipoEvento.Nombre
              
            };
            EventosMostar.Add(eventoMostar);
        }
        return Json(EventosMostar);
    }

    public JsonResult GuardarEvento(
       int EventoID,
       string Descripcion,
       DateTime FechaEvento,
       string Lugar,
       int TipoEventoID
       )
    {
        string resultado = "";
        if (EventoID == 0)
        {
            var evento = new Evento
            {
                EventoID = EventoID,
                Descripcion = Descripcion,
                FechaEvento = FechaEvento,
                Lugar = Lugar,
                TipoEventoID = TipoEventoID
            };
            _context.Add(evento);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
         {
             var editarEvento = _context.Eventos.Where(e => e.EventoID == EventoID).SingleOrDefault();
             if (editarEvento != null)
             {
                 editarEvento.EventoID = EventoID;
                 editarEvento.Descripcion = Descripcion;
                 editarEvento.FechaEvento = FechaEvento;
                 editarEvento.Lugar = Lugar;
                 editarEvento.TipoEventoID = TipoEventoID;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
    }

     public JsonResult TraerEvento(int? EventoID)
    {
        var eventoporID = _context.Eventos.ToList();
        if (EventoID != null)
        {
            eventoporID = eventoporID.Where(e => e.EventoID == EventoID).ToList();
        }

        return Json(eventoporID.ToList());
    }

     public JsonResult EliminarEvento(int EventoID)
   {
    var evento = _context.Eventos.Find(EventoID);
    _context.Remove(evento);
    _context.SaveChanges();

    return Json(true);
   }
}




