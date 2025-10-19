using FootTeam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Player> Players => Set<Player>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Training> Trainings => Set<Training>();
    public DbSet<TrainingParticipant> TrainingParticipants => Set<TrainingParticipant>();
    public DbSet<Event> Events => Set<Event>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Player>(entity =>
        {
            entity.ToTable("Players");
            entity.HasKey(e => e.PlayerID);
            entity.Property(e => e.PlayerID).HasColumnName("PlayerID");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.BirthDate);
            entity.Property(e => e.Position).HasMaxLength(50);
            entity.Property(e => e.Team).HasMaxLength(50);
            entity.Property(e => e.UserID).HasColumnName("UserID");
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(e => e.UserID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserID);
            entity.Property(e => e.Username).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Role).HasMaxLength(20).IsRequired();
            entity.Property(e => e.CreatedAt);
        });

        modelBuilder.Entity<Training>(entity =>
        {
            entity.ToTable("Trainings");
            entity.HasKey(e => e.TrainingID);
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Description);
            entity.Property(e => e.Location).HasMaxLength(100);
            entity.Property(e => e.StartTime);
            entity.Property(e => e.EndTime);
            entity.Property(e => e.CoachID).HasColumnName("CoachID");
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(e => e.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TrainingParticipant>(entity =>
        {
            entity.ToTable("TrainingParticipants");
            entity.HasKey(e => new { e.TrainingID, e.PlayerID });
            entity.HasOne<Training>()
                  .WithMany()
                  .HasForeignKey(e => e.TrainingID)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<Player>()
                  .WithMany()
                  .HasForeignKey(e => e.PlayerID)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("Events");
            entity.HasKey(e => e.EventID);
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Description);
            entity.Property(e => e.EventDate);
            entity.Property(e => e.Location).HasMaxLength(100);
            entity.Property(e => e.CreatedBy);
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(e => e.CreatedBy)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
