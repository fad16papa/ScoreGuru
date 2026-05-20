using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsTeamItem
{
    [JsonPropertyName("team")]
    public ApiSportsTeamDetail? Team { get; init; }
}

public sealed class ApiSportsTeamDetail
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("logo")]
    public string? Logo { get; init; }

    [JsonPropertyName("country")]
    public string? Country { get; init; }
}
