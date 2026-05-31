namespace ScoreGuru.Application.Dtos.Sports;

public sealed class TeamRosterDto
{
    public int TeamId { get; init; }

    public string TeamName { get; init; } = string.Empty;

    public string? TeamLogoUrl { get; init; }

    public int? Season { get; init; }

    public IReadOnlyList<PlayerDto> Players { get; init; } = [];
}
