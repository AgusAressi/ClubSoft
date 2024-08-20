using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Lugar

{
    [Key]
    public int LugarID { get; set; }
    public string? Nombre { get; set; }


    public virtual ICollection<Evento> Eventos { get; set; }
}