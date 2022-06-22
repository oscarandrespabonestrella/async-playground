import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Specie{
  "id": string;
  "name": string;
  "classification": string;
  "eye_colors": string;
  "hair_colors": string;
  "people": string[];
  "films": [];
  "url": string;    
}

@Injectable({
  providedIn: 'root'
})
export class WebServerService {
  getGhibliFilms$(): Observable<any> {
    return this.httpClient.get('https://ghibliapi.herokuapp.com/films');
  }
  getGhibliSpecies$(): Observable<Specie> {
    return this.httpClient.get<Specie>('https://ghibliapi.herokuapp.com/species');
  }

  constructor(private httpClient: HttpClient) { }
}
