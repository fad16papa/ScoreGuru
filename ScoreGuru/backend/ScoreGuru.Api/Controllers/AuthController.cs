using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScoreGuru.Application.Abstractions;

namespace ScoreGuru.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuthController(IAuthMeService authMeService) : ControllerBase
{
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        try
        {
            var me = await authMeService.GetOrSyncCurrentUserAsync(cancellationToken);
            return Ok(me);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
