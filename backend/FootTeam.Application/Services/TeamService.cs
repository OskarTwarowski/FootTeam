using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

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
}
