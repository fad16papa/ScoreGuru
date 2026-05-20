using Microsoft.AspNetCore.Mvc;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Exceptions;

namespace ScoreGuru.Api.Controllers;

[ApiController]
[Route("api/football")]
public class FootballController(IFootballScoreProvider footballScoreProvider) : ControllerBase
{
    [HttpGet("leagues")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetLeagues(
        [FromQuery] string? country,
        [FromQuery] int? season,
        CancellationToken cancellationToken)
    {
        try
        {
            var leagues = await footballScoreProvider.GetLeaguesAsync(country, season, cancellationToken);
            return OkWithSource(leagues);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    [HttpGet("scores/live")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetLiveScores(CancellationToken cancellationToken)
    {
        try
        {
            var scores = await footballScoreProvider.GetLiveScoresAsync(cancellationToken);
            return OkWithSource(scores);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    [HttpGet("scores/today")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetTodayScores(
        [FromQuery] string? date,
        [FromQuery] int? league,
        [FromQuery] int? season,
        CancellationToken cancellationToken)
    {
        try
        {
            var scores = await footballScoreProvider.GetTodayScoresAsync(date, league, season, cancellationToken);
            return OkWithSource(scores);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    [HttpGet("games/{gameId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetGame(int gameId, CancellationToken cancellationToken)
    {
        try
        {
            var game = await footballScoreProvider.GetGameDetailsAsync(gameId, cancellationToken);
            if (game is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Game not found",
                    Detail = $"No game details found for id {gameId}.",
                    Status = StatusCodes.Status404NotFound,
                });
            }

            return OkWithSource(game);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    [HttpGet("standings")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetStandings(
        [FromQuery] int? league,
        [FromQuery] int? season,
        CancellationToken cancellationToken)
    {
        if (!league.HasValue || !season.HasValue)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid query",
                Detail = "Query parameters 'league' and 'season' are required.",
                Status = StatusCodes.Status400BadRequest,
            });
        }

        try
        {
            var standings = await footballScoreProvider
                .GetStandingsAsync(league.Value, season.Value, cancellationToken);

            if (standings is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Standings not found",
                    Detail = $"No standings found for league {league} season {season}.",
                    Status = StatusCodes.Status404NotFound,
                });
            }

            return OkWithSource(standings);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    [HttpGet("teams")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetTeams(
        [FromQuery] int? league,
        [FromQuery] int? season,
        [FromQuery] string? country,
        CancellationToken cancellationToken)
    {
        try
        {
            var teams = await footballScoreProvider.GetTeamsAsync(league, season, country, cancellationToken);
            return OkWithSource(teams);
        }
        catch (SportsDataProviderException ex)
        {
            return ProviderProblem(ex);
        }
    }

    private IActionResult OkWithSource<T>(T payload)
    {
        if (footballScoreProvider.IsMockProvider)
        {
            Response.Headers["X-ScoreGuru-Data-Source"] = "mock";
        }
        else
        {
            Response.Headers["X-ScoreGuru-Data-Source"] = "api-sports";
        }

        return Ok(payload);
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
