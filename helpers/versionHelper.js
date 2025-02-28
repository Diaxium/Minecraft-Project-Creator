/**
 * Formats a version string by removing unnecessary zeros and handling tags.
 * 
 * @param {string} version - The version string to format.
 * @returns {string} The formatted version string.
 */
export function formatVersion(version) {
    return version.replace(/^v?(\d+)\.(\d+)\.(\d+)(?:-([A-Za-z0-9]+))?$/, (_, major, minor, patch, tag) => {
        return patch === "0" 
            ? (tag ? `${major}.${minor}-${tag}` : `${major}.${minor}`) 
            : (tag ? `${major}.${minor}.${patch}-${tag}` : `${major}.${minor}.${patch}`);
    });
}
