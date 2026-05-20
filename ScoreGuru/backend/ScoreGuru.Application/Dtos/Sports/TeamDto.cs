namespace ScoreGuru.Application.Dtos.Sports;

public sealed class TeamDto
{
    public int Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? LogoUrl { get; init; }

    public string? Country { get; init; }
}
