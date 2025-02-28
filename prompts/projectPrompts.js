import { input, confirm } from '@inquirer/prompts';
import { DEFAULTS } from '../config/config.js';
import { promptLicenseSelection, selectGradleVersion } from './gradlePrompts.js';

/**
 * Prompts the user for project details required to generate a project configuration.
 * 
 * @returns {Promise<Object>} An object containing the project details.
 */
export async function promptProjectDetails() {
    const project_name = await input({ message: 'Project Name:', default: DEFAULTS.project_name, required: true });

    const projectDetails = {
        project_name,
        project_version: await input({ message: 'Project Version:', default: DEFAULTS.project_version }),
        project_group: await input({ message: 'Project Group:', default: DEFAULTS.project_group }),
        project_title: await input({ message: 'Project Title:', default: project_name }),
        project_id: await input({ 
            message: 'Project ID:', 
            default: project_name.toLowerCase().replace(/[^a-z0-9]/g, "_") // Replace all non-alphanumeric characters with "_"
        }),
        project_license: await promptLicenseSelection(),
        project_author: await input({ message: 'Project Author:', default: DEFAULTS.project_author }),
        project_credits: await input({ message: 'Project Credits:', default: DEFAULTS.project_credits }),
        project_description: await input({ message: 'Project Description:', default: DEFAULTS.project_description }),
        minecraft_version: await input({
            message: 'Minecraft Version: (Check latest: https://www.minecraft.net/en-us/download)',
            default: DEFAULTS.minecraft_version
        }),
        pack_format_version: await input({
            message: 'Pack Format Version: (Check latest: https://minecraft.wiki/w/Pack_format)',
            default: DEFAULTS.pack_format_version
        }),
        minecraft_version_range: await input({
            message: 'Minecraft Version Range:',
            default: DEFAULTS.minecraft_version_range
        }),
        neo_form_version: await input({
            message: 'NeoForm Version: (Check latest: https://projects.neoforged.net/neoforged/neoform)',
            default: DEFAULTS.neo_form_version
        }),
        parchment_minecraft: await input({
            message: 'Parchment Minecraft Version: (Check latest: https://parchmentmc.org/docs/getting-started.html)',
            default: DEFAULTS.parchment_minecraft
        }),
        parchment_version: await input({
            message: 'Parchment Version: (Check latest: https://parchmentmc.org/docs/getting-started.html)',
            default: DEFAULTS.parchment_version
        }),
        fabric_version: await input({
            message: 'Fabric Version: (Check latest: https://fabricmc.net/develop/)',
            default: DEFAULTS.fabric_version
        }),
        fabric_loader_version: await input({
            message: 'Fabric Loader Version: (Check latest: https://fabricmc.net/develop/)',
            default: DEFAULTS.fabric_loader_version
        }),
        forge_version: await input({
            message: 'Forge Version: (Check latest: https://files.minecraftforge.net/net/minecraftforge/forge/)',
            default: DEFAULTS.forge_version
        }),
        forge_loader_version_range: await input({
            message: 'Forge Loader Version Range:',
            default: DEFAULTS.forge_loader_version_range
        }),
        neoforge_version: await input({
            message: 'NeoForge Version: (Check latest: https://projects.neoforged.net/neoforged/neoforge)',
            default: DEFAULTS.neoforge_version
        }),
        neoforge_loader_version_range: await input({
            message: 'NeoForge Loader Version Range:',
            default: DEFAULTS.neoforge_loader_version_range
        }),
        java_version: await input({
            message: 'Java Version: (Check latest: https://adoptium.net/)',
            default: DEFAULTS.java_version
        }),
        gradle_version: await selectGradleVersion()
    };


    console.log('\nReview your project details:\n', projectDetails);

    // Confirm if the details are correct
    const confirmation = await confirm({ message: 'Are these details correct?', default: true });

    if (!confirmation) {
        console.log('Please re-enter the project details.');
        return await promptProjectDetails(); // Restart prompt if user wants changes
    }

    return projectDetails;
}
