using System;
using System.Linq.Expressions;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class PhotoExtensions
{
    public static PhotoForApprovalDto ToForApprovaDto(this Photo photo)
    {
        return new PhotoForApprovalDto
        {
            Id = photo.Id,
            Url = photo.Url,
            Username = photo.Member.User.UserName,
            IsApproved = photo.IsApproved
        };
    }

    public static Expression<Func<Photo, PhotoForApprovalDto>> ToForApprovaDtoProjection()
    {
        return photo => new PhotoForApprovalDto
        {
            Id = photo.Id,
            Url = photo.Url,
            Username = photo.Member.User.UserName,
            IsApproved = photo.IsApproved
        };
    }
}
