using ScoreGuru.Application.Dtos.Auth;
using ScoreGuru.Application.Dtos.Users;

namespace ScoreGuru.Application.Abstractions;

public interface IUserProfileService
{
    Task<MeProfileDto> GetProfileAsync(CancellationToken cancellationToken = default);

    Task<MeProfileDto> UpdateProfileAsync(
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default);

    Task<MeProfileDto> UpdateThemeAsync(
        UpdateThemeRequest request,
        CancellationToken cancellationToken = default);
}
