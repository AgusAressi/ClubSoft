using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class Provincia

{
    [Key]
    public int ProvinciaID { get; set; }
    public string? Nombre { get; set; }
   
    public virtual ICollection<Localidad> Localidades { get; set; }


}