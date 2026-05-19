using Microsoft.AspNetCore.Identity;

namespace ScoreGuru.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string ClerkUserId { get; set; } = string.Empty;

    public string? DisplayName { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Provider { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public DateTime? LastLoginAtUtc { get; set; }

    public UserProfile? Profile { get; set; }
}
