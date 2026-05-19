namespace ScoreGuru.Application.Dtos.Auth;

public sealed class MeResponseDto
{
    public Guid Id { get; init; }

    public string ClerkUserId { get; init; } = string.Empty;

    public string? Email { get; init; }

    public string? DisplayName { get; init; }

    public string? AvatarUrl { get; init; }

    public bool IsActive { get; init; }

    public MeProfileDto? Profile { get; init; }
}

public sealed class MeProfileDto
{
    public string? FirstName { get; init; }

    public string? LastName { get; init; }

    public string? Country { get; init; }

    public string? PreferredSports { get; init; }

    public string? PreferredLeagues { get; init; }

    public string? ThemePreference { get; init; }

    public string? TimeZone { get; init; }

    public string? Language { get; init; }
}
