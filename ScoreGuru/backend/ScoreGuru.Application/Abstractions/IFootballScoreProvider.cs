using ScoreGuru.Application.Dtos.Sports;

namespace ScoreGuru.Application.Abstractions;

public interface IFootballScoreProvider
{
    bool IsMockProvider { get; }

    Task<IReadOnlyList<SportDto>> GetSupportedSportsAsync(CancellationToken cancellationToken = default);

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
}
