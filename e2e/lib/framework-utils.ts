/**
 * Get a failure screenshot filename based on test data.
 *
 * @param test The test data provided by WDIO.
 * @returns The filename.
 */
export function getFailureScreenshotFilename(test: { title: string, parent: string }): string {
    const parentName = test.parent.toLowerCase().replace(/\s+/g, '-');
    const testName = test.title.toLowerCase().replace(/\s+/g, '-');
    return `${parentName}_${testName}_failure_${Date.now()}.png`;
}
