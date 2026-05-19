namespace ScoreGuru.Application.Options;

public class ClerkOptions
{
    public const string SectionName = "Clerk";

    public string Authority { get; set; } = string.Empty;

    public string? JwksUrl { get; set; }

    public string? Audience { get; set; }
}
