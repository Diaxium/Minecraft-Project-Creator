# Minecraft Mod Generator

## Overview
A lightweight Node.js utility designed to streamline the creation of custom Minecraft mods using the **Modular Multi-Loader Template**. This tool automates the setup process by generating essential files and configurations, allowing you to focus on development.

## Features
- Interactive CLI for gathering project details
- Generates Gradle build files and a structured project setup
- Supports multiple Minecraft mod loaders: **Fabric, Forge, NeoForge**
- Includes mod metadata files and licensing options
- Produces a fully packaged ZIP file ready for development

## Prerequisites
Ensure you have the following installed before using this tool:

- [Node.js](https://nodejs.org/) (latest recommended version)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Gradle](https://gradle.org/) (for managing dependencies)

## Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/Diaxium/Minecraft-Project-Creator.git
cd minecraft-mod-generator
npm install
```

Additionally, install the required npm packages:

```sh
npm install @inquirer/prompts jszip
```

## Usage
Run the generator using:

```sh
node main.js
```

Follow the interactive prompts to configure your mod. Upon completion, a ZIP file containing the mod project will be generated with all necessary files and configurations.

## Generated Project Structure
The tool creates the following directory structure:

```
<mod-project>/
├── build.gradle
├── gradle.properties
├── dependencies.gradle
├── settings.gradle
├── LICENSE
├── README.md
├── gradlew
├── gradlew.bat
├── gradle/
├── plugins/
├── core/
│   ├── api/
│   ├── utils/
│   ├── app/
│   │   ├── common/
│   │   ├── platform/
│   │   │   ├── fabric/
│   │   │   ├── forge/
│   │   │   ├── neoforge/
```

## Configuration
The tool will prompt you for the following details:

- **Project Name** – Name of your mod project
- **Project Version** – Version number (e.g., 1.0.0)
- **Project Group** – Java package group identifier
- **Mod Title & ID** – Mod's display name and unique identifier
- **License Selection** – Choose from MIT, Apache-2.0, GPL-3.0, or a custom license
- **Minecraft Version** – Compatible Minecraft version
- **Mod Loader** – Choose from Fabric, Forge, or NeoForge
- **Java & Gradle Versions** – Specify compatible versions

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributions
Contributions are welcome! Submit issues or pull requests to help improve this tool.

