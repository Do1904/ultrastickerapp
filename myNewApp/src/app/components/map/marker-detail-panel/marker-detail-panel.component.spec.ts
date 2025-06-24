import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerDetailPanelComponent } from './marker-detail-panel.component';

describe('MarkerDetailPanelComponent', () => {
  let component: MarkerDetailPanelComponent;
  let fixture: ComponentFixture<MarkerDetailPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkerDetailPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
