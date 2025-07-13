import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDetailPanelComponent } from './setting-detail-panel.component';

describe('SettingDetailPanelComponent', () => {
  let component: SettingDetailPanelComponent;
  let fixture: ComponentFixture<SettingDetailPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingDetailPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
