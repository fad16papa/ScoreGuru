using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ScoreGuru.Application.Options;

namespace ScoreGuru.Infrastructure.Authentication;

public static class ClerkAuthenticationExtensions
{
    public static IServiceCollection AddClerkAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var clerkSection = configuration.GetSection(ClerkOptions.SectionName);
        services.Configure<ClerkOptions>(clerkSection);

        var clerkOptions = clerkSection.Get<ClerkOptions>()
            ?? throw new InvalidOperationException("Clerk configuration section is missing.");

        if (string.IsNullOrWhiteSpace(clerkOptions.Authority))
        {
            throw new InvalidOperationException("Clerk:Authority must be configured.");
        }

        var authority = clerkOptions.Authority.TrimEnd('/');

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = authority;
                options.RequireHttpsMetadata = !authority.Contains("localhost", StringComparison.OrdinalIgnoreCase);

                if (!string.IsNullOrWhiteSpace(clerkOptions.JwksUrl))
                {
                    options.MetadataAddress = clerkOptions.JwksUrl;
                }

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authority,
                    ValidateAudience = !string.IsNullOrWhiteSpace(clerkOptions.Audience),
                    ValidAudience = clerkOptions.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.NoResult();
                        return Task.CompletedTask;
                    },
                };
            });

        services.AddAuthorization();

        return services;
    }
}
