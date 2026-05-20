using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsFixtureStatisticsItem
{
    [JsonPropertyName("team")]
    public ApiSportsTeamSide? Team { get; init; }

    [JsonPropertyName("statistics")]
    public List<ApiSportsStatisticEntry>? Statistics { get; init; }
}

public sealed class ApiSportsStatisticEntry
{
    [JsonPropertyName("type")]
    public string? Type { get; init; }

    [JsonPropertyName("value")]
    public object? Value { get; init; }
}
