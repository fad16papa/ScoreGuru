using ScoreGuru.Application.Dtos.Sports;

namespace ScoreGuru.Application.Abstractions;

public interface IFootballScoreProvider
{
    bool IsMockProvider { get; }

    Task<IReadOnlyList<SportDto>> GetSupportedSportsAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LeagueDto>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<GameSummaryDto>> GetLiveScoresAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<GameSummaryDto>> GetTodayScoresAsync(
        string? date,
        int? league,
        int? season,
        CancellationToken cancellationToken = default);

    Task<GameDetailsDto?> GetGameDetailsAsync(int gameId, CancellationToken cancellationToken = default);

    Task<LeagueStandingsDto?> GetStandingsAsync(
        int league,
        int season,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TeamDto>> GetTeamsAsync(
        int? league,
        int? season,
        string? country,
        CancellationToken cancellationToken = default);

    Task<TeamRosterDto?> GetTeamRosterAsync(
        int teamId,
        int? season,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PlayerDto>> GetPlayersAsync(
        int? teamId,
        int? league,
        int? season,
        string? search,
        CancellationToken cancellationToken = default);

    Task<PlayerDto?> GetPlayerByIdAsync(
        int playerId,
        int? season,
        int? teamId,
        int? leagueId,
        CancellationToken cancellationToken = default);
}
