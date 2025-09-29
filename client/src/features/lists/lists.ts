import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { LikeParams, Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null> (null);
  protected likeParams = new LikeParams();

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'matches'},
  ]

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredcate(predicate: string){
    if (this.likeParams.predicate !== predicate){
      this.likeParams = new LikeParams();
      this.likeParams.predicate = predicate;

      this.loadLikes()
    }
  }

  onPageChange(event: {pageNumber: number, pageSize: number}){
    this.likeParams.pageSize = event.pageSize;
    this.likeParams.pageNumber = event.pageNumber;

    this.loadLikes();
  }

  loadLikes(){
    this.likesService.getLikes(this.likeParams).subscribe({
      next: members => this.paginatedMembers.set(members)
    });
  }
}

