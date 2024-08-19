using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public string? Descripcion { get; set; }
    public DateTime FechaEvento { get; set; }
    public int LugarID { get; set; }
    public int TipoEventoID { get; set; }

    public virtual TipoEvento TipoEvento { get; set; }

    public virtual Lugar Lugar { get; set; }

    
    public class VistaTipoEventos
    {
        public int EventoID { get; set; }
        public int TipoEventoID { get; set; }
        public string? Descripcion { get; set; }
        public string FechaEvento { get; set; }
        public string HoraEvento { get; set; }
        public int LugarID { get; set; }
        public string? NombreTipoEvento { get; set; }
        public string? NombreLugar { get; set; }

    }

}