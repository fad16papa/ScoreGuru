namespace ScoreGuru.Application.Abstractions;

public interface ICurrentUserService
{
    bool IsAuthenticated { get; }

    string? GetClerkUserId();

    string? GetEmail();

    string? GetDisplayName();

    string? GetAvatarUrl();

    string? GetProvider();
}
