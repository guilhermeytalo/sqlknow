using System.ComponentModel;

namespace Dictionary.Application.DTOs;

public class DictionaryEntryDto
{
    public string Word { get; set; }
    public string Phonetic { get; set; }
    public List<Phonetic> Phonetics { get; set; }
    public List<Meaning> Meanings { get; set; }
    public License License { get; set; }
    public List<string> SourceUrls { get; set; }
}

public class Phonetic
{
    public string Text { get; set; }
    public string Audio { get; set; }
}

public class Meaning
{
    public string PartOfSpeech { get; set; }
    public List<Definition> Definitions { get; set; }
}

public class Definition
{
    public string DefinitionText { get; set; }
    public string Example { get; set; }
}

public class License
{
    public string Name { get; set; }
    public string Url { get; set; }
}