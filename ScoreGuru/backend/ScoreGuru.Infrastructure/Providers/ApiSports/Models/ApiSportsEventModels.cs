using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsFixtureEventItem
{
    [JsonPropertyName("time")]
    public ApiSportsEventTime? Time { get; init; }

    [JsonPropertyName("team")]
    public ApiSportsTeamSide? Team { get; init; }

    [JsonPropertyName("player")]
    public ApiSportsEventPerson? Player { get; init; }

    [JsonPropertyName("assist")]
    public ApiSportsEventPerson? Assist { get; init; }

    [JsonPropertyName("type")]
    public string? Type { get; init; }

    [JsonPropertyName("detail")]
    public string? Detail { get; init; }

    [JsonPropertyName("comments")]
    public string? Comments { get; init; }
}

public sealed class ApiSportsEventTime
{
    [JsonPropertyName("elapsed")]
    public int? Elapsed { get; init; }
}

public sealed class ApiSportsEventPerson
{
    [JsonPropertyName("name")]
    public string? Name { get; init; }
}
