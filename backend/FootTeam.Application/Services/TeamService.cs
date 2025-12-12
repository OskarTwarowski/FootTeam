using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using System.Security.Cryptography;

namespace FootTeam.Application.Services;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teamRepository;

    public TeamService(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }

    public async Task<IEnumerable<Team>> GetTeamsAsync(CancellationToken ct = default)
    {
        return await _teamRepository.ListAsync(ct);
    }

    public async Task<Team?> GetTeamByIdAsync(int id, CancellationToken ct = default)
    {
        return await _teamRepository.GetAsync(id, ct);
    }

    public async Task<Team> CreateTeamAsync(Team team, CancellationToken ct = default)
    {
        // Generate a unique alphanumeric TeamCode (length 8) and ensure uniqueness
        team.TeamCode = await GenerateUniqueTeamCodeAsync(8, ct);
        return await _teamRepository.CreateAsync(team, ct);
    }

    public async Task<bool> UpdateTeamAsync(Team team, CancellationToken ct = default)
    {
        var updatedTeam = await _teamRepository.UpdateAsync(team, ct);
        return updatedTeam != null;
    }

    public async Task<bool> DeleteTeamAsync(int id, CancellationToken ct = default)
    {
        return await _teamRepository.DeleteAsync(id, ct);
    }

    public async Task<IEnumerable<Player>> GetTeamPlayersAsync(int teamId, CancellationToken ct = default)
    {
        return await _teamRepository.GetPlayersByTeamIdAsync(teamId, ct);
    }

    private async Task<string> GenerateUniqueTeamCodeAsync(int length, CancellationToken ct)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        while (true)
        {
            var code = GenerateRandomString(chars, length);
            var exists = await _teamRepository.TeamCodeExistsAsync(code, ct);
            if (!exists) return code;
        }
    }

    private static string GenerateRandomString(string alphabet, int length)
    {
        var bytes = new byte[length];
        RandomNumberGenerator.Fill(bytes);
        var result = new char[length];
        for (int i = 0; i < length; i++)
        {
            result[i] = alphabet[bytes[i] % alphabet.Length];
        }
        return new string(result);
    }
}
