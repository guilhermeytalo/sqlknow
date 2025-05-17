using Dictionary.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dictionary.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>();
    
    public DbSet<Word> Words => Set<Word>();
    
    public DbSet<WordHistory> WordHistories { get; set; }
    public DbSet<Favorite> Favorites => Set<Favorite>();

}