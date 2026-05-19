using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ScoreGuru.Application.Abstractions;

namespace ScoreGuru.Infrastructure.Identity;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

    public string? GetClerkUserId() =>
        User?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User?.FindFirstValue("sub");

    public string? GetEmail() =>
        User?.FindFirstValue(ClaimTypes.Email)
        ?? User?.FindFirstValue("email");

    public string? GetDisplayName() =>
        User?.FindFirstValue("name")
        ?? User?.FindFirstValue(ClaimTypes.Name);

    public string? GetAvatarUrl() =>
        User?.FindFirstValue("picture")
        ?? User?.FindFirstValue("avatar_url");

    public string? GetProvider() =>
        User?.FindFirstValue("provider")
        ?? User?.FindFirstValue("oauth_provider");
}
