import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../../types/message';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMesages(container:string, pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append('container', container);
    params = params.append('pageSize', pageSize);
    params = params.append('pageNumber', pageNumber);

    return this.http.get<PaginatedResult<Message>>(`${this.baseUrl}messages`, {params: params})
  }

  getMesageThread(memberId: string){
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${memberId}`)
  }

  sendMessage(recipientId: string, content: string){
    return this.http.post<Message>(`${this.baseUrl}messages`, {recipientId: recipientId, content: content})
  }

  deleteMessage(id: string){
    return this.http.delete(`${this.baseUrl}messages/${id}`)
  }
}
