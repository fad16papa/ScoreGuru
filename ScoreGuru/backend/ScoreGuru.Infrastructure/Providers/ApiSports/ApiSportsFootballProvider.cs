using Microsoft.Extensions.Logging;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Dtos.Sports;
using ScoreGuru.Infrastructure.Caching;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

public sealed class ApiSportsFootballProvider(
    IApiSportsFootballClient client,
    ISportsDataCacheService cache) : IFootballScoreProvider
{
    public bool IsMockProvider => false;

    public Task<IReadOnlyList<SportDto>> GetSupportedSportsAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult(FootballDataNormalizer.SupportedSports());

    public async Task<IReadOnlyList<LeagueDto>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballLeagues(country, season);
        var cached = await cache.GetAsync<List<LeagueDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var raw = await client.GetLeaguesAsync(country, season, cancellationToken).ConfigureAwait(false);
        var leagues = raw
            .Select(item => FootballDataNormalizer.ToLeagueDto(item, season))
            .Where(l => l.Id > 0)
            .ToList();

        await cache.SetAsync(cacheKey, leagues, ApiSportsCacheDurations.Leagues, cancellationToken)
            .ConfigureAwait(false);

        return leagues;
    }

    public async Task<IReadOnlyList<GameSummaryDto>> GetLiveScoresAsync(
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballLiveScores();
        var cached = await cache.GetAsync<List<GameSummaryDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var raw = await client
            .GetFixturesAsync(new Dictionary<string, string?> { ["live"] = "all" }, cancellationToken)
            .ConfigureAwait(false);

        var games = raw.Select(FootballDataNormalizer.ToGameSummaryDto).Where(g => g.Id > 0).ToList();
        await cache.SetAsync(cacheKey, games, ApiSportsCacheDurations.LiveScores, cancellationToken)
            .ConfigureAwait(false);

        return games;
    }

    public async Task<IReadOnlyList<GameSummaryDto>> GetTodayScoresAsync(
        string? date,
        int? league,
        int? season,
        CancellationToken cancellationToken = default)
    {
        var resolvedDate = string.IsNullOrWhiteSpace(date)
            ? DateTime.UtcNow.ToString("yyyy-MM-dd")
            : date.Trim();

        var cacheKey = ApiSportsCacheKeys.FootballTodayScores(resolvedDate, league, season);
        var cached = await cache.GetAsync<List<GameSummaryDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var query = new Dictionary<string, string?>
        {
            ["date"] = resolvedDate,
            ["league"] = league?.ToString(),
            ["season"] = season?.ToString(),
        };

        var raw = await client.GetFixturesAsync(query, cancellationToken).ConfigureAwait(false);
        var games = raw.Select(FootballDataNormalizer.ToGameSummaryDto).Where(g => g.Id > 0).ToList();

        await cache.SetAsync(cacheKey, games, ApiSportsCacheDurations.TodayScores, cancellationToken)
            .ConfigureAwait(false);

        return games;
    }

    public async Task<GameDetailsDto?> GetGameDetailsAsync(
        int gameId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballGame(gameId);
        var cached = await cache.GetAsync<GameDetailsDto>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var fixtures = await client
            .GetFixturesAsync(new Dictionary<string, string?> { ["id"] = gameId.ToString() }, cancellationToken)
            .ConfigureAwait(false);

        var fixture = fixtures.FirstOrDefault();
        if (fixture is null)
        {
            return null;
        }

        var events = await client.GetFixtureEventsAsync(gameId, cancellationToken).ConfigureAwait(false);
        var statistics = await client.GetFixtureStatisticsAsync(gameId, cancellationToken).ConfigureAwait(false);

        var details = FootballDataNormalizer.ToGameDetailsDto(fixture, events, statistics);
        var ttl = ApiSportsCacheDurations.ForGameStatus(details.StatusShort);

        await cache.SetAsync(cacheKey, details, ttl, cancellationToken).ConfigureAwait(false);
        return details;
    }

    public async Task<LeagueStandingsDto?> GetStandingsAsync(
        int league,
        int season,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballStandings(league, season);
        var cached = await cache.GetAsync<LeagueStandingsDto>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var raw = await client.GetStandingsAsync(league, season, cancellationToken).ConfigureAwait(false);
        var standings = raw
            .Select(FootballDataNormalizer.ToLeagueStandingsDto)
            .FirstOrDefault(s => s is not null);

        if (standings is null)
        {
            return null;
        }

        await cache.SetAsync(cacheKey, standings, ApiSportsCacheDurations.Standings, cancellationToken)
            .ConfigureAwait(false);

        return standings;
    }

    public async Task<IReadOnlyList<TeamDto>> GetTeamsAsync(
        int? league,
        int? season,
        string? country,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballTeams(league, season, country);
        var cached = await cache.GetAsync<List<TeamDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var query = new Dictionary<string, string?>
        {
            ["league"] = league?.ToString(),
            ["season"] = season?.ToString(),
            ["country"] = country,
        };

        var raw = await client.GetTeamsAsync(query, cancellationToken).ConfigureAwait(false);
        var teams = raw.Select(FootballDataNormalizer.ToTeamDto).Where(t => t.Id > 0).ToList();

        await cache.SetAsync(cacheKey, teams, ApiSportsCacheDurations.Teams, cancellationToken)
            .ConfigureAwait(false);

        return teams;
    }
}
