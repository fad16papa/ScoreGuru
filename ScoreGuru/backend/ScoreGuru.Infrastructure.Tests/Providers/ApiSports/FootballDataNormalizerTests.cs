using ScoreGuru.Infrastructure.Providers.ApiSports;
using Xunit;
using ScoreGuru.Infrastructure.Providers.ApiSports.Models;

namespace ScoreGuru.Infrastructure.Tests.Providers.ApiSports;

public class FootballDataNormalizerTests
{
    [Fact]
    public void ToGameSummaryDto_MapsFixtureFields()
    {
        var item = new ApiSportsFixtureItem
        {
            Fixture = new ApiSportsFixtureInfo
            {
                Id = 42,
                Date = new DateTime(2024, 5, 20, 15, 0, 0, DateTimeKind.Utc),
                Status = new ApiSportsFixtureStatus
                {
                    Long = "Match Finished",
                    Short = "FT",
                    Elapsed = 90,
                },
                Venue = new ApiSportsVenue { Name = "Test Arena", City = "London" },
            },
            League = new ApiSportsFixtureLeagueInfo
            {
                Id = 39,
                Name = "Premier League",
                Logo = "https://logo.example/league.png",
                Season = 2024,
            },
            Teams = new ApiSportsFixtureTeams
            {
                Home = new ApiSportsTeamSide { Id = 1, Name = "Home FC", Logo = "https://logo.example/home.png" },
                Away = new ApiSportsTeamSide { Id = 2, Name = "Away FC", Logo = "https://logo.example/away.png" },
            },
            Goals = new ApiSportsGoals { Home = 2, Away = 1 },
        };

        var dto = FootballDataNormalizer.ToGameSummaryDto(item);

        Assert.Equal(42, dto.Id);
        Assert.Equal("football", dto.SportKey);
        Assert.Equal(39, dto.LeagueId);
        Assert.Equal("Premier League", dto.LeagueName);
        Assert.Equal("FT", dto.StatusShort);
        Assert.Equal(2, dto.HomeScore);
        Assert.Equal(1, dto.AwayScore);
        Assert.Equal("Home FC", dto.HomeTeamName);
        Assert.Equal("Away FC", dto.AwayTeamName);
        Assert.Equal("Test Arena", dto.VenueName);
    }

    [Fact]
    public void NormalizeStatistics_PairsHomeAndAwayByIndex()
    {
        var items = new List<ApiSportsFixtureStatisticsItem>
        {
            new()
            {
                Team = new ApiSportsTeamSide { Id = 1, Name = "Home FC" },
                Statistics =
                [
                    new ApiSportsStatisticEntry { Type = "Shots on Goal", Value = 5 },
                ],
            },
            new()
            {
                Team = new ApiSportsTeamSide { Id = 2, Name = "Away FC" },
                Statistics =
                [
                    new ApiSportsStatisticEntry { Type = "Shots on Goal", Value = 3 },
                ],
            },
        };

        var stats = FootballDataNormalizer.NormalizeStatistics(items);

        Assert.Single(stats);
        Assert.Equal("Shots on Goal", stats[0].Label);
        Assert.Equal("5", stats[0].HomeValue);
        Assert.Equal("3", stats[0].AwayValue);
    }

    [Fact]
    public void ToStandingRowDto_MapsRecordFields()
    {
        var row = new ApiSportsStandingRow
        {
            Rank = 1,
            Team = new ApiSportsTeamSide { Id = 10, Name = "Leaders FC" },
            Points = 30,
            GoalsDiff = 15,
            Form = "WWWWW",
            Description = "Promotion",
            All = new ApiSportsStandingRecord
            {
                Played = 10,
                Win = 9,
                Draw = 1,
                Lose = 0,
                Goals = new ApiSportsStandingGoals { For = 25, Against = 10 },
            },
        };

        var dto = FootballDataNormalizer.ToStandingRowDto(row);

        Assert.Equal(1, dto.Rank);
        Assert.Equal(10, dto.TeamId);
        Assert.Equal(30, dto.Points);
        Assert.Equal(25, dto.GoalsFor);
        Assert.Equal(10, dto.GoalsAgainst);
        Assert.Equal(15, dto.GoalDifference);
        Assert.Equal("Promotion", dto.Description);
    }
}
