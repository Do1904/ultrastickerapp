import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'  // This service is provided at the root level
})

export class DataService {
  private dataUrl = 'http://localhost:3000/users/users';  // The URL to the backend endpoint

  constructor(private http: HttpClient) {}        // Inject HttpClient to make HTTP requests 
  
  getData(): Observable<User[]> {
    return this.http.get<User[]>(this.dataUrl);    // Fetch data from the backend
  }
}