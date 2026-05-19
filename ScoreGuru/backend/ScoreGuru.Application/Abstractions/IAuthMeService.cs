using ScoreGuru.Application.Dtos.Auth;

namespace ScoreGuru.Application.Abstractions;

public interface IAuthMeService
{
    Task<MeResponseDto> GetOrSyncCurrentUserAsync(CancellationToken cancellationToken = default);
}
