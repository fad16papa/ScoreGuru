namespace ScoreGuru.Application.Dtos.Sports;

public sealed class CountryDto
{
    public string Name { get; init; } = string.Empty;

    public string? Code { get; init; }

    public string? FlagUrl { get; init; }
}
