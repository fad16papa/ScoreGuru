using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsCountryItem
{
    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("code")]
    public string? Code { get; init; }

    [JsonPropertyName("flag")]
    public string? Flag { get; init; }
}
