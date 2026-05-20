namespace ScoreGuru.Application.Dtos.Sports;

public sealed class LeagueStandingsDto
{
    public int LeagueId { get; init; }

    public string LeagueName { get; init; } = string.Empty;

    public int Season { get; init; }

    public IReadOnlyList<StandingRowDto> Rows { get; init; } = [];
}
