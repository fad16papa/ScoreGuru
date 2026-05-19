namespace ScoreGuru.Application.Dtos.Users;

public sealed class UpdateUserProfileRequest
{
    public string? FirstName { get; init; }

    public string? LastName { get; init; }

    public string? Country { get; init; }

    public string? PreferredSports { get; init; }

    public string? PreferredLeagues { get; init; }

    public string? TimeZone { get; init; }

    public string? Language { get; init; }
}
