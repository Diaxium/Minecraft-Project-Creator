/**
 * Generates a README file content based on the provided project details.
 * 
 * @param {Object} answer - An object containing project details.
 * @returns {string} - The formatted README content as a string.
 */
export async function generateREADME(answer) {
    const licenseBadge = `https://img.shields.io/badge/license-${encodeURIComponent(answer.project_license)}-blue.svg`;

    return `# ${answer.project_title}

![License](${licenseBadge})

## Overview
${answer.project_description || 'No description provided.'}

## Project Information

- **Project Name:** ${answer.project_name}
- **Version:** ${answer.project_version}
- **Group:** ${answer.project_group}
- **ID:** ${answer.project_id}
- **License:** ${answer.project_license}
- **Minecraft Version:** ${answer.minecraft_version}
- **Minecraft Version Range:** ${answer.minecraft_version_range}
- **Java Version:** ${answer.java_version}
- **Gradle Version:** ${answer.gradle_version}

## Dependencies

| Dependency               | Version                      |
|-------------------------|----------------------------|
| **NeoForm**             | ${answer.neo_form_version}   |
| **Parchment Minecraft** | ${answer.parchment_minecraft} |
| **Parchment Version**   | ${answer.parchment_version} |
| **Fabric API**          | ${answer.fabric_version}    |
| **Fabric Loader**       | ${answer.fabric_loader_version} |
| **Forge**               | ${answer.forge_version} |
| **Forge Loader Version** | ${answer.forge_loader_version_range} |
| **NeoForge**            | ${answer.neoforge_version} |
| **NeoForge Loader Version** | ${answer.neoforge_loader_version_range} |
| **Balm**                | 21.0.29-SNAPSHOT |
| **Kuma**                | [21.0,21.2) |
| **Night Config**        | 3.8.1 |
| **Log4j**               | 2.20.0 |

## Installation & Usage

### Prerequisites
- Java ${answer.java_version}+
- Gradle ${answer.gradle_version}+
- A compatible Minecraft client (${answer.minecraft_version})

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with any improvements.

## License
This project is licensed under the \`${answer.project_license}\` License. See the \`LICENSE\` file for more details.

## Credits
${answer.project_author ? `Project author: \`${answer.project_author}\`` : '*(No author specified.)*'}
${answer.project_credits ? `### Additional Credits\n${answer.project_credits}` : ''}

## Contact
For any issues or questions, please open an issue in the repository.`;
}
