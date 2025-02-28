import { generatePluginGradle, generateBuildGradle, generateGradleWrapperProperties } from './gradleGenerator.js';
import { generateMixinData, generatePackData, generateModsToml, generateModsJson } from './dataGenerator.js';
import { generateJavaTemplate } from './javaGenerator.js';
import { fetchFile } from '../helpers/fetchHelper.js';

/**
 * Helper to convert a dotted package string into a directory path.
 * @param {Object} answers - The answers object.
 * @returns {string} The group path.
 */
function getGroupPath(answers) {
    return answers.project_group.replace(/\./g, '/');
}

/**
 * Helper to capitalize the first letter of a string.
 * @param {string} str 
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates the plugins module folder structure.
 * @returns {Promise<Array>} A list of plugin module file structures.
 */
export async function generatePluginsModule() {
    const pluginsSrcPath = 'src/main/groovy';

    return [
        { path: 'build.gradle', content: generateBuildGradle('plugins') },
        { path: `${pluginsSrcPath}/type-common.gradle`, content: generatePluginGradle('common') },
        { path: `${pluginsSrcPath}/type-library.gradle`, content: generatePluginGradle('library') },
        { path: `${pluginsSrcPath}/type-platform.gradle`, content: generatePluginGradle('platform') }
    ];
}

/**
 * Generates the Gradle module file structures.
 * @param {Object} answers - Project details for Gradle module generation.
 * @returns {Promise<Array>} A list of Gradle module file structures.
 */
export async function generateGradleModule(answers) {
    const wrapperPath = 'wrapper';
    const wrapperURL = `https://raw.githubusercontent.com/gradle/gradle/${answers.gradle_version}/gradle/wrapper/gradle-wrapper.jar`;
    
    console.log(wrapperURL);

    return [
        { path: `${wrapperPath}/gradle-wrapper.jar`, content: await fetchFile(wrapperURL) },
        { path: `${wrapperPath}/gradle-wrapper.properties`, content: await generateGradleWrapperProperties(answers) }
    ];
}

/**
 * Generates core module folder structures.
 * @param {Object} answers - Project details for folder generation.
 * @returns {Promise<Array>} A list of core module file structures.
 */
export async function generateCoreModules(answers) {
    const [apiModules, utilsModules, appModules] = await Promise.all([
        generateApiModule(answers),
        generateUtilsModule(answers),
        generateAppModules(answers)
    ]);
    return [...apiModules, ...utilsModules, ...appModules];
}

/**
 * Generates the API module folder structure.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of API module file structures.
 */
async function generateApiModule(answers) {
    const groupPath = getGroupPath(answers);
    const apiPath = `api/src/main/java/${groupPath}/${answers.project_id}`;

    const children = [
        { path: 'api/build.gradle', content: generateBuildGradle('core:api') },
        { path: 'api/src/main/resources/', content: "" },
        { path: `api/src/test/java/${groupPath}/${answers.project_id}/`, content: "" },
        {
            path: `${apiPath}/Api.java`,
            content: await generateJavaTemplate({
                name: "Api",
                packageName: `${answers.project_group}.${answers.project_id}`,
                type: "class",
                methods: []
            })
        },
        {
            path: `${apiPath}/platform/services/IPlatformHelper.java`,
            content: await generateJavaTemplate({
                name: "IPlatformHelper",
                packageName: `${answers.project_group}.${answers.project_id}.platform.services`,
                type: "interface",
                methods: []
            })
        }
    ];
    return children;
}

/**
 * Generates the utils module folder structure.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of utils module file structures.
 */
async function generateUtilsModule(answers) {
    const groupPath = getGroupPath(answers);
    const utilsPath = `utils/src/main/java/${groupPath}/${answers.project_id}`;

    const children = [
        { path: 'utils/build.gradle', content: generateBuildGradle('core:utils') },
        { path: 'utils/src/main/resources/', content: "" },
        { path: `utils/src/test/java/${groupPath}/${answers.project_id}/`, content: "" },
        {
            path: `${utilsPath}/Utils.java`,
            content: await generateJavaTemplate({
                name: "Utils",
                packageName: `${answers.project_group}.${answers.project_id}`,
                type: "class",
                methods: []
            })
        }
    ];
    return children;
}

/**
 * Generates the app modules folder structure.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of app module file structures.
 */
async function generateAppModules(answers) {
    const appPath = 'app';
    const [commonModule, platformModules] = await Promise.all([
        generateCommonModule(appPath, answers),
        generatePlatformModules(appPath, answers)
    ]);
    return [...commonModule, ...platformModules];
}

/**
 * Generates the Common module folder structure.
 * @param {string} appPath - The base app path.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of Common module file structures.
 */
async function generateCommonModule(appPath, answers) {
    const groupPath = getGroupPath(answers);
    const javaPath = `${appPath}/common/src/main/java/${groupPath}/${answers.project_id}`;

    const children = [
        { path: `${appPath}/common/build.gradle`, content: generateBuildGradle('core:app:common') },
        { path: `${appPath}/common/src/main/resources/`, content: "" },
        { path: `${javaPath}/mixins/`, content: "" },
        {
            path: `${appPath}/common/src/main/resources/${answers.project_id}.mixins.json`,
            content: await generateMixinData('common', answers)
        },
        { path: `${appPath}/common/src/main/resources/pack.mcmeta`, content: await generatePackData() },
        { path: `${appPath}/common/src/test/java/${groupPath}/${answers.project_id}/`, content: "" },
        {
            path: `${javaPath}/Common.java`,
            content: await generateJavaTemplate({
                name: "Common",
                packageName: `${answers.project_group}.${answers.project_id}`,
                type: "class",
                methods: [{
                    name: "initialize",
                    accessModifier: "public static",
                    returnType: "void",
                    bodyLines: ["// Add any needed initialization code here."]
                }]
            })
        },
        {
            path: `${javaPath}/Constants.java`,
            content: await generateJavaTemplate({
                name: "Constants",
                packageName: `${answers.project_group}.${answers.project_id}`,
                type: "class",
                fields: [{
                    accessModifier: "public",
                    isStaticFinal: true,
                    type: "String",
                    name: "PROJECT_ID",
                    initialValue: `"${answers.project_id}"`
                }],
                methods: []
            })
        }
    ];
    return children;
}

/**
 * Generates platform-specific module folders.
 * @param {string} appPath - The base app path.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of platform-specific module file structures.
 */
async function generatePlatformModules(appPath, answers) {
    const platforms = ['fabric', 'forge', 'neoforge'];
    const modules = await Promise.all(
        platforms.map(plat => {
            const platPath = `${appPath}/platform/${plat}`;
            return generatePlatformSpecificFiles(platPath, plat, answers);
        })
    );
    return modules.flat();
}

/**
 * Generates platform-specific module files and configurations.
 * @param {string} platformPath - The base platform path.
 * @param {string} platform - The specific platform type.
 * @param {Object} answers - Project details.
 * @returns {Promise<Array>} A list of platform-specific file structures.
 */
async function generatePlatformSpecificFiles(platformPath, platform, answers) {
    const groupPath = getGroupPath(answers);
    const javaPath = `${platformPath}/src/main/java/${groupPath}/${answers.project_id}`;
    const capPlatform = capitalize(platform);

    const children = [
        { path: `${platformPath}/build.gradle`, content: generateBuildGradle(`core:app:platform:${platform}`) },
        { path: `${platformPath}/src/test/java/`, content: "" },
        { path: `${platformPath}/runs/client/resources/`, content: "" },
        { path: `${platformPath}/runs/data/`, content: "" },
        { path: `${platformPath}/runs/server/`, content: "" },
        { path: `${platformPath}/src/main/resources/META-INF/`, content: "" },
        { path: `${javaPath}/mixins/`, content: "" },
        {
            path: `${platformPath}/src/main/resources/${answers.project_id}.${platform}.mixins.json`,
            content: await generateMixinData(platform, answers)
        },
        {
            path: `${platformPath}/src/main/resources/META-INF/services/${answers.project_group}.${answers.project_id}.platform.services.IPlatformHelper`,
            content: `${answers.project_group}.${answers.project_id}.platform.${capPlatform}Platform`
        },
        {
            path: `${javaPath}/platform/${capPlatform}Platform.java`,
            content: await generateJavaTemplate({
                name: `${capPlatform}Platform`,
                packageName: `${answers.project_group}.${answers.project_id}.platform`,
                type: "class",
                implementInterfaces: ["IPlatformHelper"],
                imports: [`${answers.project_group}.${answers.project_id}.platform.services.IPlatformHelper`],
                methods: []
            })
        }
    ];

    if (platform === 'forge') {
        children.push(
            {
                path: `${platformPath}/src/main/resources/META-INF/${platform}.mods.toml`,
                content: await generateModsToml(platform)
            },
            {
                path: `${javaPath}/ForgeBootstrap.java`,
                content: await generateJavaTemplate({
                    name: "ForgeBootstrap",
                    packageName: `${answers.project_group}.${answers.project_id}`,
                    imports: [
                        "net.minecraftforge.fml.common.Mod",
                        "net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext"
                    ],
                    annotations: ["Mod(Constants.PROJECT_ID)"],
                    methods: [{
                        name: "ForgeBootstrap",
                        accessModifier: "public",
                        parameters: ["FMLJavaModLoadingContext context"],
                        bodyLines: [
                            "// Initialization code",
                            "Common.initialize();"
                        ]
                    }]
                })
            }
        );
    } else if (platform === 'fabric') {
        children.push(
            {
                path: `${platformPath}/src/main/resources/${platform}.mod.json`,
                content: await generateModsJson(answers)
            },
            {
                path: `${javaPath}/FabricBootstrap.java`,
                content: await generateJavaTemplate({
                    name: "FabricBootstrap",
                    packageName: `${answers.project_group}.${answers.project_id}`,
                    implementInterfaces: ["ModInitializer"],
                    imports: ["net.fabricmc.api.ModInitializer"],
                    methods: [{
                        name: "onInitialize",
                        accessModifier: "public",
                        annotations: ["Override"],
                        bodyLines: [
                            "// Initialization code",
                            "Common.initialize();"
                        ]
                    }]
                })
            }
        );
    } else if (platform === 'neoforge') {
        children.push(
            {
                path: `${platformPath}/src/main/resources/META-INF/${platform}.mods.toml`,
                content: await generateModsToml(platform)
            },
            {
                path: `${javaPath}/NeoForgeBootstrap.java`,
                content: await generateJavaTemplate({
                    name: "NeoForgeBootstrap",
                    packageName: `${answers.project_group}.${answers.project_id}`,
                    imports: [
                        "net.neoforged.bus.api.IEventBus",
                        "net.neoforged.fml.common.Mod"
                    ],
                    annotations: ["Mod(Constants.PROJECT_ID)"],
                    methods: [{
                        name: "NeoForgeBootstrap",
                        accessModifier: "public",
                        parameters: ["IEventBus modBus"],
                        bodyLines: [
                            "// Initialization code",
                            "Common.initialize();"
                        ]
                    }]
                })
            }
        );
    }
    return children;
}
