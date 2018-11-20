import { TestBed, inject } from '@angular/core/testing';

import { IssueTrackerRouteGaurdService } from './issue-tracker-route-gaurd.service';

describe('IssueTrackerRouteGaurdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueTrackerRouteGaurdService]
    });
  });

  it('should be created', inject([IssueTrackerRouteGaurdService], (service: IssueTrackerRouteGaurdService) => {
    expect(service).toBeTruthy();
  }));
});
