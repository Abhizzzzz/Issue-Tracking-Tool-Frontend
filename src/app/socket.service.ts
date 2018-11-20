import { Injectable } from '@angular/core';
//Importing HttpClient and HttpErrorResponse
import {HttpClient,HttpErrorResponse, HttpParams} from '@angular/common/http';
//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
//for cookies
import {Cookie} from 'ng2-cookies/ng2-cookies';
// io as socket.io-client
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private baseUrl = 'http://apiissuetrackingtool.abhishekpalwankar.xyz/api/v1';
  private socketBaseUrl = 'http://apiissuetrackingtool.abhishekpalwankar.xyz/issueTrackingTool';
  private socket;

  constructor(public http: HttpClient) {
    console.log("Socket service");
    // connecting to the server
    // here the handshaking is made
    this.socket = io(this.socketBaseUrl);
   }

  //  socket programming

   public verifyUser = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('verify-user',(data) =>{
        console.log("Received data from verify-user event");
        observer.next(data);

      });
    });
    return listen;
  };

  public setUser = (authToken) =>{
    this.socket.emit('set-user',authToken);
  };

   public authError = () =>{
    let listen = Observable.create((observer) =>{
      this.socket.on('auth-error',(err) =>{
        console.log("Received err from auth-error");
        observer.next(err);
      });
    });
    return listen;
  };

  public watchAIssue = (watcherDetails) =>{
    this.socket.emit('watching-to-a-issue',watcherDetails);
  }

  public emitGetWatchersList = (issueId) =>{
    
    this.socket.emit('get-watcher-list',issueId);
  }

  public gettingWatchersList(issueId): any{
    
    let listen = Observable.create((observer) =>{
      this.socket.on(issueId,(data) =>{
        observer.next(data);
      });
    });
    return listen;
  };

  public broadcastToAllWatchers = (data) =>{
    
    this.socket.emit('broadcast-to-watchers',data);
  }

  public getNotification(): any{
    
    let listen = Observable.create((observer) =>{
      this.socket.on('notify-watchers',(data) =>{
        console.log("Notification");
        observer.next(data);
      });
    });
    return listen;
  };

  // we are creating this event to delete the user from online user,because above functions only calls up on closing the window
  public logout = () =>{
    this.socket.emit('logout','');
  };

  public exitSocket(): any{
    // disconnect event which is on server is emitted by the browser on closing the tab by default
    this.socket.disconnect();
    
  }







  // end of socket programming

  // getIssuesByAssignee
  public getIssuesByAssignee(userName,authToken): any{
    let response = this.http.get(`${this.baseUrl}/issue/get/by/assignee?assignee=${userName}&authToken=${authToken}`);
    return response;
  };

  // create Issue
  public createAIssue(data): any{
    const params = new HttpParams().set('authToken',data.authToken)
    .set('title',data.title)
    .set('description',data.description)
    .set('reporter',data.reporter)
    .set('reporterId',data.reporterId)
    .set('assignee',data.assignee)
    .set('status',data.status)
    let response = this.http.post(`${this.baseUrl}/issue/create`,params);
    return response;
  };

  // getIssuesByFilter
  public getIssuesByFilter(filterBy,value,authToken): any{
    let response = this.http.get(`${this.baseUrl}/issue/get/by/${filterBy}?${filterBy}=${value}&authToken=${authToken}`);
    return response;
  };

  // getIssuesByFilter
  public getIssuesByStatus(assignee,value,authToken): any{
    let response = this.http.get(`${this.baseUrl}/issue/get/by/status?status=${value}&assignee=${assignee}&authToken=${authToken}`);
    return response;
  };

  // getIssuesByFilter
  public getIssuesByReporter(assignee,value,authToken): any{
    let response = this.http.get(`${this.baseUrl}/issue/get/by/reporter?reporter=${value}&assignee=${assignee}&authToken=${authToken}`);
    return response;
  };

  // getIssueById
  public getIssueById(issueId,authToken): any{
    let response = this.http.get(`${this.baseUrl}/issue/get/by/issueId?issueId=${issueId}&authToken=${authToken}`);
    return response;
  };

  // getCommentsByissueId
  public getCommentsByissueId(issueId,authToken): any{
    let response = this.http.get(`${this.baseUrl}/comment/get/by/issueId?issueId=${issueId}&authToken=${authToken}`);
    return response;
  };


  // createAComment
  public createAComment(data): any{
    const params = new HttpParams()
    .set('authToken',data.authToken)
    .set('issueId',data.issueId)
    .set('commenterName',data.commenterName)
    .set('comment',data.comment)
    
    let response = this.http.post(`${this.baseUrl}/comment/create`,params);
    return response;
  };

  public editIssue(issueId,issueData,authToken): any{
    let myResponse = this.http.put(`${this.baseUrl}/issue/${issueId}/edit?authToken=${authToken}`,issueData);
    return myResponse;
  }

  // s3ImageUpload
  public imageUploadToS3(authToken): any{
    let response = this.http.get(`${this.baseUrl}/s3ImageUpload/get_signature?authToken=${authToken}`);
    return response;
  };  

}
