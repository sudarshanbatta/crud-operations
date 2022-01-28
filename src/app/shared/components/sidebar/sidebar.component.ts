import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
sidebar:boolean=false
  constructor() { }

  ngOnInit(): void {
  }
  showSidebar(){
this.sidebar=!this.sidebar
  }
}
