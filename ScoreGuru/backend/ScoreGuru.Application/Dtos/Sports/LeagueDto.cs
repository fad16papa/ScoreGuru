namespace ScoreGuru.Application.Dtos.Sports;

public sealed class LeagueDto
{
    public int Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? LogoUrl { get; init; }

    public string? Country { get; init; }

    public int? Season { get; init; }

    public string SportKey { get; init; } = "football";
}
