using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class SocioAdherente

{
    [Key]
    public int SocioAdherenteID { get; set; }
    public int SocioTitularID { get; set; }
    public int PersonaID { get; set; }

    public virtual ICollection<SocioTitular> SocioTitulares { get; set; }
}