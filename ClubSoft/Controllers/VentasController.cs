using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClubSoft.Data;
using ClubSoft.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ClubSoft.Controllers
{
    public class VentasController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VentasController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult InformesVentas()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListadoVentas()
        {
            List<VistaVentas> VentasMostrar = new List<VistaVentas>();
            var listadoVentas = _context.Ventas
            .Where(v => v.Estado != Estado.Eliminado) // Excluir ventas eliminadas
            .OrderByDescending(v => v.Fecha)
            .ToList();


            var listadoPersonas = _context.Personas.ToList();
            foreach (var venta in listadoVentas)
            {
                var persona = listadoPersonas.Where(t => t.PersonaID == venta.PersonaID).Single();

                var ventaMostrar = new VistaVentas
                {
                    VentaID = venta.VentaID,
                    NombrePersona = venta.Persona.Nombre,
                    ApellidoPersona = venta.Persona.Apellido,
                    Total = venta.Total,
                    Fecha = venta.Fecha.ToString("dd/MM/yyyy HH:mm"),
                    Estado = venta.Estado.ToString()


                };
                VentasMostrar.Add(ventaMostrar);
            }
            return Json(VentasMostrar);
        }

        public IActionResult ObtenerDetalleVenta(int id)
        {
            var detalles = _context.DetalleVentas
                .Where(dv => dv.VentaID == id)
                .Select(dv => new
                {
                    dv.Producto.Nombre,
                    dv.Precio,
                    dv.Cantidad,
                    SubTotal = dv.Cantidad * dv.Precio
                }).ToList();

            return Json(detalles);
        }


        // Método para inicializar la vista de Nueva Venta
        public IActionResult NuevaVenta()
        {
            // Código para cargar los select de TipoProducto, Producto y Cliente
            var tipoproductos = _context.TipoProductos.ToList();
            tipoproductos.Add(new TipoProducto { TipoProductoID = 0, Nombre = "[SELECCIONE EL TIPO DE PRODUCTO]" });
            ViewBag.TipoProductoID = new SelectList(tipoproductos.OrderBy(c => c.Nombre), "TipoProductoID", "Nombre");

            var productos = _context.Productos.ToList();
            productos.Add(new Producto { ProductoID = 0, Nombre = "[SELECCIONE UN PRODUCTO]" });
            ViewBag.ProductoID = new SelectList(productos.OrderBy(c => c.Nombre), "ProductoID", "Nombre");

            var personas = _context.Personas.ToList();
            personas.Add(new Persona { PersonaID = 0, Apellido = "[SELECCIONE CLIENTE]", Nombre = "" });
            var listaPersonas = personas.Select(p => new
            {
                p.PersonaID,
                NombreCompleto = p.Apellido + " " + p.Nombre
            });
            ViewBag.PersonaID = new SelectList(listaPersonas.OrderBy(c => c.NombreCompleto), "PersonaID", "NombreCompleto");

            return View();
        }

        // Método para guardar o actualizar la venta temporal
        [HttpPost]
        public IActionResult GuardarVentaTemporal(int PersonaID, DateTime Fecha)
        {
            var usuarioID = User.Identity.Name;

            // Buscar si ya existe una venta temporal para este usuario
            var ventaTemporal = _context.Ventas
                .FirstOrDefault(v => v.UsuarioID == usuarioID && v.Estado == Estado.Temporal);

            if (ventaTemporal == null)
            {
                // Crear nueva venta temporal si no existe
                ventaTemporal = new Venta
                {
                    PersonaID = PersonaID,
                    Fecha = Fecha,
                    Estado = Estado.Temporal,
                    UsuarioID = usuarioID
                };
                _context.Ventas.Add(ventaTemporal);
            }
            else
            {
                // Modificar la venta temporal existente
                ventaTemporal.PersonaID = PersonaID;
                ventaTemporal.Fecha = Fecha;
            }

            _context.SaveChanges();
            return Json(new { success = true, ventaID = ventaTemporal.VentaID });
        }

        // Método para buscar la venta temporal del usuario
        [HttpGet]
        public IActionResult BuscarVentaTemporal()
        {
            var usuarioID = User.Identity.Name;

            // Recuperar la venta temporal del usuario
            var ventaTemporal = _context.Ventas
                .Include(v => v.DetalleVentas)
                .FirstOrDefault(v => v.UsuarioID == usuarioID && v.Estado == Estado.Temporal);

            if (ventaTemporal != null)
            {
                var detalles = ventaTemporal.DetalleVentas.Select(d => new
                {
                    d.Producto.Nombre,
                    d.Cantidad,
                    d.Precio,
                    d.SubTotal
                }).ToList();

                return Json(new { success = true, venta = new { ventaTemporal.VentaID, ventaTemporal.PersonaID, detalleVentas = detalles } });
            }

            return Json(new { success = false, message = "No hay venta temporal activa." });
        }

        // Método para agregar productos a la venta temporal
        [HttpPost]
        public IActionResult AgregarProducto(int productoID, int cantidad, int ventaID)
        {
            // Verificar si la venta existe y es temporal
            var venta = _context.Ventas
                .FirstOrDefault(v => v.VentaID == ventaID && v.Estado == Estado.Temporal);

            if (venta == null)
            {
                return Json(new { success = false, message = "Venta no encontrada o no es temporal." });
            }

            // Verificar si el producto existe
            var producto = _context.Productos.FirstOrDefault(p => p.ProductoID == productoID);
            if (producto == null)
            {
                return Json(new { success = false, message = "Producto no encontrado." });
            }

            // Crear un nuevo detalle de venta
            var detalleVenta = new DetalleVenta
            {
                VentaID = ventaID,
                ProductoID = productoID,
                Cantidad = cantidad,
                Precio = producto.Precio,
                SubTotal = producto.Precio * cantidad,
                UsuarioID = User.Identity.Name
            };

            _context.DetalleVentas.Add(detalleVenta);
            _context.SaveChanges();

            return Json(new { success = true, precio = producto.Precio });
        }

        // Método para confirmar la venta
        [HttpPost]
        public IActionResult ConfirmarVenta(int ventaID, int personaID, DateTime fecha, bool contado)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Verificar si la venta existe y es temporal
                    var venta = _context.Ventas
                        .FirstOrDefault(v => v.VentaID == ventaID && v.Estado == Estado.Temporal);

                    if (venta == null)
                    {
                        return Json(new { success = false, message = "Venta no encontrada o ya confirmada." });
                    }

                    // Obtener los detalles de la venta
                    var detallesVenta = _context.DetalleVentas
                        .Where(dv => dv.VentaID == ventaID).ToList();

                    if (detallesVenta.Count == 0)
                    {
                        return Json(new { success = false, message = "No se han agregado productos a la venta." });
                    }

                    // Calcular el total de la venta sumando los precios de los detalles de la venta
                    decimal totalVenta = detallesVenta.Sum(dv => dv.Cantidad * dv.Precio);

                    // Asignar el total a la venta
                    venta.Total = totalVenta;

                    // Cambiar el estado de la venta a Confirmado
                    venta.Estado = Estado.Confirmado;

                    var cuentaCorriente = new CuentaCorriente
                    {
                        PersonaID = personaID,
                        Saldo = 0, 
                        Ingreso = totalVenta,
                        Egreso = 0,
                        Descripcion = $"Venta #{ventaID}",
                        Fecha = fecha,
                        VentaID = ventaID, 
                    };

                    _context.CuentaCorrientes.Add(cuentaCorriente);
                    _context.SaveChanges();

                    // Guardar el cobro si es de contado
                    if (contado == true) {
                        venta.Estado = Estado.Pagado;
                        var cobro = new Cobro
                        {
                            Fecha = fecha,
                            PersonaID = personaID,
                            EstadoCobro = EstadoCobro.Confirmado,
                            Total = totalVenta,
                            UsuarioID = User.Identity.Name,
                        }; 
                        _context.Cobros.Add(cobro);
                        _context.SaveChanges();

                        var cuentaCorrienteCobro = new CuentaCorriente
                    {
                        PersonaID = personaID,
                        Saldo = 0, 
                        Ingreso = 0,
                        Egreso = totalVenta,
                        Descripcion = "Cobro de contado",
                        Fecha = fecha, 
                    };
                    _context.CuentaCorrientes.Add(cuentaCorrienteCobro);
                    _context.SaveChanges();


                    }

                    // Crear un nuevo registro en CuentaCorriente
                    

                    // Llamar a RecalcularCtaCte para actualizar los saldos
                    RecalcularCtaCte(personaID);

                    // Confirmar la transacción
                    transaction.Commit();

                    return Json(new { success = true, redirectUrl = Url.Action("Index", "Ventas") });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return Json(new { success = false, message = "Error al confirmar la venta: " + innerExceptionMessage });
                }
            }
        }

        public void RecalcularCtaCte(int personaID)
        {
            decimal saldo = 0;

            // Recalculo de saldos acumulados en cada registro ordenado por fecha ascendente 
            var movimientosCtaCte = _context.CuentaCorrientes
                                            .Where(cam => cam.PersonaID == personaID)
                                            .OrderBy(o => o.Fecha)
                                            .ThenBy(o => o.CuentaCorrienteID)
                                            .ToList();

            foreach (var m in movimientosCtaCte)
            {
                saldo = m.Ingreso - m.Egreso + saldo;
                m.Saldo = saldo;
            }

            _context.SaveChanges();
        }


        // Método para cancelar la venta
        [HttpPost]
        public IActionResult CancelarVenta(int ventaID)
        {
            var venta = _context.Ventas.FirstOrDefault(v => v.VentaID == ventaID && v.Estado == Estado.Temporal);
            if (venta == null)
            {
                return Json(new { success = false, message = "Venta no encontrada o ya confirmada." });
            }

            // Eliminar la venta y sus productos relacionados
            var productos = _context.DetalleVentas.Where(dv => dv.VentaID == venta.VentaID).ToList();
            _context.DetalleVentas.RemoveRange(productos);
            _context.Ventas.Remove(venta);

            try
            {
                _context.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al cancelar la venta: " + ex.Message });
            }
        }

        public JsonResult ComboProducto(int TipoProductoID)
        {
            // BUSCAR PRODUCTOS con TipoProductoID específico y estado activo (estado == true)
            var productos = (from o in _context.Productos
                             where o.TipoProductoID == TipoProductoID && o.Estado == true
                             select o).ToList();

            return Json(new SelectList(productos, "ProductoID", "Nombre"));
        }

        public JsonResult PrecioProducto(int productoID)
        {
            var precio = _context.Productos
                                .Where(p => p.ProductoID == productoID)
                                .Select(p => p.Precio)
                                .FirstOrDefault();

            return Json(precio);
        }

        [HttpPost]
        public IActionResult EliminarVenta(int ventaID)
        {
            // Buscar la venta por su ID
            var venta = _context.Ventas.FirstOrDefault(v => v.VentaID == ventaID);

            if (venta == null)
            {
                return Json(new { success = false, message = "Venta no encontrada." });
            }

            // Cambiar el estado de la venta a 'Eliminado'
            venta.Estado = Estado.Eliminado;

            try
            {
                _context.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al eliminar la venta: " + ex.Message });
            }
        }



        [HttpPost]
        public JsonResult InformeVentasPorCliente()
        {
            // Crear lista para almacenar la información de ventas
            List<VistaVentas> VentasMostrar = new List<VistaVentas>();

            var listadoVentas = _context.Ventas.Where(v => v.Estado != Estado.Eliminado).ToList();
            var listadoPersonas = _context.Personas.ToList();


            foreach (var venta in listadoVentas)
            {

                var persona = listadoPersonas.SingleOrDefault(p => p.PersonaID == venta.PersonaID);
                if (persona != null)
                {

                    var ventaMostrar = new VistaVentas
                    {
                        VentaID = venta.VentaID,
                        NombrePersona = persona.Nombre,
                        ApellidoPersona = persona.Apellido,
                        Total = venta.Total,
                        Fecha = venta.Fecha.ToString("dd/MM/yyyy"),
                        Estado = venta.Estado.ToString()
                    };

                    VentasMostrar.Add(ventaMostrar);
                }
            }

            return Json(VentasMostrar);
        }
    }
}





