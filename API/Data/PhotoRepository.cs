using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class PhotoRepository(AppDbContext context) : IPhotoRepository
{
    public async Task<Photo?> GetPhotoById(string photoId)
    {
        return await context.Photos.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == int.Parse(photoId));
    }

    public async Task<IReadOnlyList<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.Photos.IgnoreQueryFilters().Where(x => !x.IsApproved).Select(PhotoExtensions.ToForApprovaDtoProjection()).ToListAsync();
    }

    public void RemovePhoto(Photo photo)
    {
        context.Photos.Remove(photo);
    }
}
