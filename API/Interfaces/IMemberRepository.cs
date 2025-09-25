using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Uppdate(Member member);
    Task<bool> SaveAllAsync();
    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
    Task<Member?> GetMemberById(string id);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}
