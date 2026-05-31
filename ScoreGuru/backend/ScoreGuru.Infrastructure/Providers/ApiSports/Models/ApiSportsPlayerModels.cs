using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsSquadItem
{
    [JsonPropertyName("team")]
    public ApiSportsTeamSide? Team { get; init; }

    [JsonPropertyName("players")]
    public List<ApiSportsSquadPlayer>? Players { get; init; }
}

public sealed class ApiSportsSquadPlayer
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("age")]
    public int? Age { get; init; }

    [JsonPropertyName("number")]
    public int? Number { get; init; }

    [JsonPropertyName("position")]
    public string? Position { get; init; }

    [JsonPropertyName("photo")]
    public string? Photo { get; init; }
}

public sealed class ApiSportsPlayerProfileItem
{
    [JsonPropertyName("player")]
    public ApiSportsPlayerInfo? Player { get; init; }

    [JsonPropertyName("statistics")]
    public List<ApiSportsPlayerStatistics>? Statistics { get; init; }
}

public sealed class ApiSportsPlayerInfo
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("firstname")]
    public string? Firstname { get; init; }

    [JsonPropertyName("lastname")]
    public string? Lastname { get; init; }

    [JsonPropertyName("age")]
    public int? Age { get; init; }

    [JsonPropertyName("birth")]
    public ApiSportsPlayerBirth? Birth { get; init; }

    [JsonPropertyName("nationality")]
    public string? Nationality { get; init; }

    [JsonPropertyName("height")]
    public string? Height { get; init; }

    [JsonPropertyName("weight")]
    public string? Weight { get; init; }

    [JsonPropertyName("photo")]
    public string? Photo { get; init; }
}

public sealed class ApiSportsPlayerBirth
{
    [JsonPropertyName("date")]
    public string? Date { get; init; }
}

public sealed class ApiSportsPlayerStatistics
{
    [JsonPropertyName("team")]
    public ApiSportsTeamSide? Team { get; init; }

    [JsonPropertyName("games")]
    public ApiSportsPlayerGames? Games { get; init; }
}

public sealed class ApiSportsPlayerGames
{
    [JsonPropertyName("position")]
    public string? Position { get; init; }

    [JsonPropertyName("number")]
    public int? Number { get; init; }
}
