using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ScoreGuru.Application.Exceptions;
using ScoreGuru.Application.Options;
using ScoreGuru.Infrastructure.Providers.ApiSports.Models;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

public sealed class ApiSportsFootballClient(
    HttpClient httpClient,
    IOptions<ApiSportsOptions> options,
    ILogger<ApiSportsFootballClient> logger) : IApiSportsFootballClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public Task<IReadOnlyList<ApiSportsLeagueItem>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default)
    {
        var query = new Dictionary<string, string?>
        {
            ["country"] = country,
            ["season"] = season?.ToString(),
        };

        return GetAsync<ApiSportsLeagueItem>("leagues", query, cancellationToken);
    }

    public Task<IReadOnlyList<ApiSportsCountryItem>> GetCountriesAsync(
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsCountryItem>("countries", new Dictionary<string, string?>(), cancellationToken);

    public Task<IReadOnlyList<ApiSportsFixtureItem>> GetFixturesAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsFixtureItem>("fixtures", query, cancellationToken);

    public Task<IReadOnlyList<ApiSportsFixtureEventItem>> GetFixtureEventsAsync(
        int fixtureId,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsFixtureEventItem>(
            "fixtures/events",
            new Dictionary<string, string?> { ["fixture"] = fixtureId.ToString() },
            cancellationToken);

    public Task<IReadOnlyList<ApiSportsFixtureStatisticsItem>> GetFixtureStatisticsAsync(
        int fixtureId,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsFixtureStatisticsItem>(
            "fixtures/statistics",
            new Dictionary<string, string?> { ["fixture"] = fixtureId.ToString() },
            cancellationToken);

    public Task<IReadOnlyList<ApiSportsStandingsItem>> GetStandingsAsync(
        int league,
        int season,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsStandingsItem>(
            "standings",
            new Dictionary<string, string?>
            {
                ["league"] = league.ToString(),
                ["season"] = season.ToString(),
            },
            cancellationToken);

    public Task<IReadOnlyList<ApiSportsTeamItem>> GetTeamsAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsTeamItem>("teams", query, cancellationToken);

    public Task<IReadOnlyList<ApiSportsSquadItem>> GetSquadsAsync(
        int teamId,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsSquadItem>(
            "players/squads",
            new Dictionary<string, string?> { ["team"] = teamId.ToString() },
            cancellationToken);

    public Task<IReadOnlyList<ApiSportsPlayerProfileItem>> GetPlayersAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default) =>
        GetAsync<ApiSportsPlayerProfileItem>("players", query, cancellationToken);

    private async Task<IReadOnlyList<T>> GetAsync<T>(
        string path,
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken)
    {
        var apiKey = options.Value.ApiKey;
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("ApiSports:ApiKey is not configured.");
        }

        var queryString = string.Join(
            "&",
            query
                .Where(kv => !string.IsNullOrWhiteSpace(kv.Value))
                .Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value!)}"));

        var requestUri = string.IsNullOrEmpty(queryString) ? path : $"{path}?{queryString}";
        using var request = new HttpRequestMessage(HttpMethod.Get, requestUri);
        request.Headers.TryAddWithoutValidation("x-apisports-key", apiKey);

        using var response = await httpClient.SendAsync(request, cancellationToken).ConfigureAwait(false);
        var body = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

        if (response.StatusCode == HttpStatusCode.TooManyRequests)
        {
            logger.LogWarning("API-SPORTS rate limit reached for {Path}", path);
            throw new SportsDataProviderException(
                "Sports data provider rate limit reached. Please try again shortly.",
                isRateLimited: true,
                providerStatusCode: (int)response.StatusCode);
        }

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "API-SPORTS request failed for {Path} with status {StatusCode}. Response length: {BodyLength}",
                path,
                (int)response.StatusCode,
                body.Length);

            var detail = (int)response.StatusCode switch
            {
                401 or 403 => "Sports data provider rejected the API key. Check ApiSports:ApiKey in user secrets.",
                _ => "Sports data provider is temporarily unavailable.",
            };

            throw new SportsDataProviderException(
                detail,
                providerStatusCode: (int)response.StatusCode);
        }

        ApiSportsEnvelope<T>? envelope;
        try
        {
            envelope = JsonSerializer.Deserialize<ApiSportsEnvelope<T>>(body, JsonOptions);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to parse API-SPORTS response for {Path}", path);
            throw new SportsDataProviderException(
                "Sports data provider returned an unexpected response.",
                innerException: ex);
        }

        if (envelope?.HasErrors == true)
        {
            var errorSummary = envelope.Errors?.ToString() ?? "unknown provider error";
            logger.LogWarning("API-SPORTS returned errors for {Path}: {Errors}", path, errorSummary);

            var isRateLimited = errorSummary.Contains("rate", StringComparison.OrdinalIgnoreCase);
            throw new SportsDataProviderException(
                isRateLimited
                    ? "Sports data provider rate limit reached. Please try again shortly."
                    : "Sports data provider could not fulfill the request.",
                isRateLimited: isRateLimited);
        }

        return envelope?.Response ?? [];
    }
}
