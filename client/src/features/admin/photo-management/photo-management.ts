import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { Photo } from '../../../types/member';

@Component({
  selector: 'app-photo-management',
  imports: [],
  templateUrl: './photo-management.html',
  styleUrl: './photo-management.css'
})
export class PhotoManagement implements OnInit{
  private adminService = inject(AdminService);
  protected photos = signal<Photo[]>([]);
  
  ngOnInit(): void {
    this.adminService.getPhotosForApproval().subscribe({
      next: res => this.photos.set(res),
      error: err => console.log(err)
    })
  }

  accpetPhoto(photoId: number){
    this.adminService.approvePhoto(photoId).subscribe({
      next: () => this.photos.update(photos => photos.filter(photo => photo.id !== photoId)),
      error: err => console.log(err)
    })
  }

  rejectPhoto(photoId: number){
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () => this.photos.update(photos => photos.filter(photo => photo.id !== photoId)),
      error: err => console.log(err)
    })
  }
}
