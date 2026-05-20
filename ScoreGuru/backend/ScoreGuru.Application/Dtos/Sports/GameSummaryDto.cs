namespace ScoreGuru.Application.Dtos.Sports;

public sealed class GameSummaryDto
{
    public int Id { get; init; }

    public string SportKey { get; init; } = "football";

    public int LeagueId { get; init; }

    public string LeagueName { get; init; } = string.Empty;

    public string? LeagueLogoUrl { get; init; }

    public int? Season { get; init; }

    public DateTime DateUtc { get; init; }

    public string Status { get; init; } = string.Empty;

    public string StatusShort { get; init; } = string.Empty;

    public int? Elapsed { get; init; }

    public int HomeTeamId { get; init; }

    public string HomeTeamName { get; init; } = string.Empty;

    public string? HomeTeamLogoUrl { get; init; }

    public int AwayTeamId { get; init; }

    public string AwayTeamName { get; init; } = string.Empty;

    public string? AwayTeamLogoUrl { get; init; }

    public int? HomeScore { get; init; }

    public int? AwayScore { get; init; }

    public string? VenueName { get; init; }

    public string? VenueCity { get; init; }
}
