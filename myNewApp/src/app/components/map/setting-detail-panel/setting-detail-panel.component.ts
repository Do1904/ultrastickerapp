import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-setting-detail-panel',
  standalone: true,
  imports: [],
  templateUrl: './setting-detail-panel.component.html',
  styleUrl: './setting-detail-panel.component.css'
})
export class SettingDetailPanelComponent {
  @Input() showPrefectures: boolean = true;
  @Output() togglePrefecture = new EventEmitter<void>();

}
