namespace ScoreGuru.Infrastructure.Caching;

public static class ApiSportsCacheDurations
{
    public static readonly TimeSpan LiveScores = TimeSpan.FromSeconds(20);

    public static readonly TimeSpan TodayScores = TimeSpan.FromSeconds(60);

    public static readonly TimeSpan GameDetailsLive = TimeSpan.FromSeconds(30);

    public static readonly TimeSpan GameDetailsFinished = TimeSpan.FromMinutes(15);

    public static readonly TimeSpan Standings = TimeSpan.FromMinutes(15);

    public static readonly TimeSpan Leagues = TimeSpan.FromHours(12);

    public static readonly TimeSpan Countries = TimeSpan.FromHours(24);

    public static readonly TimeSpan Teams = TimeSpan.FromHours(12);

    public static readonly TimeSpan TeamRoster = TimeSpan.FromHours(12);

    public static readonly TimeSpan Players = TimeSpan.FromHours(12);

    public static TimeSpan ForGameStatus(string? statusShort)
    {
        if (IsFinished(statusShort))
        {
            return GameDetailsFinished;
        }

        return GameDetailsLive;
    }

    public static bool IsFinished(string? statusShort) =>
        statusShort is "FT" or "AET" or "PEN" or "AWD" or "WO" or "CANC" or "ABD" or "PST";
}
