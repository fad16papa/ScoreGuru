using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ScoreGuru.Domain.Entities;

namespace ScoreGuru.Infrastructure.Persistence;

public class ScoreGuruDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ScoreGuruDbContext(DbContextOptions<ScoreGuruDbContext> options)
        : base(options)
    {
    }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.ClerkUserId)
                .HasMaxLength(128)
                .IsRequired();

            entity.Property(u => u.DisplayName).HasMaxLength(256);
            entity.Property(u => u.AvatarUrl).HasMaxLength(2048);
            entity.Property(u => u.Provider).HasMaxLength(64);

            entity.HasIndex(u => u.ClerkUserId).IsUnique();
        });

        builder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.FirstName).HasMaxLength(128);
            entity.Property(p => p.LastName).HasMaxLength(128);
            entity.Property(p => p.Country).HasMaxLength(128);
            entity.Property(p => p.PreferredSports).HasMaxLength(512);
            entity.Property(p => p.PreferredLeagues).HasMaxLength(512);
            entity.Property(p => p.ThemePreference).HasMaxLength(32);
            entity.Property(p => p.TimeZone).HasMaxLength(64);
            entity.Property(p => p.Language).HasMaxLength(16);

            entity.HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(p => p.UserId).IsUnique();
        });
    }
}
