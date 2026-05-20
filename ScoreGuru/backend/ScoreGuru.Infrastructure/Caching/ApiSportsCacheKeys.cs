namespace ScoreGuru.Infrastructure.Caching;

public static class ApiSportsCacheKeys
{
    public static string FootballLeagues(string? country, int? season) =>
        $"api-sports:football:leagues:{Normalize(country)}:{NormalizeSeason(season)}";

    public static string FootballLiveScores() => "api-sports:football:scores:live";

    public static string FootballTodayScores(string? date, int? league, int? season) =>
        $"api-sports:football:scores:today:{Normalize(date)}:{Normalize(league)}:{NormalizeSeason(season)}";

    public static string FootballGame(int gameId) => $"api-sports:football:games:{gameId}";

    public static string FootballStandings(int league, int season) =>
        $"api-sports:football:standings:{league}:{season}";

    public static string FootballTeams(int? league, int? season, string? country) =>
        $"api-sports:football:teams:{Normalize(league)}:{NormalizeSeason(season)}:{Normalize(country)}";

    private static string Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? "_" : value.Trim().ToLowerInvariant();

    private static string Normalize(int? value) => value?.ToString() ?? "_";

    private static string NormalizeSeason(int? value) => value?.ToString() ?? "_";
}
