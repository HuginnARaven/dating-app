import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { MemberService } from '../../../core/services/member-service';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accoundService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const membetId = this.route.parent?.snapshot.paramMap.get('id');
    if (membetId) {
      this.memberService.getMemberPhotos(membetId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.eidtMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
        if(!this.memberService.member()?.imageUrl){
          this.setMainPhotoLocal(photo);
        } 
      },
      error: (err) => {
        console.log('Error uploading image: ', err);
        this.loading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainPhotoLocal(photo);
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhto(photo).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id !== photo.id));
      },
    });
  }

  private setMainPhotoLocal(photo: Photo) {
    const currentUser = this.accoundService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accoundService.setCurrentUser(currentUser as User);
    this.memberService.member.update((member) => 
      ({
          ...member,
          imageUrl: photo.url,
        } as Member)
    );
  }
}
