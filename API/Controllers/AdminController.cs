using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager, IUnitOfWork uow, IPhotoService photoService) : BaseApiController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users.OrderBy(x => x.Email).ToListAsync();
        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.Email,
                Roles = roles.ToList()
            });
        }

        return Ok(userList);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{userId}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userId, [FromQuery]string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
        var selectedRoles = roles.Split(",").ToArray();
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest("Could not retrive user");
        var userRoles = await userManager.GetRolesAsync(user);

        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Failed to add to roles");

        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest("Failed to remove from roles");

        return Ok(await userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public async Task<ActionResult<IEnumerable<PhotoForApprovalDto>>> GetPhotosForModeration()
    {
        return Ok(await uow.PhotoRepository.GetUnapprovedPhotos());
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("photos-to-moderate/{photoId}/approve")]
    public async Task<ActionResult> ApprovePhoto(string photoId)
    {
        var photo = await uow.PhotoRepository.GetPhotoById(photoId);
        if (photo == null) return BadRequest("Photo with such Id does not exists");
        var member = await uow.MemberRepository.GetMemberForUpdate(photo.MemberId);
        if (member == null) return BadRequest("Member with such photo does not exists");

        photo.IsApproved = true;
        if (member.ImageUrl == null)
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }

        if (await uow.Complete()) return Ok();
        return BadRequest("Problem with approving photo");
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpDelete("photos-to-moderate/{photoId}/reject")]
    public async Task<ActionResult> RejectPhoto(string photoId)
    {
        var photo = await uow.PhotoRepository.GetPhotoById(photoId);
        if (photo == null) return BadRequest("Photo with such Id does not exists");

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }
        
        uow.PhotoRepository.RemovePhoto(photo);

        if (await uow.Complete()) return NoContent();
        return BadRequest("Problem with deleting photo");
    }
}
 