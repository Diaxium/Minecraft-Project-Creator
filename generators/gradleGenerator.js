import { formatVersion } from '../helpers/versionHelper.js';

/**
 * Generates the Gradle properties file content based on project details.
 * 
 * @param {Object} answers - The project details.
 * @returns {Promise<string>} The generated Gradle properties file content.
 */
export async function generateGradleProperties(answers) {
    return `# Gradle Properties for ${answers.project_name}
# This file defines project-wide properties to configure the Gradle build system.

# ---------------------------
# General Project Information
# ---------------------------
project_name       = ${answers.project_name}
project_version    = ${answers.project_version}

# ---------------------------
# Detailed Project Information
# ---------------------------
project_group       = ${answers.project_group}
project_title       = ${answers.project_title}
project_id          = ${answers.project_id}
project_license     = ${answers.project_license}
project_author      = ${answers.project_author}
project_credits     = ${answers.project_credits}
project_description = ${answers.project_description}

# ===========================
# Minecraft Compatibility
# ===========================
minecraft_version       = ${answers.minecraft_version}
pack_format_version     = ${answers.pack_format_version}
minecraft_version_range = ${answers.minecraft_version_range}
neo_form_version        = ${answers.neo_form_version}

# ParchmentMC Versioning
parchment_minecraft    = ${answers.parchment_minecraft}
parchment_version      = ${answers.parchment_version}
# Update URL: https://parchmentmc.org/docs/getting-started.html

# ===========================
# Loader & API Versions
# ===========================
# Fabric
fabric_version         = ${answers.fabric_version}
fabric_loader_version  = ${answers.fabric_loader_version}
# Update URL: https://fabricmc.net/develop/

# Forge
forge_version              = ${answers.forge_version}
forge_loader_version_range = ${answers.forge_loader_version_range}
# Update URL: https://files.minecraftforge.net/net/minecraftforge/forge/

# NeoForge
neoforge_version              = ${answers.neoforge_version}
neoforge_loader_version_range = ${answers.neoforge_loader_version_range}
# Update URL: https://projects.neoforged.net/neoforged/neoforge

# ---------------------------
# Java Compilation Settings
# ---------------------------
# Define the Java version compatibility
java_version = ${answers.java_version}

# ---------------------------
# Gradle JVM Settings
# ---------------------------
# Keep Gradle running between builds to improve performance
org.gradle.daemon = true

# Enable parallel execution to speed up builds
org.gradle.parallel = true

# Configure only necessary projects
org.gradle.configure_on_demand = true

# Enable Gradle build cache
org.gradle.caching = true

# Increase memory allocation to prevent OutOfMemoryError
org.gradle.jvmargs = -Xmx4G -Xms2G -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# ---------------------------
# Logging and Debugging
# ---------------------------
# Controls the logging level (must be one of quiet, warn, lifecycle, info, or debug)
org.gradle.logging.level = info

# ---------------------------
# Dependency Resolution
# ---------------------------
# Enable repositories to use dependency locking for reproducible builds
org.gradle.dependency.verification = STRICT
`;

}

/**
 * Generates the Dependencies properties file content.
 * 
 * @returns {Promise<string>} The generated Dependencies properties file content.
 */
export async function generateDependenciesGradle() {
    return `ext {
    versions = [
        balm       : '21.0.29-SNAPSHOT',
        kuma       : '[21.0,21.2)',
        night_config: '3.8.1',
        log4j      : '2.20.0'
    ]

    libraries = [
        global: [
            night_config: [
                core : "com.electronwill.night-config:core:\${versions.night_config}",
                toml : "com.electronwill.night-config:toml:\${versions.night_config}",
                json : "com.electronwill.night-config:json:\${versions.night_config}"
            ],

            log4j: [
                core : "org.apache.logging.log4j:log4j-core:\${versions.log4j}",
                api  : "org.apache.logging.log4j:log4j-api:\${versions.log4j}"
            ]
        ],

        common: [
            balm : "net.blay09.mods:balm-common:\${versions.balm}",
            kuma : "net.blay09.mods:kuma-api-common:\${versions.kuma}"
        ],

        fabric: [
            balm : "net.blay09.mods:balm-fabric:\${versions.balm}",
            kuma : "net.blay09.mods:kuma-api-fabric:\${versions.kuma}"
        ],

        forge: [
            balm : "net.blay09.mods:balm-forge:\${versions.balm}",
            kuma : "net.blay09.mods:kuma-api-forge:\${versions.kuma}"
        ],

        neoforge: [
            balm : "net.blay09.mods:balm-neoforge:\${versions.balm}",
            kuma : "net.blay09.mods:kuma-api-neoforge:\${versions.kuma}"
        ]
    ]
}
`
}

/**
 * Generates the settings.gradle file content.
 * 
 * @param {Object} answers - The project details.
 * @returns {Promise<string>} The generated settings.gradle content.
 */
export async function generateSettingsGradle(answers) {
    return `pluginManagement {
        // Include the local plugins build
        includeBuild("plugins")
    
        repositories {
            gradlePluginPortal()
            mavenCentral()
            maven {
                url = uri("https://maven.firstdarkdev.xyz/releases")
            }
            exclusiveContent {
                forRepository {
                    maven {
                        name = 'Fabric'
                        url = uri('https://maven.fabricmc.net')
                    }
                }
                filter {
                    includeGroup('net.fabricmc')
                    includeGroup('fabric-loom')
                }
            }
            exclusiveContent {
                forRepository {
                    maven {
                        name = 'Sponge'
                        url = uri('https://repo.spongepowered.org/repository/maven-public')
                    }
                }
                filter {
                    includeGroupAndSubgroups("org.spongepowered")
                }
            }
            exclusiveContent {
                forRepository {
                    maven {
                        name = 'Forge'
                        url = uri('https://maven.minecraftforge.net')
                    }
                }
                filter {
                    includeGroupAndSubgroups('net.minecraftforge')
                }
            }
        }
    }
    
    plugins {
        id 'org.gradle.toolchains.foojay-resolver-convention' version '0.8.0'
    }
    
    rootProject.name = "${answers.project_name}"
    
    // Include the subprojects
    include(":core:api")
    include(":core:utils")
    
    include(":core:app:common",
            ":core:app:platform:fabric",
            ":core:app:platform:forge",
            ":core:app:platform:neoforge")
    `;

}

/**
 * Generates the content for the `gradle-wrapper.properties` file based on the provided Gradle version.
 *
 * @param {Object} answers - An object containing project details.
 * @param {string} answers.gradle_version - The required Gradle version.
 * @returns {string} - The formatted content for `gradle-wrapper.properties`.
 */
export async function generateGradleWrapperProperties(answers) {
    // Format the version string if needed
    const formattedVersion = formatVersion(answers.gradle_version);

    // Create the content for gradle-wrapper.properties
    const propertiesContent = [
        'distributionBase=GRADLE_USER_HOME',
        'distributionPath=wrapper/dists',
        `distributionUrl=https\\://services.gradle.org/distributions/gradle-${formattedVersion}-bin.zip`,
        'networkTimeout=10000',
        'validateDistributionUrl=true',
        'zipStoreBase=GRADLE_USER_HOME',
        'zipStorePath=wrapper/dists'
    ].join('\n');

    return propertiesContent;
}


/**
 * Fetches the latest Gradle wrapper script.
 * 
 * @returns {Promise<string>} The content of the Gradle wrapper script.
 */
export async function generateGradlew() {
    const url = 'https://raw.githubusercontent.com/gradle/gradle/master/gradlew';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch gradlew content: ${response.statusText}`);
    }
    return await response.text();
}

/**
 * Fetches the latest Gradle wrapper batch script.
 * 
 * @returns {Promise<string>} The content of the Gradle wrapper batch script.
 */
export async function generateGradlewBat() {
    const url = 'https://raw.githubusercontent.com/gradle/gradle/master/gradlew.bat';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch gradlew.bat content: ${response.statusText}`);
    }
    return await response.text();
}


/**
 * Generates the type-(common, library, platform).gradle file content.
 * 
 * @param {Object} location - The project details.
 * @returns {Promise<string>} The generated type-(common, library, platform).gradle content.
 */
export async function generatePluginGradle(location) {
    switch (location) {
        case 'common':
            return `// Apply necessary plugins
plugins {
    id 'java-library'      // For creating a Java library
    id 'maven-publish'    // Enables publishing to a Maven repository
}

// Set the archive name using project-specific variables
base {
    archivesName = "\${project_id}-\${project.name}-\${minecraft_version}"
}

java {
    toolchain.languageVersion = JavaLanguageVersion.of(java_version) // Set Java version
    withSourcesJar()   // Include sources JAR
    withJavadocJar()   // Include Javadoc JAR
}

// Define repositories for dependencies
repositories {
    mavenCentral() // Use Maven Central repository

    // Sponge repository for specific dependencies
    exclusiveContent {
        forRepository {
            maven {
                name = 'Sponge'
                url = uri("https://repo.spongepowered.org/repository/maven-public")
            }
        }
        filter { includeGroupAndSubgroups("org.spongepowered") }
    }

    // ParchmentMC and NeoForge repositories
    exclusiveContent {
        forRepositories(
                maven {
                    name = 'ParchmentMC'
                    url = uri("https://maven.parchmentmc.org/")
                },
                maven {
                    name = "NeoForge"
                    url = uri("https://maven.neoforged.net/releases")
                }
        )
        filter { includeGroup("org.parchmentmc.data") }
    }

    // Additional repositories
    maven {
        url = uri("https://maven.twelveiterations.com/repository/maven-public/")
        content { includeGroup "net.blay09.mods" }
    }

    maven {
        name = "BlameJared"
        url = uri("https://maven.blamejared.com")
    }
}

// Declare capabilities for outgoing configurations
['apiElements', 'runtimeElements', 'sourcesElements', 'javadocElements'].each { variant ->
    configurations."$variant".outgoing {
        capability("\${project_group}:\${base.archivesName.get()}:\${project_version}")
        capability("\${project_group}:\${project_id}-\${project.name}-\${minecraft_version}:\${project_version}")
        capability("\${project_group}:\${project_id}:\${project_version}")
    }

    publishing.publications.configureEach {
        suppressPomMetadataWarningsFor(variant) // Suppress metadata warnings
    }
}

// Include the license file in the sources JAR
sourcesJar {
    from(rootProject.file('LICENSE')) {
        rename { "\${it}_\${project_name}" }
    }
}

// Configure the JAR task
jar {
    from(rootProject.file('LICENSE')) {
        rename { "\${it}_\${project_name}" }
    }

    manifest {
        attributes([
                'Specification-Title'   : "\${project_name}",
                'Specification-Vendor'  : "\${project_author}",
                'Specification-Version' : "\${project.jar.archiveVersion}",
                'Implementation-Title'  : "\${project.name}",
                'Implementation-Version': "\${project.jar.archiveVersion}",
                'Implementation-Vendor' : "\${project_author}",
                'Built-On-Minecraft'    : "\${minecraft_version}"
        ])
    }
}

// Process resource files and inject project properties
processResources {
    def expandProps = [
            'project_version'              : "\${project_version}",
            'project_group'                : "\${project.group}",
            'minecraft_version'            : "\${minecraft_version}",
            'pack_format_number'           : "\${pack_format_version}",
            'minecraft_version_range'      : "\${minecraft_version_range}",
            'fabric_version'               : "\${fabric_version}",
            'fabric_loader_version'        : "\${fabric_loader_version}",
            'project_name'                 : "\${project_name}",
            'project_author'               : "\${project_author}",
            'project_id'                   : "\${project_id}",
            'project_license'              : "\${project_license}",
            'project_description'          : "\${project_description}",
            'neoforge_version'             : "\${neoforge_version}",
            'neoforge_loader_version_range': "\${neoforge_loader_version_range}",
            'forge_version'                : "\${forge_version}",
            'forge_loader_version_range'   : "\${forge_loader_version_range}",
            'project_credits'              : "\${project_credits}",
            'java_version'                 : "\${java_version}"
    ]

    filesMatching(['pack.mcmeta', 'fabric.mod.json', 'META-INF/mods.toml', 'META-INF/neoforge.mods.toml', '*.mixins.json']) {
        expand expandProps
    }
    inputs.properties(expandProps)
}

// Configure publishing to a Maven repository
publishing {
    publications {
        register('mavenJava', MavenPublication) {
            artifactId base.archivesName.get()
            from components.java
        }
    }
    repositories {
        maven {
            url System.getenv('local_maven_url') // Use environment variable for repository URL
        }
    }
}

// Include core modules in the JAR
jar {
    from { project(':core:api').sourceSets.main.output }
    from { project(':core:utils').sourceSets.main.output }
}

// Configure Javadoc tasks
tasks.withType(Javadoc).configureEach {
    options.addStringOption('Xdoclint:none', '-quiet') // Suppress doclint warnings
}
`;
        case 'library':
            return `// #type-library.gradle

plugins {
    id 'java-library'
}

base {
    // Set the archive name using project-specific properties.
    archivesName = "\${project_id}-\${project.name}-\${minecraft_version}"
}

java {
    // Configure the Java toolchain to use the specified version.
    toolchain.languageVersion = JavaLanguageVersion.of(java_version)

    // Automatically create sources and Javadoc JARs.
    withSourcesJar()
    withJavadocJar()
}

repositories {
    mavenCentral()

    // Use a dedicated repository for Sponge artifacts.
    exclusiveContent {
        forRepository {
            maven {
                name = 'Sponge'
                url = uri("https://repo.spongepowered.org/repository/maven-public")
            }
        }
        filter { includeGroupAndSubgroups("org.spongepowered") }
    }

    // Use specific repositories for ParchmentMC and NeoForge artifacts.
    exclusiveContent {
        forRepositories(
                maven {
                    name = 'ParchmentMC'
                    url = uri("https://maven.parchmentmc.org/")
                },
                maven {
                    name = "NeoForge"
                    url = uri("https://maven.neoforged.net/releases")
                }
        )
        filter { includeGroup("org.parchmentmc.data") }
    }

    // Additional repository for artifacts from net.blay09.mods.
    maven {
        url = uri("https://maven.twelveiterations.com/repository/maven-public/")
        content {
            includeGroup "net.blay09.mods"
        }
    }

    // Repository for BlameJared artifacts.
    maven {
        name = "BlameJared"
        url = uri("https://maven.blamejared.com")
    }
}

// Configure all Javadoc tasks to suppress Xdoclint warnings.
tasks.withType(Javadoc).configureEach {
    options.addStringOption('Xdoclint:none', '-quiet')
}
`;
        case 'platform':
            return `// #type-platform.gradle

plugins {
    id 'type-common'
}

configurations {
    // Define custom, resolvable configurations for Java sources and resources.
    commonJava {
        canBeResolved = true
    }
    commonResources {
        canBeResolved = true
    }
}

dependencies {
    // Use compileOnly to add a dependency on the common module with a specific capability.
    compileOnly(project(':core:app:common')) {
        capabilities {
            requireCapability "\${project_group}:\${project_id}"
        }
    }
    // Populate the custom configurations from the common module.
    commonJava project(path: ':core:app:common', configuration: 'commonJava')
    commonResources project(path: ':core:app:common', configuration: 'commonResources')
}

// Configure compileJava to compile additional source files from commonJava.
tasks.named('compileJava', JavaCompile) {
    dependsOn configurations.commonJava
    source configurations.commonJava
}

// Include common resources during the processResources task.
processResources {
    dependsOn configurations.commonResources
    from configurations.commonResources
}

// Configure javadoc to document the sources from commonJava.
tasks.named('javadoc', Javadoc).configure {
    dependsOn configurations.commonJava
    source configurations.commonJava
}

// Configure sourcesJar to bundle both commonJava sources and commonResources.
tasks.named('sourcesJar', Jar) {
    dependsOn configurations.commonJava, configurations.commonResources
    from configurations.commonJava
    from configurations.commonResources
}
`;
        default:
            throw new Error("types-(common, library, platform) Gradle Location not recognized!");
    }
}


/**
 * Generates the build.gradle file content for.
 * 
 * @param {Object} location - The project details.
 * @returns {Promise<string>} The generated build.gradle content.
 */
export async function generateBuildGradle(location) {
    switch (location) {
        case 'root':
            return `// Root build.gradle

plugins {
    // Apply necessary plugins
    id 'fabric-loom' version '1.10-SNAPSHOT' apply false
    id 'net.neoforged.moddev' version '1.0.11' apply false
}

subprojects {
    // Centralized Build Artifacts
    layout.buildDirectory = layout.projectDirectory.dir(
            name == 'api' || name == 'utils' ? "\${rootProject.layout.buildDirectory.get()}/core/\${name}" :
                    (name in ['fabric', 'forge', 'neoforge']) ? "\${rootProject.layout.buildDirectory.get()}/core/app/platform/\${name}" :
                            "\${rootProject.layout.buildDirectory.get()}/core/app/\${name}"
    )

    // Centralized Documentation
    tasks.withType(Javadoc).configureEach {
        // Determine the relative path for the Javadoc output
        def relativePath = project.path.replace(':', '/')
        destinationDir = rootProject.file("docs\${relativePath}")
    }
}

// Aggregate Javadoc for all subprojects
tasks.register("aggregateJavadoc", Javadoc) {
    group = "documentation"
    description = "Generates Javadoc for all subprojects in a centralized directory."

    // Collect sources and classpaths from all Java subprojects
    def allJavaSources = files(subprojects.findAll { it.plugins.hasPlugin('java') }.collect { it.sourceSets.main.allJava.srcDirs })
    def allClasspaths = files(subprojects.findAll { it.plugins.hasPlugin('java') }.collect { it.sourceSets.main.compileClasspath })

    // Set the source and classpath for the aggregate Javadoc task
    source = allJavaSources
    classpath = allClasspaths

    // Set the destination directory for the aggregated Javadoc
    destinationDir = rootProject.file("docs/aggregate")
}
`;
        case 'plugins':
            return `// #:Plugins Build.gradle

plugins {
    id('groovy-gradle-plugin')
}
`;
        case 'core:api':
            return `// #:Core:Api Build.gradle

plugins {
    id ("type-library")
}

apply from: rootProject.file('dependencies.gradle')

dependencies {
    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)
}`;
        case 'core:utils':
            return `// #:Core:utils Build.gradle

plugins {
    id ("type-library")
}

apply from: rootProject.file('dependencies.gradle')

dependencies {
    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)
}`;
        case 'core:app:common':
            return `// #:Core:App:Common Build.gradle

plugins {
    id ("type-common")
    id ("net.neoforged.moddev")
}

apply from: rootProject.file("dependencies.gradle")

dependencies {
    api project(':core:api')

    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)

    implementation (libraries.common.kuma)
    implementation (libraries.common.balm) {
        changing = versions.balm.endsWith("SNAPSHOT")
    }

    compileOnly group: 'org.spongepowered', name: 'mixin', version: '0.8.5'
    // fabric and neoforge both bundle mixinextras, so it is safe to use it in common
    compileOnly group: 'io.github.llamalad7', name: 'mixinextras-common', version: '0.3.5'
    annotationProcessor group: 'io.github.llamalad7', name: 'mixinextras-common', version: '0.3.5'
}

neoForge {
    neoFormVersion = neo_form_version
    // Automatically enable AccessTransformers if the file exists
    def at = file('src/main/resources/META-INF/accesstransformer.cfg')
    if (at.exists()) {
        accessTransformers.add(at.absolutePath)
    }
    parchment {
        minecraftVersion = parchment_minecraft
        mappingsVersion = parchment_version
    }
}

configurations {
    commonJava {
        canBeResolved = false
        canBeConsumed = true
    }
    commonResources {
        canBeResolved = false
        canBeConsumed = true
    }
}

artifacts {
    commonJava sourceSets.main.java.sourceDirectories.singleFile
    commonResources sourceSets.main.resources.sourceDirectories.singleFile
}`;
        case 'core:app:platform:fabric':
            return `// #:Core:App:Platform:Fabric Build.gradle

plugins {
    id("type-platform")
    id("fabric-loom")
}

apply from: rootProject.file('dependencies.gradle')

dependencies {
    api project(':core:api')

    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)

    implementation (libraries.fabric.kuma)
    implementation (libraries.fabric.balm) {
        changing = versions.balm.endsWith("SNAPSHOT")
    }

    minecraft "com.mojang:minecraft:\${minecraft_version}"
    mappings loom.layered {
        officialMojangMappings()
        parchment("org.parchmentmc.data:parchment-\${parchment_minecraft}:\${parchment_version}@zip")
    }
    modImplementation "net.fabricmc:fabric-loader:\${fabric_loader_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-api:\${fabric_version}"
}

loom {
    def aw = project(':core:app:common').file("src/main/resources/\${project_id}.accesswidener")
    if (aw.exists()) {
        accessWidenerPath.set(aw)
    }
    mixin {
        defaultRefmapName.set("\${project_id}.refmap.json")
    }
    runs {
        client {
            client()
            setConfigName('Fabric Client')
            ideConfigGenerated(true)
            runDir('runs/client')
        }
        server {
            server()
            setConfigName('Fabric Server')
            ideConfigGenerated(true)
            runDir('runs/server')
        }
    }
}`;
        case 'core:app:platform:forge':
            return `// #:Core:App:Platform:Forge Build.gradle

plugins {
    id("type-platform")

    id 'net.minecraftforge.gradle' version '[6.0.24,6.2)'
    id 'org.spongepowered.mixin' version '0.7-SNAPSHOT'
}

apply from: rootProject.file('dependencies.gradle')

dependencies {
    api project(':core:api')

    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)

    implementation (libraries.forge.kuma)
    implementation (libraries.forge.balm) {
        changing = versions.balm.endsWith("SNAPSHOT")
    }

    minecraft "net.minecraftforge:forge:\${minecraft_version}-\${forge_version}"
    annotationProcessor("org.spongepowered:mixin:0.8.5-SNAPSHOT:processor")

    // Forge's hack fix
    implementation('net.sf.jopt-simple:jopt-simple:5.0.4') { version { strictly '5.0.4' } }
}

base {
    archivesName = "\${project_name}-forge-\${minecraft_version}"
}

mixin {
    config("\${project_id}.mixins.json")
    config("\${project_id}.forge.mixins.json")
}

minecraft {
    mappings channel: 'official', version: minecraft_version

    copyIdeResources = true //Calls processResources when in dev

    reobf = false // Forge 1.20.6+ uses official mappings at runtime, so we shouldn't reobf from official to SRG

    // Automatically enable forge AccessTransformers if the file exists
    // This location is hardcoded in Forge and can not be changed.
    // https://github.com/MinecraftForge/MinecraftForge/blob/be1698bb1554f9c8fa2f58e32b9ab70bc4385e60/fmlloader/src/main/java/net/minecraftforge/fml/loading/moddiscovery/ModFile.java#L123
    // Forge still uses SRG names during compile time, so we cannot use the common AT's
    def at = file('src/main/resources/META-INF/accesstransformer.cfg')
    if (at.exists()) {
        accessTransformer = at
    }

    runs {
        client {
            workingDirectory file('runs/client')
            ideaModule "\${rootProject.name}.\${project.name}.main"
            taskName 'Client'
            mods {
                modClientRun {
                    source sourceSets.main
                }
            }
        }

        server {
            workingDirectory file('runs/server')
            ideaModule "\${rootProject.name}.\${project.name}.main"
            taskName 'Server'
            mods {
                modServerRun {
                    source sourceSets.main
                }
            }
        }

        data {
            workingDirectory file('runs/data')
            ideaModule "\${rootProject.name}.\${project.name}.main"
            args '--mod', project_id, '--all', '--output', file('src/generated/resources/'), '--existing', file('src/main/resources/')
            taskName 'Data'
            mods {
                modDataRun {
                    source sourceSets.main
                }
            }
        }
    }
}

sourceSets.main.resources.srcDir 'src/generated/resources'

publishing {
    publications {
        mavenJava(MavenPublication) {
            fg.component(it)
        }
    }
}

sourceSets.each {
    def dir = layout.buildDirectory.dir("sourcesSets/$it.name")
    it.output.resourcesDir = dir
    it.java.destinationDirectory = dir
}
`;
        case 'core:app:platform:neoforge':
            return `// #:Core:App:Platform:Neoforge Build.gradle

plugins {
    id("type-platform")
    id("net.neoforged.moddev")
}

apply from: rootProject.file('dependencies.gradle')

dependencies {
    api project(':core:api')

    implementation(libraries.global.night_config.core)
    implementation(libraries.global.night_config.toml)
    implementation(libraries.global.night_config.json)

    implementation(libraries.global.log4j.core)
    implementation(libraries.global.log4j.api)

    implementation (libraries.neoforge.kuma)
    implementation (libraries.neoforge.balm) {
        changing = versions.balm.endsWith("SNAPSHOT")
    }

}

neoForge {
    version = neoforge_version
    // Automatically enable neoforge AccessTransformers if the file exists
    def at = project(':core:app:common').file('src/main/resources/META-INF/accesstransformer.cfg')
    if (at.exists()) {
        accessTransformers.add(at.absolutePath)
    }
    parchment {
        minecraftVersion = parchment_minecraft
        mappingsVersion = parchment_version
    }
    runs {
        configureEach {
            systemProperty('neoforge.enabledGameTestNamespaces', project_id)
            ideName = "NeoForge \${it.name.capitalize()} (\${project.path})" // Unify the run config names with fabric
        }
        client {
            client()
        }
        data {
            data()
        }
        server {
            server()
        }
    }
    mods {
        "\${mod_id}" {
            sourceSet sourceSets.main
        }
    }
}

sourceSets.main.resources { srcDir 'src/generated/resources' }
`;
        default:
            throw new Error("Build Gradle Location not recognized!");
    }
}