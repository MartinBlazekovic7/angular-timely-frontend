import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project.model';
import { ProjectService } from '../services/project.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as XLSX from 'xlsx';
import {createElementCssSelector} from "@angular/compiler";

@Component({
  selector: 'app-timely',
  templateUrl: './timely.component.html',
  styleUrls: ['./timely.component.css']
})
export class TimelyComponent implements OnInit {

  projects?: Project[];

  completeProjectForm: FormGroup;

  tempProject: Project;
  started : boolean = false;
  buttonText: String = 'START';

  showDiv: boolean = false;

  projectName: String = '';

  fileName= 'Projects.xlsx';

  stopTime: Date;
  page: string | number;

  deleting: boolean = false;
  deleteText: String = 'DELETE';

  editing: boolean = false;
  editText: String = 'EDIT';
  showEditDiv: boolean = false;
  editProjectForm: FormGroup;
  projectEdited: Project;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {

    console.log(this.strToDate('15.10.2022 16:15:54'));

    this.completeProjectForm = new FormGroup({
      'name': new FormControl('', null)
    });

    this.editProjectForm = new FormGroup({
      'name': new FormControl('', null)
    });

    this.projectService.getProjects()
      .subscribe(res => {
        if(res == null) return null;
        else {
          this.projects=res;
          console.log(this.projects);
          if(this.projects.length > 0 && this.projects[this.projects.length-1].duration === '...'){
            this.buttonText = 'STOP';
            this.started = true;
          }
        }
      });

  }

  startTimer(){
    this.buttonText = 'STOP';
    this.started = true;


    let startTime: Date = new Date();

    let startTimeString : String = this.checkZeroes(startTime.getDate()) + "."
                                  + this.checkZeroes(startTime.getMonth()+1)  + "."
                                  + startTime.getFullYear() + " "
                                  + this.checkZeroes(startTime.getHours()) + ":"
                                  + this.checkZeroes(startTime.getMinutes()) + ":"
                                  + this.checkZeroes(startTime.getSeconds());

    this.tempProject = {
      id: this.projects.length > 0 ? this.projects[this.projects.length-1].id+1 : 1,
      name: '...',
      start: startTimeString,
      stop: '...',
      duration: '...'
    }

    this.projectService.addProject(this.tempProject);

    console.log(this.tempProject);
  }

  showStopDiv(){
    this.showDiv=!this.showDiv;
    this.stopTime = new Date();
  }

  stopTimer(){

    let stopTimeString : String = this.checkZeroes(this.stopTime.getDate()) + "."
      + this.checkZeroes(this.stopTime.getMonth()+1)  + "."
      + this.stopTime.getFullYear() + " "
      + this.checkZeroes(this.stopTime.getHours()) + ":"
      + this.checkZeroes(this.stopTime.getMinutes()) + ":"
      + this.checkZeroes(this.stopTime.getSeconds());

    let duration = this.stopTime.getTime() - this.strToDate(this.projects[this.projects.length-1].start).getTime()
    let seconds: string | number = Math.floor((duration / 1000) % 60),
      minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
      hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    let durationString = hours + ":" + minutes + ":" + seconds;

    console.log(durationString);

    console.log(durationString);
    this.tempProject = {
      id: this.projects ? this.projects[this.projects.length-1].id : 1,
      name: this.completeProjectForm.value.name,
      start: this.projects[this.projects.length-1].start,
      stop: stopTimeString,
      duration: durationString
    }


    this.projectService.completeOrEditProject(this.tempProject);

    this.completeProjectForm.reset();
    this.showDiv = false;
    this.buttonText = 'START';
    this.started = false;
    this.tempProject = {id:0, name: '', start: '', stop: '', duration: ''};
  }


  checkZeroes(a){
    if (a.toString().length == 1) {
      a = "0" + a;
    }
    return a;
  }

  strToDate(dtStr) {
    if (!dtStr) return null
    let dateParts = dtStr.split(".");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];

    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
  }

  exportExcel(): void
  {
    let element = document.getElementById('project-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');

    XLSX.writeFile(wb, this.fileName);

  }

  deleteProjects(){
    if(this.editing) {
      alert("Can't delete while editing!");
      return;
    } else {
      this.deleteText = this.deleting ? 'DELETE' : 'DONE';
      this.deleting = !this.deleting;
    }
  }

  editProjects() {
    if(this.deleting) {
      alert("Can't edit while deleting!");
      return;
    } else {
      this.editText = this.editing ? 'EDIT' : 'DONE';
      this.editing = !this.editing;
    }
  }

  deleteOneProject(id){
    this.projectService.deleteProject(id);
  }

  editingOneProject(project){
    this.editProjectForm.patchValue({name: project.name});
    this.projectEdited = {
      id: project.id,
      name: project.name,
      start: project.start,
      stop: project.stop,
      duration: project.duration
    }
    this.showEditDiv = !this.showEditDiv;
  }

  editSubmit(){
    this.showEditDiv = !this.showEditDiv;
    this.projectEdited.name = this.editProjectForm.value.name;
    this.projectService.completeOrEditProject(this.projectEdited);
  }

  deleteOngoingProject(){
    this.projectService.deleteProject(this.tempProject.id);
    this.showDiv = false;
    this.buttonText = 'START';
    this.started = false;
    this.tempProject = {id:0, name: '', start: '', stop: '', duration: ''};
  }




}
