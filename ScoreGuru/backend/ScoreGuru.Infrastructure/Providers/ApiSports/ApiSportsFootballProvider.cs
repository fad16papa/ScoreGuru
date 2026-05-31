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

    public async Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballCountries();
        var cached = await cache.GetAsync<List<CountryDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var raw = await client.GetCountriesAsync(cancellationToken).ConfigureAwait(false);
        var countries = raw
            .Select(FootballDataNormalizer.ToCountryDto)
            .Where(c => !string.IsNullOrWhiteSpace(c.Name))
            .OrderBy(c => c.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();

        await cache.SetAsync(cacheKey, countries, ApiSportsCacheDurations.Countries, cancellationToken)
            .ConfigureAwait(false);

        return countries;
    }

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

    public async Task<TeamRosterDto?> GetTeamRosterAsync(
        int teamId,
        int? season,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballTeamRoster(teamId, season);
        var cached = await cache.GetAsync<TeamRosterDto>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var raw = await client.GetSquadsAsync(teamId, cancellationToken).ConfigureAwait(false);
        var roster = raw
            .Select(item => FootballDataNormalizer.ToTeamRosterDto(item, season))
            .FirstOrDefault(r => r is not null);

        if (roster is null)
        {
            return null;
        }

        await cache.SetAsync(cacheKey, roster, ApiSportsCacheDurations.TeamRoster, cancellationToken)
            .ConfigureAwait(false);

        return roster;
    }

    public async Task<IReadOnlyList<PlayerDto>> GetPlayersAsync(
        int? teamId,
        int? league,
        int? season,
        string? search,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballPlayers(teamId, league, season, search);
        var cached = await cache.GetAsync<List<PlayerDto>>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        var query = new Dictionary<string, string?>
        {
            ["team"] = teamId?.ToString(),
            ["league"] = league?.ToString(),
            ["season"] = season?.ToString(),
            ["search"] = search,
        };

        var raw = await client.GetPlayersAsync(query, cancellationToken).ConfigureAwait(false);
        var players = raw
            .Select(FootballDataNormalizer.ToPlayerDto)
            .Where(p => p is not null)
            .Cast<PlayerDto>()
            .ToList();

        await cache.SetAsync(cacheKey, players, ApiSportsCacheDurations.Players, cancellationToken)
            .ConfigureAwait(false);

        return players;
    }

    public async Task<PlayerDto?> GetPlayerByIdAsync(
        int playerId,
        int? season,
        int? teamId,
        int? leagueId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = ApiSportsCacheKeys.FootballPlayerById(playerId, season, teamId, leagueId);
        var cached = await cache.GetAsync<PlayerDto>(cacheKey, cancellationToken).ConfigureAwait(false);
        if (cached is not null)
        {
            return cached;
        }

        PlayerDto? player = null;

        if (season.HasValue)
        {
            var byIdRaw = await client.GetPlayersAsync(
                new Dictionary<string, string?>
                {
                    ["id"] = playerId.ToString(),
                    ["season"] = season.Value.ToString(),
                },
                cancellationToken).ConfigureAwait(false);

            player = byIdRaw
                .Select(FootballDataNormalizer.ToPlayerDto)
                .FirstOrDefault(p => p is not null && p.Id == playerId);
        }

        if (player is null && teamId.HasValue)
        {
            var roster = await GetTeamRosterAsync(teamId.Value, season, cancellationToken).ConfigureAwait(false);
            player = roster?.Players.FirstOrDefault(p => p.Id == playerId);
        }

        if (player is null && leagueId.HasValue && season.HasValue)
        {
            var leaguePlayers = await GetPlayersAsync(null, leagueId, season, null, cancellationToken)
                .ConfigureAwait(false);
            player = leaguePlayers.FirstOrDefault(p => p.Id == playerId);
        }

        if (player is not null)
        {
            await cache.SetAsync(cacheKey, player, ApiSportsCacheDurations.Players, cancellationToken)
                .ConfigureAwait(false);
        }

        return player;
    }
}
