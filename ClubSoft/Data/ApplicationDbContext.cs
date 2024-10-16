﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ClubSoft.Models;


namespace ClubSoft.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<CuentaCorriente> CuentaCorrientes { get; set; }
    public DbSet<DetalleVenta> DetalleVentas { get; set; }
    public DbSet<Evento> Eventos { get; set; }
    public DbSet<Localidad> Localidades { get; set; }
    public DbSet<Persona> Personas { get; set; }
    public DbSet<Provincia> Provincias { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<TipoEvento> TipoEventos { get; set; }
    public DbSet<TipoProducto> TipoProductos { get; set; }
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<SocioAdherente> SocioAdherentes { get; set; }
    public DbSet<SocioTitular> SocioTitulares { get; set; }
    public DbSet<Lugar> Lugares { get; set; }
    public DbSet<Cobro> Cobros { get; set; }
}
