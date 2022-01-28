import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }
  getPostList(){
    return this.http.get<any>(environment.baseUrl + `/posts`);
  }
  updatePost(post_id:any,postData:any){
    return this.http.put<any>(environment.baseUrl + `/posts/${post_id}`,postData);
  }
  deletePost(post_id:any){
    return this.http.delete<any>(environment.baseUrl + `/posts/${post_id}`);
  }
  getCommets(post_id:any){
    return this.http.get<any>(environment.baseUrl + `/posts/${post_id}/comments`);
  }
}
