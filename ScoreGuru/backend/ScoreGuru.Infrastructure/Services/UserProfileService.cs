using Microsoft.EntityFrameworkCore;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Dtos.Auth;
using ScoreGuru.Application.Dtos.Users;
using ScoreGuru.Infrastructure.Persistence;

namespace ScoreGuru.Infrastructure.Services;

public sealed class UserProfileService(
    ScoreGuruDbContext dbContext,
    ICurrentUserService currentUser) : IUserProfileService
{
    public async Task<MeProfileDto> GetProfileAsync(CancellationToken cancellationToken = default)
    {
        var profile = await GetProfileEntityAsync(cancellationToken);
        return MapToDto(profile);
    }

    public async Task<MeProfileDto> UpdateProfileAsync(
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var profile = await GetProfileEntityAsync(cancellationToken);
        var now = DateTime.UtcNow;

        profile.FirstName = request.FirstName ?? profile.FirstName;
        profile.LastName = request.LastName ?? profile.LastName;
        profile.Country = request.Country ?? profile.Country;
        profile.PreferredSports = request.PreferredSports ?? profile.PreferredSports;
        profile.PreferredLeagues = request.PreferredLeagues ?? profile.PreferredLeagues;
        profile.TimeZone = request.TimeZone ?? profile.TimeZone;
        profile.Language = request.Language ?? profile.Language;
        profile.UpdatedAtUtc = now;

        await dbContext.SaveChangesAsync(cancellationToken);
        return MapToDto(profile);
    }

    public async Task<MeProfileDto> UpdateThemeAsync(
        UpdateThemeRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.ThemePreference))
        {
            throw new ArgumentException("Theme preference is required.", nameof(request));
        }

        var profile = await GetProfileEntityAsync(cancellationToken);
        profile.ThemePreference = request.ThemePreference.Trim();
        profile.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return MapToDto(profile);
    }

    private async Task<Domain.Entities.UserProfile> GetProfileEntityAsync(CancellationToken cancellationToken)
    {
        var clerkUserId = currentUser.GetClerkUserId()
            ?? throw new UnauthorizedAccessException("Clerk user id was not found in the token.");

        var user = await dbContext.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("User was not found. Call GET /api/auth/me first.");

        if (user.Profile is null)
        {
            throw new InvalidOperationException("User profile was not found. Call GET /api/auth/me first.");
        }

        return user.Profile;
    }

    private static MeProfileDto MapToDto(Domain.Entities.UserProfile profile) =>
        new()
        {
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Country = profile.Country,
            PreferredSports = profile.PreferredSports,
            PreferredLeagues = profile.PreferredLeagues,
            ThemePreference = profile.ThemePreference,
            TimeZone = profile.TimeZone,
            Language = profile.Language,
        };
}
