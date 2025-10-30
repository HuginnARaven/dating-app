import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrls = environment.apiUrl;
  private http = inject(HttpClient);

  getUserWithRoles(){
    return this.http.get<User[]>(this.baseUrls + 'admin/users-with-roles');
  }

  updateUserRoles(userId: string, roles:string[]){
    return this.http.post<string[]>(this.baseUrls + 'admin/edit-roles/' + userId + '?roles=' + roles, {})
  }
}
