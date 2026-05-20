namespace ScoreGuru.Application.Dtos.Sports;

public sealed class GameEventDto
{
    public int? TimeElapsed { get; init; }

    public int? TeamId { get; init; }

    public string? TeamName { get; init; }

    public string? PlayerName { get; init; }

    public string? AssistName { get; init; }

    public string? Type { get; init; }

    public string? Detail { get; init; }

    public string? Comments { get; init; }
}
