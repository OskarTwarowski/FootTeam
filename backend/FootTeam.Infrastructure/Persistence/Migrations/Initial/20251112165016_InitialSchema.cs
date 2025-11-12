using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootTeam.Infrastructure.Persistence.Migrations.Initial
{
    /// <inheritdoc />
    public partial class InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This is a no-op migration that will only create the migrations history table
            // The actual database tables already exist
            
            // Ensure the database uses UTF8MB4 character set
            migrationBuilder.Sql("""
                SET NAMES utf8mb4;
                ALTER DATABASE CHARACTER SET utf8mb4;
            """);
            
            // No need to create tables as they already exist in the database
            // The migration will be recorded in the __EFMigrationsHistory table
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This is a no-op migration, so there's nothing to do on Down
            // The tables should not be dropped as they existed before the migration
        }
    }
}
