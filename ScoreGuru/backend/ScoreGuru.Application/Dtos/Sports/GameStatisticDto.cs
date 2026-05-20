namespace ScoreGuru.Application.Dtos.Sports;

public sealed class GameStatisticDto
{
    public string Label { get; init; } = string.Empty;

    public string? HomeValue { get; init; }

    public string? AwayValue { get; init; }
}
