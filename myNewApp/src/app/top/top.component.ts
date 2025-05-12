import { AfterViewInit, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [ImageSliderComponent, CommonModule],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss', '../../sticker.css'],
})
export class TopComponent implements AfterViewInit {

  private animatables: HTMLElement[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    // 初期化時にアニメーション対象の要素を取得
    this.animatables = Array.from(this.el.nativeElement.querySelectorAll('.animatable'));
  }
}
