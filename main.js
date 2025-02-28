import { promptProjectDetails } from './prompts/projectPrompts.js';
import * as GradleGenerator from './generators/gradleGenerator.js';
import * as FolderGenerator from './generators/folderGenerator.js';
import { generateProjectZip } from './generators/projectZipGenerator.js';
import { generateLicense } from './generators/licenseGenerator.js';
import { generateREADME } from './generators/readmeGenerator.js';


/**
 * Main function that initializes the project creation process.
 * It prompts the user for project details and generates necessary files and folders.
 */
async function main() {
    const answers = await promptProjectDetails();

    const files = [
        { path: 'build.gradle', content: await GradleGenerator.generateBuildGradle('root') },
        { path: 'gradle.properties', content: await GradleGenerator.generateGradleProperties(answers) },
        { path: 'dependencies.gradle', content: await GradleGenerator.generateDependenciesGradle() },
        { path: 'settings.gradle', content: await GradleGenerator.generateSettingsGradle(answers) },
        { path: 'LICENSE', content: await generateLicense(answers) },
        { path: 'README.md', content: await generateREADME(answers) },
        { path: 'gradlew', content: await GradleGenerator.generateGradlew() },
        { path: 'gradlew.bat', content: await GradleGenerator.generateGradlewBat() },
        {
            path: 'gradle',
            children: await FolderGenerator.generateGradleModule(answers)
        },
        {
            path: 'plugins', 
            children: await FolderGenerator.generatePluginsModule()
        },
        {
            path: 'core',
            children: await FolderGenerator.generateCoreModules(answers)
        }
    ];

    await generateProjectZip(answers, files)
        .then(() => console.log("Project successfully created!"))
        .catch(err => console.error("Failed to generate ZIP:", err));
}

// Execute the main function to start the process
main();
