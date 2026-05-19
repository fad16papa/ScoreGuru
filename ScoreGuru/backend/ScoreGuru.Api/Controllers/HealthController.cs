using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreGuru.Infrastructure.Persistence;
using StackExchange.Redis;

namespace ScoreGuru.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController(
    ScoreGuruDbContext dbContext,
    IConnectionMultiplexer redis) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var checks = new Dictionary<string, string>
        {
            ["api"] = "Healthy",
        };

        var healthy = true;

        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
            checks["database"] = canConnect ? "Healthy" : "Unhealthy";
            healthy &= canConnect;
        }
        catch
        {
            checks["database"] = "Unhealthy";
            healthy = false;
        }

        try
        {
            await redis.GetDatabase().PingAsync();
            checks["redis"] = "Healthy";
        }
        catch
        {
            checks["redis"] = "Unhealthy";
            healthy = false;
        }

        var payload = new
        {
            status = healthy ? "Healthy" : "Unhealthy",
            checks,
            timestampUtc = DateTime.UtcNow,
        };

        return healthy ? Ok(payload) : StatusCode(StatusCodes.Status503ServiceUnavailable, payload);
    }
}
