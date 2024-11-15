using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.CuentaCorriente;
using System.Linq;

namespace ClubSoft.Controllers
{
    public class CuentaCorrientesController : Controller
    {
        private ApplicationDbContext _context;

        public CuentaCorrientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Obtener las personas que tienen al menos una cuenta corriente asociada
            var personasConCuentaCorriente = _context.CuentaCorrientes
                .Select(cc => cc.PersonaID) // Seleccionamos los IDs de las personas con cuentas corrientes
                .Distinct()                 // Eliminamos duplicados
                .ToList();                  // Convertimos a una lista

            // Filtrar las personas según los IDs obtenidos
            var personas = _context.Personas
                .Where(p => personasConCuentaCorriente.Contains(p.PersonaID))
                .ToList();

            personas.Add(new Persona { PersonaID = 0, Apellido = "[SELECCIONE LA PERSONA PARA VER SU CUENTA CORRIENTE]", Nombre = "" });

            // Crear la lista
            var listaPersonas = personas.Select(p => new
            {
                p.PersonaID,
                NombreCompleto = p.Apellido + " " + p.Nombre
            });

            ViewBag.PersonaID = new SelectList(listaPersonas.OrderBy(c => c.NombreCompleto), "PersonaID", "NombreCompleto");

            return View();
        }


        public JsonResult ListadoCuentaCorrientes(int PersonaID)
        {
            List<VistaCuentaCorrientes> MostrarCuentaCorrientes = new List<VistaCuentaCorrientes>();

            // Filtrar solo las cuentas corrientes que correspondan a la PersonaID pasada como parámetro
            var listadoCuentaCorrientes = _context.CuentaCorrientes
                .Where(cc => cc.PersonaID == PersonaID)
                .OrderByDescending(o => o.Fecha)
                .ThenBy(o => o.CuentaCorrienteID)
                .ToList();

            // Obtener solo las personas necesarias para evitar cargar datos innecesarios
            var persona = _context.Personas
                .FirstOrDefault(p => p.PersonaID == PersonaID);

            // Verificar si la persona existe
            if (persona != null)
            {
                foreach (var cuentaCorrientes in listadoCuentaCorrientes)
                {
                    var cuentaCorrientesMostrar = new VistaCuentaCorrientes
                    {
                        CuentaCorrienteID = cuentaCorrientes.CuentaCorrienteID,
                        PersonaID = cuentaCorrientes.PersonaID,
                        Saldo = cuentaCorrientes.Saldo,
                        Ingreso = cuentaCorrientes.Ingreso,
                        Egreso = cuentaCorrientes.Egreso,
                        Descripcion = cuentaCorrientes.Descripcion,
                        Fecha = cuentaCorrientes.Fecha.ToString("dd/MM/yyyy HH:mm"),
                        NombrePersona = persona.Nombre,
                        ApellidoPersona = persona.Apellido
                    };
                    MostrarCuentaCorrientes.Add(cuentaCorrientesMostrar);
                }
            }

            return Json(MostrarCuentaCorrientes);
        }

    }
}
