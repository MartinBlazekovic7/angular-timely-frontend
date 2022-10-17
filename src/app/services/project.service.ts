import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../model/project.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[] = [];
  projectSubject : BehaviorSubject<Project[]> = new BehaviorSubject(null);

  constructor(private dataService: DataService) { }

  getProjects() {
    this.dataService.getProjects()
      .subscribe((res => {
        this.projects = res;
        this.projectSubject.next([...this.projects]);
      }))
    return this.projectSubject;
  }

  addProject(project){
    this.dataService.addProject(project)
      .subscribe((res) => {
        this.projects.push(project);
        this.projectSubject.next([...this.projects]);
      }
    )
  }

  completeOrEditProject(project){
    this.dataService.completeOrEditProject(project)
      .subscribe((res => {
        this.projects[this.projects.length-1] = project;
        this.projectSubject.next([...this.projects]);
      }))
  }

  deleteProject(id){
    this.dataService.deleteProject(id)
      .subscribe((res) => {
        this.projects = this.projects.filter(p => p.id != id);
        this.projectSubject.next([...this.projects]);
      })

  }


}
