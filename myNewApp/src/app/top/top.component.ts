import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [ImageSliderComponent, CommonModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css', '../../sticker.css'],
})
export class TopComponent {
  test = [
    { url: '/assets/slides/schalkeEbisu.jpg', title: 'Ultrasステッカーを探そう' },
  ];
}
