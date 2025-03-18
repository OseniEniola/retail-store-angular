import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';
import { BehaviorSubject } from 'rxjs';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return online status as true when navigator is online', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(true);
    service = new NetworkService();
    service.isOnline$.subscribe(status => {
      expect(status).toBeTrue();
    });
  });

  it('should return online status as false when navigator is offline', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);
    service = new NetworkService();
    service.isOnline$.subscribe(status => {
      expect(status).toBeFalse();
    });
  });

  it('should return current online status with isOnline() method', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(true);
    service = new NetworkService();
    expect(service.isOnline()).toBeTrue();
  });
});
