using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class TipoEvento
{
     [Key]
    public int TipoEventoID { get; set; }
    public string? Nombre { get; set; }
    
    public virtual ICollection<Evento> Eventos { get; set; }
}