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
    public DbSet<Cobro> Cobros { get; set; }
    public DbSet<CuentaCorriente> CuentaCorrientes { get; set; }
    public DbSet<DetalleFactura> DetalleFacturas { get; set; }
    public DbSet<Factura> Facturas { get; set; }
    public DbSet<Localidad> Localidades { get; set; }
    public DbSet<Persona> Personas { get; set; }
    public DbSet<Provincia> Provincias { get; set; }
}
