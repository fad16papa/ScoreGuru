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

    public Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        return Task.FromResult<IReadOnlyList<CountryDto>>(MockCountries);
    }

    private static readonly IReadOnlyList<CountryDto> MockCountries =
    [
        new() { Name = "England", Code = "GB" },
        new() { Name = "Spain", Code = "ES" },
        new() { Name = "Germany", Code = "DE" },
        new() { Name = "Italy", Code = "IT" },
        new() { Name = "France", Code = "FR" },
        new() { Name = "Portugal", Code = "PT" },
        new() { Name = "Netherlands", Code = "NL" },
        new() { Name = "Brazil", Code = "BR" },
        new() { Name = "Argentina", Code = "AR" },
        new() { Name = "USA", Code = "US" },
        new() { Name = "World", Code = null },
    ];

    public Task<IReadOnlyList<LeagueDto>> GetLeaguesAsync(
        string? country,
        int? season,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        var effectiveSeason = season ?? DateTime.UtcNow.Year;
        var leagues = _leagues
            .Where(l => country is null || l.Country?.Contains(country, StringComparison.OrdinalIgnoreCase) == true)
            .Select(l => new LeagueDto
            {
                Id = l.Id,
                Name = l.Name,
                LogoUrl = l.LogoUrl,
                Country = l.Country,
                Season = effectiveSeason,
                SportKey = l.SportKey,
            })
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
        if (league != MockLeagueId || !MatchesMockSeason(season))
        {
            return Task.FromResult<LeagueStandingsDto?>(null);
        }

        return Task.FromResult<LeagueStandingsDto?>(new LeagueStandingsDto
        {
            LeagueId = MockLeagueId,
            LeagueName = "Premier League (Mock)",
            Season = season,
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

    public Task<TeamRosterDto?> GetTeamRosterAsync(
        int teamId,
        int? season,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        var rosterSeason = season ?? MockSeason;
        return Task.FromResult(_rosters.TryGetValue(teamId, out var players)
            ? new TeamRosterDto
            {
                TeamId = teamId,
                TeamName = teamId == MockHomeTeamId
                    ? "Manchester United (Mock)"
                    : teamId == MockAwayTeamId
                        ? "Liverpool (Mock)"
                        : $"Team {teamId} (Mock)",
                TeamLogoUrl = null,
                Season = rosterSeason,
                Players = players,
            }
            : null);
    }

    public Task<IReadOnlyList<PlayerDto>> GetPlayersAsync(
        int? teamId,
        int? league,
        int? season,
        string? search,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();
        var allPlayers = _rosters.Values.SelectMany(p => p).ToList();

        IEnumerable<PlayerDto> filtered = allPlayers;

        if (teamId.HasValue)
        {
            filtered = filtered.Where(p => p.TeamId == teamId.Value);
        }

        if (league.HasValue && league.Value != MockLeagueId)
        {
            filtered = filtered.Where(_ => false);
        }

        if (season.HasValue && !MatchesMockSeason(season.Value))
        {
            filtered = filtered.Where(_ => false);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            filtered = filtered.Where(p =>
                p.Name.Contains(search, StringComparison.OrdinalIgnoreCase)
                || p.FirstName?.Contains(search, StringComparison.OrdinalIgnoreCase) == true
                || p.LastName?.Contains(search, StringComparison.OrdinalIgnoreCase) == true
                || p.Id.ToString() == search.Trim());
        }

        return Task.FromResult<IReadOnlyList<PlayerDto>>(filtered.ToList());
    }

    public Task<PlayerDto?> GetPlayerByIdAsync(
        int playerId,
        int? season,
        int? teamId,
        int? leagueId,
        CancellationToken cancellationToken = default)
    {
        LogMockUsage();

        if (season.HasValue && !MatchesMockSeason(season.Value))
        {
            return Task.FromResult<PlayerDto?>(null);
        }

        var allPlayers = _rosters.Values.SelectMany(p => p).ToList();
        var player = allPlayers.FirstOrDefault(p => p.Id == playerId);
        if (player is null)
        {
            return Task.FromResult<PlayerDto?>(null);
        }

        if (teamId.HasValue && player.TeamId != teamId.Value)
        {
            return Task.FromResult<PlayerDto?>(null);
        }

        if (leagueId.HasValue && leagueId.Value != MockLeagueId)
        {
            return Task.FromResult<PlayerDto?>(null);
        }

        return Task.FromResult<PlayerDto?>(player);
    }

    private static PlayerDto MockPlayer(
        int id,
        int teamId,
        string teamName,
        string firstName,
        string lastName,
        string position,
        int number,
        string nationality,
        int age,
        string height,
        string weight) =>
        new()
        {
            Id = id,
            Name = $"{firstName} {lastName}",
            FirstName = firstName,
            LastName = lastName,
            Age = age,
            BirthDate = $"{DateTime.UtcNow.Year - age}-01-15",
            Nationality = nationality,
            Height = height,
            Weight = weight,
            PhotoUrl = null,
            TeamId = teamId,
            TeamName = teamName,
            TeamLogoUrl = null,
            Position = position,
            Number = number,
        };

    private readonly Dictionary<int, IReadOnlyList<PlayerDto>> _rosters = new()
    {
        [MockHomeTeamId] =
        [
            MockPlayer(330001, MockHomeTeamId, "Manchester United (Mock)", "Andre", "Mockford", "Goalkeeper", 1, "England", 28, "188 cm", "82 kg"),
            MockPlayer(330002, MockHomeTeamId, "Manchester United (Mock)", "Luke", "Mock", "Defender", 2, "England", 26, "185 cm", "78 kg"),
            MockPlayer(330003, MockHomeTeamId, "Manchester United (Mock)", "Bruno", "Mock", "Midfielder", 8, "Portugal", 29, "179 cm", "69 kg"),
            MockPlayer(330004, MockHomeTeamId, "Manchester United (Mock)", "Marcus", "Mockford", "Attacker", 10, "England", 27, "186 cm", "81 kg"),
            MockPlayer(330005, MockHomeTeamId, "Manchester United (Mock)", "Mason", "Mock", "Midfielder", 18, "England", 24, "175 cm", "70 kg"),
            MockPlayer(330006, MockHomeTeamId, "Manchester United (Mock)", "Harry", "Mock", "Defender", 5, "England", 30, "187 cm", "80 kg"),
        ],
        [MockAwayTeamId] =
        [
            MockPlayer(400001, MockAwayTeamId, "Liverpool (Mock)", "Alisson", "Mock", "Goalkeeper", 1, "Brazil", 31, "193 cm", "91 kg"),
            MockPlayer(400002, MockAwayTeamId, "Liverpool (Mock)", "Virgil", "Mock", "Defender", 4, "Netherlands", 32, "193 cm", "89 kg"),
            MockPlayer(400003, MockAwayTeamId, "Liverpool (Mock)", "Trent", "Mock", "Defender", 66, "England", 25, "175 cm", "69 kg"),
            MockPlayer(400004, MockAwayTeamId, "Liverpool (Mock)", "Mo", "Mock", "Attacker", 11, "Egypt", 31, "175 cm", "71 kg"),
            MockPlayer(400005, MockAwayTeamId, "Liverpool (Mock)", "Curtis", "Mock", "Midfielder", 17, "England", 25, "174 cm", "70 kg"),
            MockPlayer(400006, MockAwayTeamId, "Liverpool (Mock)", "Darwin", "Mock", "Attacker", 9, "Uruguay", 25, "187 cm", "81 kg"),
            MockPlayer(400007, MockAwayTeamId, "Liverpool (Mock)", "Alexis", "Mock", "Attacker", 7, "Colombia", 27, "178 cm", "70 kg"),
        ],
    };

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

    private static bool MatchesMockSeason(int season) =>
        season == MockSeason || season == CurrentFootballSeasonYear();

    private static int CurrentFootballSeasonYear()
    {
        var now = DateTime.UtcNow;
        return now.Month >= 7 ? now.Year : now.Year - 1;
    }
}
