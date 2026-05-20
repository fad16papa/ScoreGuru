using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsStandingsItem
{
    [JsonPropertyName("league")]
    public ApiSportsStandingsLeague? League { get; init; }
}

public sealed class ApiSportsStandingsLeague
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("season")]
    public int Season { get; init; }

    [JsonPropertyName("standings")]
    public List<List<ApiSportsStandingRow>>? Standings { get; init; }
}

public sealed class ApiSportsStandingRow
{
    [JsonPropertyName("rank")]
    public int Rank { get; init; }

    [JsonPropertyName("team")]
    public ApiSportsTeamSide? Team { get; init; }

    [JsonPropertyName("points")]
    public int Points { get; init; }

    [JsonPropertyName("goalsDiff")]
    public int GoalsDiff { get; init; }

    [JsonPropertyName("group")]
    public string? Group { get; init; }

    [JsonPropertyName("form")]
    public string? Form { get; init; }

    [JsonPropertyName("status")]
    public string? Status { get; init; }

    [JsonPropertyName("description")]
    public string? Description { get; init; }

    [JsonPropertyName("all")]
    public ApiSportsStandingRecord? All { get; init; }
}

public sealed class ApiSportsStandingRecord
{
    [JsonPropertyName("played")]
    public int Played { get; init; }

    [JsonPropertyName("win")]
    public int Win { get; init; }

    [JsonPropertyName("draw")]
    public int Draw { get; init; }

    [JsonPropertyName("lose")]
    public int Lose { get; init; }

    [JsonPropertyName("goals")]
    public ApiSportsStandingGoals? Goals { get; init; }
}

public sealed class ApiSportsStandingGoals
{
    [JsonPropertyName("for")]
    public int? For { get; init; }

    [JsonPropertyName("against")]
    public int? Against { get; init; }
}
