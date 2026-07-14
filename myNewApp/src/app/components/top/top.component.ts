import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [ImageSliderComponent, CommonModule, RouterModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss', '../../../sticker.css'],
})
export class TopComponent {
}
