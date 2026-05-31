namespace ScoreGuru.Application.Dtos.Sports;

public sealed class PlayerDto
{
    public int Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? FirstName { get; init; }

    public string? LastName { get; init; }

    public int? Age { get; init; }

    public string? BirthDate { get; init; }

    public string? Nationality { get; init; }

    public string? Height { get; init; }

    public string? Weight { get; init; }

    public string? PhotoUrl { get; init; }

    public int? TeamId { get; init; }

    public string? TeamName { get; init; }

    public string? TeamLogoUrl { get; init; }

    public string? Position { get; init; }

    public int? Number { get; init; }
}
