import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let networkService: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkService]
    });
    networkService = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(networkService).toBeTruthy();
  });

  it('should initialize with correct online status', () => {
    spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
    const service = new NetworkService();
    service.isOnline$.subscribe(status => {
      expect(status).toBeTrue();
    });
  });

  it('should detect online event', () => {
    const onlineEvent = new Event('online');
    networkService.isOnline$.subscribe(status => {
      expect(status).toBeTrue();
    });
    window.dispatchEvent(onlineEvent);
  });

  it('should detect offline event', () => {
    const offlineEvent = new Event('offline');
    networkService.isOnline$.subscribe(status => {
      expect(status).toBeFalse();
    });
    window.dispatchEvent(offlineEvent);
  });

  it('should return correct value from isOnline()', () => {
    spyOnProperty(navigator, 'onLine', 'get').and.returnValue(false);
    const service = new NetworkService();
    expect(service.isOnline()).toBeFalse();
  });

});
