import { fetchLicenseMapping } from '../helpers/fetchHelper.js';

/**
 * Retrieves the license text from the SPDX license list based on the provided license type,
 * then formats it with the project author's details.
 *
 * @param {Object} answers - The answers object containing project details.
 * @param {string} answers.project_license - The license type (e.g., "MIT", "Apache-2.0").
 * @param {string} answers.project_author - The author's name for copyright formatting.
 * @returns {Promise<string>} The formatted license text or an error message if not found.
 */
export async function generateLicense(answers) {
    if (!answers?.project_license) {
        throw new Error('License type is required.');
    }

    try {
        const mapping = await fetchLicenseMapping();
        const url = mapping[answers.project_license];

        if (!url) {
            throw new Error(`Unsupported license type: ${answers.project_license}`);
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch license content: ${response.status} ${response.statusText}`);
        }

        let licenseText = await response.text();
        
        // Replace placeholders with actual project details
        licenseText = licenseText.replace(/<year>/g, new Date().getFullYear().toString());
        licenseText = licenseText.replace(/<copyright holders>/g, answers.project_author || 'Unknown Author');
        
        return licenseText;
    } catch (error) {
        console.error('Error generating license:', error);
        throw error;
    }
}