using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsFixtureItem
{
    [JsonPropertyName("fixture")]
    public ApiSportsFixtureInfo? Fixture { get; init; }

    [JsonPropertyName("league")]
    public ApiSportsFixtureLeagueInfo? League { get; init; }

    [JsonPropertyName("teams")]
    public ApiSportsFixtureTeams? Teams { get; init; }

    [JsonPropertyName("goals")]
    public ApiSportsGoals? Goals { get; init; }
}

public sealed class ApiSportsFixtureInfo
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("date")]
    public DateTime Date { get; init; }

    [JsonPropertyName("status")]
    public ApiSportsFixtureStatus? Status { get; init; }

    [JsonPropertyName("venue")]
    public ApiSportsVenue? Venue { get; init; }
}

public sealed class ApiSportsFixtureStatus
{
    [JsonPropertyName("long")]
    public string? Long { get; init; }

    [JsonPropertyName("short")]
    public string? Short { get; init; }

    [JsonPropertyName("elapsed")]
    public int? Elapsed { get; init; }
}

public sealed class ApiSportsVenue
{
    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("city")]
    public string? City { get; init; }
}

public sealed class ApiSportsFixtureLeagueInfo
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("logo")]
    public string? Logo { get; init; }

    [JsonPropertyName("season")]
    public int? Season { get; init; }
}

public sealed class ApiSportsFixtureTeams
{
    [JsonPropertyName("home")]
    public ApiSportsTeamSide? Home { get; init; }

    [JsonPropertyName("away")]
    public ApiSportsTeamSide? Away { get; init; }
}

public sealed class ApiSportsTeamSide
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("logo")]
    public string? Logo { get; init; }
}

public sealed class ApiSportsGoals
{
    [JsonPropertyName("home")]
    public int? Home { get; init; }

    [JsonPropertyName("away")]
    public int? Away { get; init; }
}
