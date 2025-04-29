import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  slides = [
    { url: '/assets/slides/darmstadtSalzburg.jpg', title: '画像1の説明' },
    { url: '/assets/slides/hsvKovenhavn.jpg', title: '画像2の説明' },
  ];

  currentIndex = 0;
  intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 4000); // 4秒ごとに次へ
  }
}
