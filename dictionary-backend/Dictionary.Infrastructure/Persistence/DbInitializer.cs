using Dictionary.Domain.Entities;

namespace Dictionary.Infrastructure.Persistence;

public class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (context.Words.Any()) return;

        var words = new List<Word>
        {
            new Word { Text = "fire" },
            new Word { Text = "fireman" },
            new Word { Text = "firefly" },
            new Word { Text = "fireplace" },
            new Word { Text = "hello" },
            new Word { Text = "dictionary" },
            new Word { Text = "search" },
            new Word { Text = "backend" }
        };

        context.Words.AddRange(words);
        context.SaveChanges();
    }
}