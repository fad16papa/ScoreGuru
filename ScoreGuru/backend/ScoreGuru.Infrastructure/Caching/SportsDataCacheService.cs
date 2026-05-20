using System.Text.Json;
using Microsoft.Extensions.Logging;
using ScoreGuru.Application.Abstractions;
using StackExchange.Redis;

namespace ScoreGuru.Infrastructure.Caching;

public sealed class SportsDataCacheService(
    IConnectionMultiplexer redis,
    ILogger<SportsDataCacheService> logger) : ISportsDataCacheService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var db = redis.GetDatabase();
        var value = await db.StringGetAsync(key).ConfigureAwait(false);

        if (!value.HasValue)
        {
            return default;
        }

        try
        {
            return JsonSerializer.Deserialize<T>(value!, JsonOptions);
        }
        catch (JsonException ex)
        {
            logger.LogWarning(ex, "Failed to deserialize cached sports data for key {CacheKey}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(
        string key,
        T value,
        TimeSpan expiration,
        CancellationToken cancellationToken = default)
    {
        var db = redis.GetDatabase();
        var payload = JsonSerializer.Serialize(value, JsonOptions);
        await db.StringSetAsync(key, payload, expiration).ConfigureAwait(false);
    }
}
