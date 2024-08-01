using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Evento
{
     [Key]
    public int EventoID { get; set; }
    public string? Descripcion { get; set; }    
    public DateTime FechaEvento  { get; set; }
    public string? Lugar { get; set; }
    public int TipoEventoID { get; set; }

    public virtual TipoEvento TipoEvento { get; set; }



    public class VistaTipoEventos
{
    public int EventoID { get; set; }
    public int TipoEventoID { get; set; }
    public string? Descripcion { get; set; }
    public DateTime FechaEvento  { get; set; }
    public string? Lugar { get; set; }
    public string? NombreTipoEvento { get; set; }
   
}

}