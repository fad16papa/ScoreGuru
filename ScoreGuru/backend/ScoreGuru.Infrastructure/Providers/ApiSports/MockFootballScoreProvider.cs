using Microsoft.Extensions.Logging;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Dtos.Sports;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

/// <summary>
/// Development mock data when API-SPORTS key is not configured.
/// </summary>
public sealed class MockFootballScoreProvider(ILogger<MockFootballScoreProvider> logger) : IFootballScoreProvider
{
    private const int MockLeagueId = 39;
    private const int MockSeason = 2024;
    private const int MockHomeTeamId = 33;
    private const int MockAwayTeamId = 40;
    private const int MockGameId = 100001;

    private readonly IReadOnlyList<LeagueDto> _leagues =
    [
        new()
        {
            Id = MockLeagueId,
            Name = "Premier League (Mock)",
            LogoUrl = null,
            Country = "England",
            Season = MockSeason,
            SportKey = "football",
        },
    ];

    private readonly IReadOnlyList<TeamDto> _teams =
    [
        new() { Id = MockHomeTeamId, Name = "Manchester United (Mock)", Country = "England" },
        new() { Id = MockAwayTeamId, Name = "Liverpool (Mock)", Country = "England" },
    ];

    public bool IsMockProvider => true;

    public Task<IReadOnlyList<SportDto>> GetSupportedSportsAsync(CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        return Task.FromResult(FootballDataNormalizer.SupportedSports());
    }

    public Task<IReadOnlyList<LeagueDto>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        var leagues = _leagues
            .Where(l => country is null || l.Country?.Contains(country, StringComparison.OrdinalIgnoreCase) == true)
            .Where(l => season is null || l.Season == season)
            .ToList();
        return Task.FromResult<IReadOnlyList<LeagueDto>>(leagues);
    }

    public Task<IReadOnlyList<GameSummaryDto>> GetLiveScoresAsync(CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        return Task.FromResult<IReadOnlyList<GameSummaryDto>>([CreateLiveGame()]);
    }

    public Task<IReadOnlyList<GameSummaryDto>> GetTodayScoresAsync(
        string? date,
        int? league,
        int? season,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        var games = new List<GameSummaryDto> { CreateLiveGame(), CreateScheduledGame() };
        if (league.HasValue)
        {
            games = games.Where(g => g.LeagueId == league.Value).ToList();
        }

        return Task.FromResult<IReadOnlyList<GameSummaryDto>>(games);
    }

    public Task<GameDetailsDto?> GetGameDetailsAsync(int gameId, CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        if (gameId != MockGameId)
        {
            return Task.FromResult<GameDetailsDto?>(null);
        }

        var summary = CreateLiveGame();
        return Task.FromResult<GameDetailsDto?>(new GameDetailsDto
        {
            Id = summary.Id,
            SportKey = summary.SportKey,
            LeagueId = summary.LeagueId,
            LeagueName = summary.LeagueName,
            LeagueLogoUrl = summary.LeagueLogoUrl,
            Season = summary.Season,
            DateUtc = summary.DateUtc,
            Status = summary.Status,
            StatusShort = summary.StatusShort,
            Elapsed = summary.Elapsed,
            HomeTeamId = summary.HomeTeamId,
            HomeTeamName = summary.HomeTeamName,
            HomeTeamLogoUrl = summary.HomeTeamLogoUrl,
            AwayTeamId = summary.AwayTeamId,
            AwayTeamName = summary.AwayTeamName,
            AwayTeamLogoUrl = summary.AwayTeamLogoUrl,
            HomeScore = summary.HomeScore,
            AwayScore = summary.AwayScore,
            VenueName = summary.VenueName,
            VenueCity = summary.VenueCity,
            Events =
            [
                new GameEventDto
                {
                    TimeElapsed = 23,
                    TeamId = MockHomeTeamId,
                    TeamName = "Manchester United (Mock)",
                    PlayerName = "Mock Player",
                    Type = "Goal",
                    Detail = "Normal Goal",
                },
            ],
            Statistics =
            [
                new GameStatisticDto { Label = "Shots on Goal", HomeValue = "5", AwayValue = "3" },
                new GameStatisticDto { Label = "Ball Possession", HomeValue = "54%", AwayValue = "46%" },
            ],
            Lineups = null,
        });
    }

    public Task<LeagueStandingsDto?> GetStandingsAsync(
        int league,
        int season,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        if (league != MockLeagueId || season != MockSeason)
        {
            return Task.FromResult<LeagueStandingsDto?>(null);
        }

        return Task.FromResult<LeagueStandingsDto?>(new LeagueStandingsDto
        {
            LeagueId = MockLeagueId,
            LeagueName = "Premier League (Mock)",
            Season = MockSeason,
            Rows =
            [
                new StandingRowDto
                {
                    Rank = 1,
                    TeamId = MockHomeTeamId,
                    TeamName = "Manchester United (Mock)",
                    Played = 10,
                    Wins = 7,
                    Draws = 2,
                    Losses = 1,
                    GoalsFor = 20,
                    GoalsAgainst = 8,
                    GoalDifference = 12,
                    Points = 23,
                    Form = "WWDLW",
                },
                new StandingRowDto
                {
                    Rank = 2,
                    TeamId = MockAwayTeamId,
                    TeamName = "Liverpool (Mock)",
                    Played = 10,
                    Wins = 6,
                    Draws = 3,
                    Losses = 1,
                    GoalsFor = 18,
                    GoalsAgainst = 9,
                    GoalDifference = 9,
                    Points = 21,
                    Form = "WDWWL",
                },
            ],
        });
    }

    public Task<IReadOnlyList<TeamDto>> GetTeamsAsync(
        int? league,
        int? season,
        string? country,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        return Task.FromResult(_teams);
    }

    private GameSummaryDto CreateLiveGame() =>
        new()
        {
            Id = MockGameId,
            SportKey = "football",
            LeagueId = MockLeagueId,
            LeagueName = "Premier League (Mock)",
            Season = MockSeason,
            DateUtc = DateTime.UtcNow.AddHours(-1),
            Status = "Second Half",
            StatusShort = "2H",
            Elapsed = 67,
            HomeTeamId = MockHomeTeamId,
            HomeTeamName = "Manchester United (Mock)",
            AwayTeamId = MockAwayTeamId,
            AwayTeamName = "Liverpool (Mock)",
            HomeScore = 2,
            AwayScore = 1,
            VenueName = "Mock Stadium",
            VenueCity = "Manchester",
        };

    private GameSummaryDto CreateScheduledGame() =>
        new()
        {
            Id = 100002,
            SportKey = "football",
            LeagueId = MockLeagueId,
            LeagueName = "Premier League (Mock)",
            Season = MockSeason,
            DateUtc = DateTime.UtcNow.AddHours(3),
            Status = "Not Started",
            StatusShort = "NS",
            HomeTeamId = MockHomeTeamId,
            HomeTeamName = "Manchester United (Mock)",
            AwayTeamId = MockAwayTeamId,
            AwayTeamName = "Liverpool (Mock)",
            VenueName = "Mock Stadium",
            VenueCity = "Manchester",
        };

    private void LogMockUsage() =>
        logger.LogWarning(
            "API-SPORTS mock football provider is active. Responses are sample data, not live provider data.");
}
