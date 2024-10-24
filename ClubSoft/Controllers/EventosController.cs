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

        tipoEventos.Add(new TipoEvento { TipoEventoID = 0, Nombre = "[SELECCIONE EL TIPO DE EVENTO...]" });
        ViewBag.TipoEventoID = new SelectList(tipoEventos.OrderBy(c => c.Nombre), "TipoEventoID", "Nombre");

        var lugares = _context.Lugares.ToList();

        lugares.Add(new Lugar { LugarID = 0, Nombre = "[SELECCIONE UN LUGAR...]" });
        ViewBag.LugarID = new SelectList(lugares.OrderBy(c => c.Nombre), "LugarID", "Nombre");

        return View();

    }
    
    public IActionResult InformeEventos()
    {
          return View();

    }

    public JsonResult ListadoEventos()
    {
        List<VistaTipoEventos> EventosMostar = new List<VistaTipoEventos>();
        var listadoEventos = _context.Eventos.ToList();
        var listadoTipoEventos = _context.TipoEventos.ToList();
        var listadoLugares = _context.Lugares.ToList();

        foreach (var evento in listadoEventos)
        {
            var tipoEvento = listadoTipoEventos.Where(t => t.TipoEventoID == evento.TipoEventoID).Single();
            var lugar = listadoLugares.Where(t => t.LugarID == evento.LugarID).Single();

            var eventoMostar = new VistaTipoEventos
            {
                EventoID = evento.EventoID,
                Descripcion = evento.Descripcion,
                FechaEvento = evento.FechaEvento.ToString("dd/MM/yyyy"),
                HoraEvento = evento.FechaEvento.ToString("HH:mm"),
                LugarID = evento.LugarID,
                TipoEventoID = evento.TipoEventoID,
                NombreTipoEvento = tipoEvento.Nombre,
                NombreLugar = lugar.Nombre

            };
            EventosMostar.Add(eventoMostar);
        }
        return Json(EventosMostar);
    }
public JsonResult GuardarEvento(
    int EventoID,
    string Descripcion,
    DateTime FechaEvento,
    int LugarID,
    int TipoEventoID
)
{
    string resultado = "";
    Descripcion = Descripcion.ToUpper();

    // Verificar si ya existe un evento con la misma descripción
    var eventoExistente = _context.Eventos
        .Any(e => e.Descripcion == Descripcion && e.EventoID != EventoID);

    if (eventoExistente)
    {
        return Json(new { success = false, message = "Ya existe un evento con ese nombre." });
    }

    if (EventoID == 0)
    {
        var evento = new Evento
        {
            Descripcion = Descripcion,
            FechaEvento = FechaEvento,
            LugarID = LugarID,
            TipoEventoID = TipoEventoID
        };
        _context.Add(evento);
        _context.SaveChanges();
        resultado = "¡Evento guardado correctamente!";
    }
    else
    {
        var editarEvento = _context.Eventos.Where(e => e.EventoID == EventoID).SingleOrDefault();
        if (editarEvento != null)
        {
            editarEvento.Descripcion = Descripcion;
            editarEvento.FechaEvento = FechaEvento;
            editarEvento.LugarID = LugarID;
            editarEvento.TipoEventoID = TipoEventoID;
            _context.SaveChanges();
        }
    }
    
    return Json(new { success = true, message = resultado });
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

        public JsonResult InformePorEventos()
    {
        List<VistaTipoEventos> EventosMostar = new List<VistaTipoEventos>();
        var listadoEventos = _context.Eventos.ToList();
        var listadoTipoEventos = _context.TipoEventos.ToList();
        var listadoLugares = _context.Lugares.ToList();

        foreach (var evento in listadoEventos)
        {
            var tipoEvento = listadoTipoEventos.Where(t => t.TipoEventoID == evento.TipoEventoID).Single();
            var lugar = listadoLugares.Where(t => t.LugarID == evento.LugarID).Single();

            var eventoMostar = new VistaTipoEventos
            {
                EventoID = evento.EventoID,
                Descripcion = evento.Descripcion,
                LugarID = evento.LugarID,
                TipoEventoID = evento.TipoEventoID,
                NombreTipoEvento = tipoEvento.Nombre,
                NombreLugar = lugar.Nombre

            };
            EventosMostar.Add(eventoMostar);
        }
        return Json(EventosMostar);
    }
}





