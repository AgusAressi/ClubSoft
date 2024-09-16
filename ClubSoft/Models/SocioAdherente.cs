using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ClubSoft.Models;

public class SocioAdherente

{
    [Key]
    public int SocioAdherenteID { get; set; }
    public int SocioTitularID { get; set; }
    public int PersonaID { get; set; }

    public virtual SocioTitular SocioTitular { get; set; }


}
public class VistaSociosAdherentes
{
    public int SocioAdherenteID { get; set; }
    public int SocioTitularID { get; set; }
    public string? SocioTitularNombre { get; set; }
    public string? SocioTitularApellido { get; set; }
    public int PersonaID { get; set; }
    public string? PersonaNombre { get; set; }
    public string? PersonaApellido { get; set; }

}