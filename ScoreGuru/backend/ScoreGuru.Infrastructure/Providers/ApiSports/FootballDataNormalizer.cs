using ScoreGuru.Application.Dtos.Sports;
using ScoreGuru.Infrastructure.Providers.ApiSports.Models;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

public static class FootballDataNormalizer
{
    public static IReadOnlyList<SportDto> SupportedSports() =>
    [
        new SportDto { Key = "football", Name = "Football" }
    ];

    public static CountryDto ToCountryDto(ApiSportsCountryItem item) =>
        new()
        {
            Name = item.Name ?? string.Empty,
            Code = item.Code,
            FlagUrl = item.Flag,
        };

    public static LeagueDto ToLeagueDto(ApiSportsLeagueItem item, int? seasonFilter)
    {
        var season = seasonFilter ?? item.Seasons?.OrderByDescending(s => s.Year).FirstOrDefault()?.Year;
        return new LeagueDto
        {
            Id = item.League?.Id ?? 0,
            Name = item.League?.Name ?? string.Empty,
            LogoUrl = item.League?.Logo,
            Country = item.Country?.Name,
            Season = season,
            SportKey = "football",
        };
    }

    public static GameSummaryDto ToGameSummaryDto(ApiSportsFixtureItem item)
    {
        var fixture = item.Fixture;
        var league = item.League;
        var home = item.Teams?.Home;
        var away = item.Teams?.Away;
        var goals = item.Goals;

        return new GameSummaryDto
        {
            Id = fixture?.Id ?? 0,
            SportKey = "football",
            LeagueId = league?.Id ?? 0,
            LeagueName = league?.Name ?? string.Empty,
            LeagueLogoUrl = league?.Logo,
            Season = league?.Season,
            DateUtc = fixture?.Date.ToUniversalTime() ?? DateTime.UtcNow,
            Status = fixture?.Status?.Long ?? string.Empty,
            StatusShort = fixture?.Status?.Short ?? string.Empty,
            Elapsed = fixture?.Status?.Elapsed,
            HomeTeamId = home?.Id ?? 0,
            HomeTeamName = home?.Name ?? string.Empty,
            HomeTeamLogoUrl = home?.Logo,
            AwayTeamId = away?.Id ?? 0,
            AwayTeamName = away?.Name ?? string.Empty,
            AwayTeamLogoUrl = away?.Logo,
            HomeScore = goals?.Home,
            AwayScore = goals?.Away,
            VenueName = fixture?.Venue?.Name,
            VenueCity = fixture?.Venue?.City,
        };
    }

    public static GameDetailsDto ToGameDetailsDto(
        ApiSportsFixtureItem fixture,
        IReadOnlyList<ApiSportsFixtureEventItem> events,
        IReadOnlyList<ApiSportsFixtureStatisticsItem> statistics)
    {
        var summary = ToGameSummaryDto(fixture);
        return new GameDetailsDto
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
            Events = events.Select(ToGameEventDto).ToList(),
            Statistics = NormalizeStatistics(statistics),
            Lineups = null,
        };
    }

    public static GameEventDto ToGameEventDto(ApiSportsFixtureEventItem item) =>
        new()
        {
            TimeElapsed = item.Time?.Elapsed,
            TeamId = item.Team?.Id,
            TeamName = item.Team?.Name,
            PlayerName = item.Player?.Name,
            AssistName = item.Assist?.Name,
            Type = item.Type,
            Detail = item.Detail,
            Comments = item.Comments,
        };

    public static IReadOnlyList<GameStatisticDto> NormalizeStatistics(
        IReadOnlyList<ApiSportsFixtureStatisticsItem> items)
    {
        if (items.Count == 0)
        {
            return [];
        }

        var home = items[0];
        var away = items.Count > 1 ? items[1] : items[0];

        var homeStats = home.Statistics?.ToDictionary(s => s.Type ?? string.Empty, s => FormatStatValue(s.Value))
            ?? new Dictionary<string, string?>();
        var awayStats = away.Statistics?.ToDictionary(s => s.Type ?? string.Empty, s => FormatStatValue(s.Value))
            ?? new Dictionary<string, string?>();

        var labels = homeStats.Keys.Union(awayStats.Keys).OrderBy(l => l).ToList();
        return labels.Select(label => new GameStatisticDto
        {
            Label = label,
            HomeValue = homeStats.GetValueOrDefault(label),
            AwayValue = awayStats.GetValueOrDefault(label),
        }).ToList();
    }

    public static LeagueStandingsDto? ToLeagueStandingsDto(ApiSportsStandingsItem item)
    {
        var league = item.League;
        if (league is null)
        {
            return null;
        }

        var rows = league.Standings?
            .SelectMany(group => group)
            .Select(ToStandingRowDto)
            .OrderBy(r => r.Rank)
            .ToList() ?? [];

        return new LeagueStandingsDto
        {
            LeagueId = league.Id,
            LeagueName = league.Name ?? string.Empty,
            Season = league.Season,
            Rows = rows,
        };
    }

    public static StandingRowDto ToStandingRowDto(ApiSportsStandingRow row)
    {
        var record = row.All;
        var goals = record?.Goals;
        return new StandingRowDto
        {
            Rank = row.Rank,
            TeamId = row.Team?.Id ?? 0,
            TeamName = row.Team?.Name ?? string.Empty,
            TeamLogoUrl = row.Team?.Logo,
            Played = record?.Played ?? 0,
            Wins = record?.Win ?? 0,
            Draws = record?.Draw ?? 0,
            Losses = record?.Lose ?? 0,
            GoalsFor = goals?.For ?? 0,
            GoalsAgainst = goals?.Against ?? 0,
            GoalDifference = row.GoalsDiff,
            Points = row.Points,
            Form = row.Form,
            Description = row.Description ?? row.Status,
        };
    }

    public static TeamDto ToTeamDto(ApiSportsTeamItem item) =>
        new()
        {
            Id = item.Team?.Id ?? 0,
            Name = item.Team?.Name ?? string.Empty,
            LogoUrl = item.Team?.Logo,
            Country = item.Team?.Country,
        };

    public static TeamRosterDto? ToTeamRosterDto(ApiSportsSquadItem item, int? season)
    {
        var team = item.Team;
        if (team?.Id is null or 0)
        {
            return null;
        }

        var players = item.Players?
            .Select(p => ToPlayerDtoFromSquad(p, team))
            .Where(p => p.Id > 0)
            .ToList() ?? [];

        return new TeamRosterDto
        {
            TeamId = team.Id,
            TeamName = team.Name ?? string.Empty,
            TeamLogoUrl = team.Logo,
            Season = season,
            Players = players,
        };
    }

    public static PlayerDto ToPlayerDtoFromSquad(ApiSportsSquadPlayer player, ApiSportsTeamSide? team) =>
        new()
        {
            Id = player.Id,
            Name = player.Name ?? string.Empty,
            Age = player.Age,
            PhotoUrl = player.Photo,
            TeamId = team?.Id,
            TeamName = team?.Name,
            TeamLogoUrl = team?.Logo,
            Position = player.Position,
            Number = player.Number,
        };

    public static PlayerDto? ToPlayerDto(ApiSportsPlayerProfileItem item)
    {
        var player = item.Player;
        if (player is null || player.Id <= 0)
        {
            return null;
        }

        var stats = item.Statistics?.FirstOrDefault();
        var team = stats?.Team;

        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name ?? string.Empty,
            FirstName = player.Firstname,
            LastName = player.Lastname,
            Age = player.Age,
            BirthDate = player.Birth?.Date,
            Nationality = player.Nationality,
            Height = player.Height,
            Weight = player.Weight,
            PhotoUrl = player.Photo,
            TeamId = team?.Id,
            TeamName = team?.Name,
            TeamLogoUrl = team?.Logo,
            Position = stats?.Games?.Position,
            Number = stats?.Games?.Number,
        };
    }

    private static string? FormatStatValue(object? value) =>
        value switch
        {
            null => null,
            string s => s,
            int i => i.ToString(),
            double d => d.ToString("0.##"),
            _ => value.ToString(),
        };
}
