using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Application.Options;

namespace ScoreGuru.Infrastructure.Providers.ApiSports;

public static class FootballScoreProviderRegistration
{
    public static IServiceCollection AddFootballScoreProvider(this IServiceCollection services)
    {
        services.AddScoped<ApiSportsFootballProvider>();
        services.AddScoped<MockFootballScoreProvider>();
        services.AddScoped<IFootballScoreProvider>(sp => ResolveProvider(sp));
        return services;
    }

    private static IFootballScoreProvider ResolveProvider(IServiceProvider sp)
    {
        var options = sp.GetRequiredService<IOptions<ApiSportsOptions>>().Value;
        var environment = sp.GetRequiredService<IHostEnvironment>();

        if (!string.IsNullOrWhiteSpace(options.ApiKey))
        {
            return sp.GetRequiredService<ApiSportsFootballProvider>();
        }

        if (environment.IsDevelopment() && options.UseMockDataWhenMissingKey)
        {
            return sp.GetRequiredService<MockFootballScoreProvider>();
        }

        throw new InvalidOperationException(
            "ApiSports:ApiKey is required. Set the key via user secrets or environment variable ApiSports__ApiKey.");
    }
}
