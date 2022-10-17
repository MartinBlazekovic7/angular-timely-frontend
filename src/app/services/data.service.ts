import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  URL = 'http://localhost:8080/api/project';

  constructor(private http: HttpClient) { }

  getProjects(){
    return this.http.get(this.URL)
      .pipe(map((res: Project[]) => {
        return res;
      }))
  }

  addProject(project){
    return this.http.post(this.URL, project);
  }

  completeOrEditProject(project){
    return this.http.put(this.URL+`/${project.id}`, project);
  }

  deleteProject(id){
    return this.http.delete(this.URL+`/${id}`);
  }

}
