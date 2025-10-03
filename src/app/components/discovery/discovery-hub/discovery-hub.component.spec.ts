import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryHubComponent } from './discovery-hub.component';

describe('DiscoveryHubComponent', () => {
  let component: DiscoveryHubComponent;
  let fixture: ComponentFixture<DiscoveryHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoveryHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
