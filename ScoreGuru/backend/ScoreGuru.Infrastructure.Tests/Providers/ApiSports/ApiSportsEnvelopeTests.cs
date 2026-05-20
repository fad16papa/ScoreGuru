using System.Text.Json;
using ScoreGuru.Infrastructure.Providers.ApiSports.Models;
using Xunit;

namespace ScoreGuru.Infrastructure.Tests.Providers.ApiSports;

public class ApiSportsEnvelopeTests
{
    [Fact]
    public void HasErrors_IsFalse_WhenErrorsIsEmptyArray()
    {
        var json = """{"response":[],"errors":[]}""";
        var envelope = JsonSerializer.Deserialize<ApiSportsEnvelope<object>>(json);

        Assert.NotNull(envelope);
        Assert.False(envelope!.HasErrors);
    }

    [Fact]
    public void HasErrors_IsTrue_WhenErrorsObjectHasEntries()
    {
        var json = """{"response":[],"errors":{"requests":"Daily limit reached"}}""";
        var envelope = JsonSerializer.Deserialize<ApiSportsEnvelope<object>>(json);

        Assert.NotNull(envelope);
        Assert.True(envelope!.HasErrors);
    }
}
