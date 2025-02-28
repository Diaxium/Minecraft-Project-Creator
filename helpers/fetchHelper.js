let cachedLicenses = null;
let cachedVersions = null;

/**
 * Fetches and caches SPDX license mappings from GitHub.
 * 
 * @returns {Promise<Object>} A mapping of license IDs to their corresponding URLs.
 */
export async function fetchLicenseMapping() {
    if (cachedLicenses) {
        return cachedLicenses;
    }
    
    const url = 'https://api.github.com/repos/spdx/license-list-data/contents/text';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch license list: ${response.statusText}`);
        }
        
        const files = await response.json();
        const mapping = {};
        for (const file of files) {
            if (file.name.endsWith('.txt')) {
                const licenseId = file.name.slice(0, -4);
                mapping[licenseId] = file.download_url;
            }
        }
        
        cachedLicenses = mapping; // Cache the result
        return cachedLicenses;
    } catch (error) {
        console.error("Error fetching license mapping:", error);
        return {};
    }
}

/**
 * Fetches and caches available Gradle versions from GitHub.
 * 
 * @returns {Promise<string[]>} An array of available Gradle version tags.
 */
export async function getGradleVersions() {
    if (cachedVersions) {
        return cachedVersions;
    }

    try {
        const response = await fetch('https://api.github.com/repos/gradle/gradle/releases');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const releases = await response.json();
        cachedVersions = releases.map(release => release.tag_name); // Cache the result
        return cachedVersions;
    } catch (error) {
        console.error("Error fetching Gradle releases:", error);
        return [];
    }
}

/**
 * Downloads a file and returns its ArrayBuffer.
 * @param {string} url - The file URL.
 * @returns {Promise<ArrayBuffer>} The downloaded file data.
 */
export async function fetchFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}