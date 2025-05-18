import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map
  private L: any;

  constructor() { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.L = await import('leaflet');

      const map = L.map('map').setView([35.681236, 139.767125], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    }
  }
}
