import { select, input } from '@inquirer/prompts';
import { DEFAULTS } from '../config/config.js';
import { getGradleVersions } from '../helpers/fetchHelper.js';

/**
 * Prompts the user to select a license for the project.
 * 
 * @returns {Promise<string>} The selected license or a custom license input.
 */
export async function promptLicenseSelection() {
    const licenseSelection = await select({
        message: 'Project License:',
        choices: [
            { name: 'MIT', value: 'MIT' },
            { name: 'Apache-2.0', value: 'Apache-2.0' },
            { name: 'GPL-3.0', value: 'GPL-3.0' },
            { name: 'Other', value: 'Other' }
        ],
        default: DEFAULTS.project_license
    });

    return licenseSelection === 'Other' 
        ? await input({ message: 'Please enter your custom license ID:' }) 
        : licenseSelection;
}

/**
 * Prompts the user to select a Gradle version.
 * 
 * @returns {Promise<string>} The selected Gradle version.
 */
export async function selectGradleVersion() {
    const versions = await getGradleVersions();
    if (versions.length === 0) {
        console.error("No Gradle versions found.");
        return DEFAULTS.gradle_version;
    }

    const choices = versions.map(version => ({ name: version, value: version }));

    return await select({
        message: 'Select a Gradle version:',
        choices,
        loop: false,
        default: DEFAULTS.gradle_version
    });
}
