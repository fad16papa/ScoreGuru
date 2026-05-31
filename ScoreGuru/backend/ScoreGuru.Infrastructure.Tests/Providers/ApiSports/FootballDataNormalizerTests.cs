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

    [Fact]
    public void ToTeamRosterDto_MapsSquadPlayers()
    {
        var item = new ApiSportsSquadItem
        {
            Team = new ApiSportsTeamSide { Id = 33, Name = "Manchester United", Logo = "https://logo.example/team.png" },
            Players =
            [
                new ApiSportsSquadPlayer
                {
                    Id = 100,
                    Name = "Test Player",
                    Age = 25,
                    Number = 7,
                    Position = "Midfielder",
                    Photo = "https://photo.example/player.png",
                },
            ],
        };

        var roster = FootballDataNormalizer.ToTeamRosterDto(item, 2024);

        Assert.NotNull(roster);
        Assert.Equal(33, roster!.TeamId);
        Assert.Equal("Manchester United", roster.TeamName);
        Assert.Equal(2024, roster.Season);
        Assert.Single(roster.Players);
        Assert.Equal(100, roster.Players[0].Id);
        Assert.Equal("Test Player", roster.Players[0].Name);
        Assert.Equal("Midfielder", roster.Players[0].Position);
    }

    [Fact]
    public void ToPlayerDto_MapsProfileFields()
    {
        var item = new ApiSportsPlayerProfileItem
        {
            Player = new ApiSportsPlayerInfo
            {
                Id = 874,
                Name = "L. Messi",
                Firstname = "Lionel",
                Lastname = "Messi",
                Age = 36,
                Nationality = "Argentina",
                Height = "170 cm",
                Weight = "72 kg",
                Birth = new ApiSportsPlayerBirth { Date = "1987-06-24" },
            },
            Statistics =
            [
                new ApiSportsPlayerStatistics
                {
                    Team = new ApiSportsTeamSide { Id = 541, Name = "Barcelona" },
                    Games = new ApiSportsPlayerGames { Position = "Attacker", Number = 10 },
                },
            ],
        };

        var dto = FootballDataNormalizer.ToPlayerDto(item);

        Assert.NotNull(dto);
        Assert.Equal(874, dto!.Id);
        Assert.Equal("Lionel", dto.FirstName);
        Assert.Equal("Argentina", dto.Nationality);
        Assert.Equal(541, dto.TeamId);
        Assert.Equal("Attacker", dto.Position);
        Assert.Equal(10, dto.Number);
    }
}
