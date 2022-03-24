import * as expect from 'expect';
import { basename } from 'path';
import { getFailureScreenshotFilename } from './framework-utils';

describe(basename(__filename).split('.spec.ts')[0], () => {
    describe(getFailureScreenshotFilename.name + '()', () => {
        it('should handle spaces', () => {
            const result = getFailureScreenshotFilename({ title: 'Name With Spaces', parent: 'Parent With Spaces' });
            expect(result).toContain('parent-with-spaces_name-with-spaces_failure_');
        });

        it('should handle mixed case', () => {
            const result = getFailureScreenshotFilename({ title: 'TestName', parent: 'ParentName' });
            expect(result).toContain('parentname_testname_failure_');
        });

        it('should contain a timestamp', () => {
            const result = getFailureScreenshotFilename({ title: 'TestName', parent: 'ParentName' });
            expect(result).toMatch(/_\d+\.png/);
        });
    });
});
