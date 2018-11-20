import { IssueTrackerModule } from './issue-tracker.module';

describe('IssueTrackerModule', () => {
  let issueTrackerModule: IssueTrackerModule;

  beforeEach(() => {
    issueTrackerModule = new IssueTrackerModule();
  });

  it('should create an instance', () => {
    expect(issueTrackerModule).toBeTruthy();
  });
});
