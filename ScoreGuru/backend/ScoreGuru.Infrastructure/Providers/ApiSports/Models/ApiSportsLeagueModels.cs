using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsLeagueItem
{
    [JsonPropertyName("league")]
    public ApiSportsLeagueInfo? League { get; init; }

    [JsonPropertyName("country")]
    public ApiSportsCountryInfo? Country { get; init; }

    [JsonPropertyName("seasons")]
    public List<ApiSportsSeasonInfo>? Seasons { get; init; }
}

public sealed class ApiSportsLeagueInfo
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("logo")]
    public string? Logo { get; init; }
}

public sealed class ApiSportsCountryInfo
{
    [JsonPropertyName("name")]
    public string? Name { get; init; }
}

public sealed class ApiSportsSeasonInfo
{
    [JsonPropertyName("year")]
    public int Year { get; init; }
}
