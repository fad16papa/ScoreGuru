using Microsoft.EntityFrameworkCore;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Dtos.Auth;
using ScoreGuru.Domain.Entities;
using ScoreGuru.Infrastructure.Persistence;

namespace ScoreGuru.Infrastructure.Services;

public sealed class AuthMeService(
    ScoreGuruDbContext dbContext,
    ICurrentUserService currentUser) : IAuthMeService
{
    public async Task<MeResponseDto> GetOrSyncCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        var clerkUserId = currentUser.GetClerkUserId()
            ?? throw new UnauthorizedAccessException("Clerk user id was not found in the token.");

        var email = currentUser.GetEmail();
        var displayName = currentUser.GetDisplayName();
        var avatarUrl = currentUser.GetAvatarUrl();
        var provider = currentUser.GetProvider();
        var now = DateTime.UtcNow;

        var user = await dbContext.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId, cancellationToken);

        if (user is null)
        {
            user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                ClerkUserId = clerkUserId,
                UserName = email ?? clerkUserId,
                Email = email,
                NormalizedEmail = email?.ToUpperInvariant(),
                NormalizedUserName = (email ?? clerkUserId).ToUpperInvariant(),
                DisplayName = displayName,
                AvatarUrl = avatarUrl,
                Provider = provider,
                IsActive = true,
                CreatedAtUtc = now,
                UpdatedAtUtc = now,
                LastLoginAtUtc = now,
                EmailConfirmed = !string.IsNullOrWhiteSpace(email),
                Profile = new UserProfile
                {
                    Id = Guid.NewGuid(),
                    CreatedAtUtc = now,
                    UpdatedAtUtc = now,
                },
            };

            user.Profile.UserId = user.Id;

            dbContext.Users.Add(user);
        }
        else
        {
            user.LastLoginAtUtc = now;
            user.UpdatedAtUtc = now;

            if (!string.IsNullOrWhiteSpace(email) && user.Email != email)
            {
                user.Email = email;
                user.NormalizedEmail = email.ToUpperInvariant();
                user.UserName = email;
                user.NormalizedUserName = email.ToUpperInvariant();
            }

            if (!string.IsNullOrWhiteSpace(displayName) && user.DisplayName != displayName)
            {
                user.DisplayName = displayName;
            }

            if (!string.IsNullOrWhiteSpace(avatarUrl) && user.AvatarUrl != avatarUrl)
            {
                user.AvatarUrl = avatarUrl;
            }

            if (!string.IsNullOrWhiteSpace(provider) && user.Provider != provider)
            {
                user.Provider = provider;
            }

            if (user.Profile is null)
            {
                user.Profile = new UserProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    CreatedAtUtc = now,
                    UpdatedAtUtc = now,
                };
                dbContext.UserProfiles.Add(user.Profile);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    private static MeResponseDto MapToDto(ApplicationUser user) =>
        new()
        {
            Id = user.Id,
            ClerkUserId = user.ClerkUserId,
            Email = user.Email,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            Profile = user.Profile is null
                ? null
                : new MeProfileDto
                {
                    FirstName = user.Profile.FirstName,
                    LastName = user.Profile.LastName,
                    Country = user.Profile.Country,
                    PreferredSports = user.Profile.PreferredSports,
                    PreferredLeagues = user.Profile.PreferredLeagues,
                    ThemePreference = user.Profile.ThemePreference,
                    TimeZone = user.Profile.TimeZone,
                    Language = user.Profile.Language,
                },
        };
}
