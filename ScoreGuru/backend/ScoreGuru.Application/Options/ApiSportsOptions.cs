namespace ScoreGuru.Application.Options;

public sealed class ApiSportsOptions
{
    public const string SectionName = "ApiSports";

    public string FootballBaseUrl { get; set; } = "https://v3.football.api-sports.io";

    public string ApiKey { get; set; } = string.Empty;

    public int RequestTimeoutSeconds { get; set; } = 15;

    /// <summary>
    /// When true and <see cref="ApiKey"/> is empty, Development uses mock football data.
    /// </summary>
    public bool UseMockDataWhenMissingKey { get; set; }
}
