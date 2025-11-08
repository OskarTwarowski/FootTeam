using FootTeam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Player> Players => Set<Player>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Training> Trainings => Set<Training>();
    public DbSet<TrainingParticipant> TrainingParticipants => Set<TrainingParticipant>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Team> Teams => Set<Team>();

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
            entity.Property(e => e.UserID).HasColumnName("UserID");
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(p => p.UserID)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne<Team>()
                  .WithMany(t => t.Players)
                  .HasForeignKey(p => p.TeamID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserID);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Role).HasMaxLength(20).IsRequired();
            entity.Property(e => e.CreatedAt);
            entity.HasMany(u => u.CoachedTeams)
                  .WithOne(t => t.Coach)
                  .HasForeignKey(t => t.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
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

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Teams");
            entity.HasKey(t => t.TeamID);
            entity.Property(t => t.Name).HasMaxLength(100).IsRequired();
            entity.Property(t => t.CoachID).HasColumnName("CoachID");
            entity.HasOne<User>()
                  .WithMany(u => u.CoachedTeams)
                  .HasForeignKey(t => t.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(e => e.NotificationID);
            entity.Property(e => e.Title).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description);
            entity.Property(e => e.StartTime).IsRequired();
            entity.Property(e => e.EndTime);
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.TeamID);
            
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(n => n.CreatedBy)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne<Team>()
                  .WithMany()
                  .HasForeignKey(n => n.TeamID)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
