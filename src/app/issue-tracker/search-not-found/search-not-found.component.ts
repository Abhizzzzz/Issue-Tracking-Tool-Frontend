import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-search-not-found',
  templateUrl: './search-not-found.component.html',
  styleUrls: ['./search-not-found.component.css']
})
export class SearchNotFoundComponent implements OnInit {

  constructor(public location: Location) { }

  ngOnInit() {
  }

  // back
  public goBackToPreviousPage = () =>{
    this.location.back();
  }

}
