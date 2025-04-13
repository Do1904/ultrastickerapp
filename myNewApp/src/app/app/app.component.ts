import { Component, OnInit } from '@angular/core';
import { StickerComponent } from '../sticker/sticker.component';
import { RouterModule } from '@angular/router';
import { DataService } from '../service/data.service'; // Import the data service
import { User } from '../model/user';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component"; // Import the user model
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StickerComponent,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Stickers';
  data: User[] = []; // Property to store the data

  constructor(private dataService: DataService) { } // Inject the data service

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.data = data; // Assign the received data to the property
    }, (error) => {
      console.error('There was an error retrieving data:', error);
    });
  }
}
