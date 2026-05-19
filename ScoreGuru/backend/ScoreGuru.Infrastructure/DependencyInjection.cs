using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ScoreGuru.Application.Abstractions;
using ScoreGuru.Domain.Entities;
using ScoreGuru.Infrastructure.Authentication;
using ScoreGuru.Infrastructure.Identity;
using ScoreGuru.Infrastructure.Persistence;
using ScoreGuru.Infrastructure.Services;
using StackExchange.Redis;

namespace ScoreGuru.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var postgresConnection = configuration.GetConnectionString("Postgres")
            ?? throw new InvalidOperationException("ConnectionStrings:Postgres is not configured.");

        services.AddDbContext<ScoreGuruDbContext>(options =>
            options.UseNpgsql(postgresConnection));

        services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 64;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ScoreGuruDbContext>();

        var redisConnection = configuration["Redis:ConnectionString"];
        if (string.IsNullOrWhiteSpace(redisConnection))
        {
            throw new InvalidOperationException("Redis:ConnectionString is not configured.");
        }

        services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            var options = ConfigurationOptions.Parse(redisConnection);
            options.AbortOnConnectFail = false;
            return ConnectionMultiplexer.Connect(options);
        });

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthMeService, AuthMeService>();
        services.AddScoped<IUserProfileService, UserProfileService>();

        services.AddClerkAuthentication(configuration);

        return services;
    }
}
