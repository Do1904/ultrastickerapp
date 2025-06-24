import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  slides = [
    { url: '/assets/slides/schalkeEbisu.jpg', title: 'Ultrasステッカーを探そう' },
    { url: '/assets/slides/hsvKovenhavn.jpg', title: 'こんなところにも' },
    { url: '/assets/slides/herthaBali.jpg', title: '縄張り争い' },
    { url: '/assets/slides/rübecksalzburg.jpg', title: 'たくさん集まってる' },
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
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
