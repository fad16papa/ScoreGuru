using Microsoft.AspNetCore.Mvc;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Exceptions;

namespace ScoreGuru.Api.Controllers;

[ApiController]
[Route("api/sports")]
public class SportsController(IFootballScoreProvider footballScoreProvider) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetSports(CancellationToken cancellationToken)
    {
        try
        {
            var sports = await footballScoreProvider.GetSupportedSportsAsync(cancellationToken);
            if (footballScoreProvider.IsMockProvider)
            {
                Response.Headers["X-ScoreGuru-Data-Source"] = "mock";
            }

            return Ok(sports);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    private ObjectResult ProviderProblem(SportsDataProviderException ex) =>
        StatusCode(
            ex.IsRateLimited ? StatusCodes.Status429TooManyRequests : StatusCodes.Status503ServiceUnavailable,
            new ProblemDetails
            {
                Title = "Sports data unavailable",
                Detail = ex.Message,
                Status = ex.IsRateLimited
                    ? StatusCodes.Status429TooManyRequests
                    : StatusCodes.Status503ServiceUnavailable,
            });
}
