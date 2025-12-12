using FootTeam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Player> Players => Set<Player>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Training> Trainings => Set<Training>();
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
            // Columns BirthDate and Position do not exist in current MySQL schema
            entity.Ignore(e => e.BirthDate);
            entity.Ignore(e => e.Position);
            entity.Property(e => e.PhoneNumber)
                  .HasColumnName("Phone")
                  .HasConversion(
                      v => string.IsNullOrWhiteSpace(v) ? (int?)null : int.Parse(new string(v.Where(char.IsDigit).ToArray())),
                      v => v.HasValue ? v.Value.ToString() : null);
            entity.Property(e => e.UserID).HasColumnName("UserID");
            
            
            entity.HasOne(p => p.User)
                  .WithMany()
                  .HasForeignKey(p => p.UserID)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(p => p.Team)
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
            // DB schema does not define a one-to-one User↔Player; avoid shadow FK (UserID1)
            entity.Ignore(u => u.Player);
            entity.HasMany(u => u.CoachedTeams)
                  .WithOne(t => t.Coach)
                  .HasForeignKey(t => t.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Training>(entity =>
        {
            entity.ToTable("Trainings");
            entity.HasKey(e => e.TrainingID);
            entity.Property(e => e.TrainingID).HasColumnName("TrainingID");
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Description).HasColumnType("TEXT");
            // Location column does not exist in DB schema
            entity.Ignore(e => e.Location);
            entity.Property(e => e.StartTime);
            entity.Property(e => e.EndTime);
            entity.Property(e => e.CoachID).HasColumnName("CoachID");
            entity.Property(e => e.TeamID).HasColumnName("TeamID");
            
            entity.HasOne(t => t.Coach)
                  .WithMany(u => u.CoachedTrainings)
                  .HasForeignKey(t => t.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(t => t.Team)
                  .WithMany(t => t.Trainings)
                  .HasForeignKey(t => t.TeamID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // TrainingParticipants table does not exist in current DB schema; no mapping

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Teams");
            entity.HasKey(e => e.TeamID);
            entity.Property(e => e.TeamID).HasColumnName("TeamID");
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CoachID).HasColumnName("CoachID");
            entity.Property(e => e.TeamCode).HasColumnName("TeamCode").HasMaxLength(12).IsRequired();
            entity.HasIndex(e => e.TeamCode).IsUnique();
            
            entity.HasOne(t => t.Coach)
                  .WithMany(u => u.CoachedTeams)
                  .HasForeignKey(t => t.CoachID)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(e => e.NotificationID);
            entity.Property(e => e.NotificationID).HasColumnName("NotificationID");
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Description).HasColumnType("TEXT");
            entity.Property(e => e.StartTime);
            entity.Property(e => e.EndTime);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.TeamID).HasColumnName("TeamID");
            
            entity.HasOne(n => n.Creator)
                  .WithMany(u => u.CreatedNotifications)
                  .HasForeignKey(n => n.CreatedBy)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(n => n.Team)
                  .WithMany(t => t.Notifications)
                  .HasForeignKey(n => n.TeamID)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
