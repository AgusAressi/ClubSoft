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
            return View();
        }


        public JsonResult ListadoCuentaCorrientes()
        {
            List<VistaCuentaCorrientes> MostrarCuentaCorrientes = new List<VistaCuentaCorrientes>();
            var listadoCuentaCorrientes = _context.CuentaCorrientes.OrderByDescending(o => o.Fecha).ThenBy(o => o.CuentaCorrienteID).ToList();
            var listadoPersonas = _context.Personas.ToList();

            foreach (var cuentaCorrientes in listadoCuentaCorrientes)
            {
                var cuentaCorriente = listadoCuentaCorrientes
                .Where(cc => cc.CuentaCorrienteID == cuentaCorrientes.CuentaCorrienteID)
                .Single();
                var persona = listadoPersonas
                .Where(p => p.PersonaID == cuentaCorrientes.PersonaID)
                .Single();
                var cuentaCorrientesMostrar = new VistaCuentaCorrientes
                {
                    CuentaCorrienteID = cuentaCorrientes.CuentaCorrienteID,
                    PersonaID = cuentaCorrientes.PersonaID,
                    Saldo = cuentaCorrientes.Saldo,
                    Ingreso = cuentaCorrientes.Ingreso,
                    Egreso = cuentaCorrientes.Egreso,
                    Descripcion = cuentaCorrientes.Descripcion,
                    Fecha = cuentaCorrientes.Fecha.ToString("dd/MM/yyyy"),
                    NombrePersona = persona.Nombre,
                    ApellidoPersona = persona.Apellido
                };
                MostrarCuentaCorrientes.Add(cuentaCorrientesMostrar);
            }
            
            return Json(MostrarCuentaCorrientes);
        }

    }        
}
