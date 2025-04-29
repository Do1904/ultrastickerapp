import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [ImageSliderComponent, CommonModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent {
}
