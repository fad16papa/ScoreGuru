namespace ScoreGuru.Application.Dtos.Sports;

public sealed class StandingRowDto
{
    public int Rank { get; init; }

    public int TeamId { get; init; }

    public string TeamName { get; init; } = string.Empty;

    public string? TeamLogoUrl { get; init; }

    public int Played { get; init; }

    public int Wins { get; init; }

    public int Draws { get; init; }

    public int Losses { get; init; }

    public int GoalsFor { get; init; }

    public int GoalsAgainst { get; init; }

    public int GoalDifference { get; init; }

    public int Points { get; init; }

    public string? Form { get; init; }

    public string? Description { get; init; }
}
