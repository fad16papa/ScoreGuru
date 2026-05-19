namespace ScoreGuru.Domain.Entities;

public class UserProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Country { get; set; }

    public string? PreferredSports { get; set; }

    public string? PreferredLeagues { get; set; }

    public string? ThemePreference { get; set; }

    public string? TimeZone { get; set; }

    public string? Language { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public ApplicationUser User { get; set; } = null!;
}
