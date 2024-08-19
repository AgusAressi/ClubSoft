using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class SocioTitular

{
    [Key]
    public int SocioTitularID { get; set; }
    public int SocioAdherenteID { get; set; }
    public int PersonaID { get; set; }

     public virtual SocioAdherente SocioAdherente { get; set; }

}