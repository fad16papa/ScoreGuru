using ScoreGuru.Infrastructure.Providers.ApiSports.Models;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

public interface IApiSportsFootballClient
{
    Task<IReadOnlyList<ApiSportsLeagueItem>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsCountryItem>> GetCountriesAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsFixtureItem>> GetFixturesAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsFixtureEventItem>> GetFixtureEventsAsync(
        int fixtureId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsFixtureStatisticsItem>> GetFixtureStatisticsAsync(
        int fixtureId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsStandingsItem>> GetStandingsAsync(
        int league,
        int season,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsTeamItem>> GetTeamsAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsSquadItem>> GetSquadsAsync(
        int teamId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApiSportsPlayerProfileItem>> GetPlayersAsync(
        IReadOnlyDictionary<string, string?> query,
        CancellationToken cancellationToken = default);
}
