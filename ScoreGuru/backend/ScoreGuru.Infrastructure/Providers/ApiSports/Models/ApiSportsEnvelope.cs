using System.Text.Json;
using System.Text.Json.Serialization;

namespace ScoreGuru.Infrastructure.Providers.ApiSports.Models;

public sealed class ApiSportsEnvelope<T>
{
    [JsonPropertyName("response")]
    public List<T>? Response { get; init; }

    [JsonPropertyName("errors")]
    public JsonElement? Errors { get; init; }

    /// <summary>
    /// API-SPORTS returns <c>"errors":[]</c> on success and an object when something failed.
    /// </summary>
    public bool HasErrors
    {
        get
        {
            if (Errors is not { } errors)
            {
                return false;
            }

            return errors.ValueKind switch
            {
                JsonValueKind.Null or JsonValueKind.Undefined or JsonValueKind.False => false,
                JsonValueKind.Array => errors.GetArrayLength() > 0,
                JsonValueKind.Object => errors.EnumerateObject().Any(),
                _ => true,
            };
        }
    }
}
