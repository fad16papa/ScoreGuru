namespace ScoreGuru.Application.Exceptions;

public sealed class SportsDataProviderException : Exception
{
    public SportsDataProviderException(
        string message,
        bool isRateLimited = false,
        int? providerStatusCode = null,
        Exception? innerException = null)
        : base(message, innerException)
    {
        IsRateLimited = isRateLimited;
        ProviderStatusCode = providerStatusCode;
    }

    public bool IsRateLimited { get; }

    public int? ProviderStatusCode { get; }
}
