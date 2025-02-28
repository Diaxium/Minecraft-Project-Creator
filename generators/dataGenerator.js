/**
 * Generates Mixin configuration data based on project details and type.
 * 
 * @param {string} type - The type of mixin (common, fabric, forge, neoforge).
 * @param {Object} answers - Project details.
 * @returns {Promise<string>} The generated JSON mixin data.
 */
export async function generateMixinData(type, answers) {
    const compatibilityLevels = {
        common: "JAVA_18",
        fabric: "JAVA_21",
        forge: "JAVA_18",
        neoforge: "JAVA_21"
    };

    const data = {
        required: true,
        minVersion: "0.8",
        package: `${answers.project_group}.${answers.project_id}.mixins`,
        refmap: "${project_id}.refmap.json",
        compatibilityLevel: compatibilityLevels[type] || "JAVA_18",
        mixins: [],
        client: [],
        server: [],
        injectors: {
            defaultRequire: 1
        }
    };

    return JSON.stringify(data, null, 2);
}

/**
 * Generates pack metadata for Minecraft resource packs.
 * 
 * @returns {Promise<string>} The generated JSON pack metadata.
 */
export async function generatePackData() {
    const data = {
        "pack": {
            "description": "${project_name}",
            "pack_format": "${pack_format_number}"
        }
    };
    return JSON.stringify(data, null, 2);
}

/**
 * Builds a TOML string representation of a given data object.
 * 
 * @param {Object} data - The data to convert into TOML format.
 * @returns {Promise<string>} The generated TOML string.
 */
async function buildTomlString(data) {
    function serialize(obj, prefix = "") {
        let result = "";

        for (const [key, value] of Object.entries(obj)) {
            const tomlKey = prefix ? `${prefix}.${key}` : key;

            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === "object") {
                    value.forEach((item) => {
                        result += `[[${tomlKey}]]\n${serialize(item, "")}\n`;
                    });
                } else {
                    result += `${tomlKey} = [${value.map(formatValue).join(", ")}]\n`;
                }
            } else if (typeof value === "object" && value !== null) {
                if (Object.keys(value).length > 0) {
                    result += `\n[${tomlKey}]\n${serialize(value, "")}`;
                }
            } else {
                result += `${tomlKey} = ${formatValue(value)}\n`;
            }
        }
        return result.trim() + "\n";
    }

    function formatValue(value) {
        if (typeof value === "string") return `"${value}"`;
        if (typeof value === "boolean") return value ? "true" : "false";
        return value;
    }

    return serialize(data);
}

/**
 * Generates the mods.toml configuration for Forge or NeoForge.
 * 
 * @param {string} type - The type of modloader (forge, neoforge).
 * @returns {Promise<string>} The generated TOML string.
 */
export async function generateModsToml(type) {
    const loaderVersion =
        type === "forge" ? "${forge_loader_version_range}" :
        type === "neoforge" ? "${neoforge_loader_version_range}" : "";

    const versionRange =
        type === "forge" ? "[${forge_version},)" :
        type === "neoforge" ? "[${neoforge_version},)" : "";

    const data = {
        modLoader: "javafml",
        loaderVersion,
        license: "${project_license}",
        mods: [
            {
                modId: "${project_id}",
                version: "${project_version}",
                displayName: "${project_name}",
                logoFile: "${project_id}/icon.png",
                credits: "${project_credits}",
                authors: "${project_author}",
                description: `'''\${project_description}'''`,
            }
        ],
        [`dependencies."\${project_id}"`]: [
            {
                modId: type,
                mandatory: true,
                versionRange,
                ordering: "NONE",
                side: "BOTH",
            },
            {
                modId: "minecraft",
                mandatory: true,
                versionRange: "${minecraft_version_range}",
                ordering: "NONE",
                side: "BOTH",
            }
        ]
    };

    return await buildTomlString(data);
}

/**
 * Generates the mods.json configuration for Fabric.
 * 
 * @param {Object} answers - Project details.
 * @returns {Promise<string>} The generated JSON mods configuration.
 */
export async function generateModsJson(answers) {
    const data = {
        "schemaVersion": 1,
        "id": "${project_id}",
        "version": "${project_version}",
        "name": "${project_name}",
        "description": "${project_description}",
        "authors": ["${project_author}"],
        "contact": {
            "homepage": "https://fabricmc.net/",
            "sources": "https://github.com/FabricMC/fabric-example-mod"
        },
        "license": "${project_license}",
        "icon": "${project_id}/icon.png",
        "environment": "*",
        "entrypoints": {
            "main": [
                `${answers.project_group}.${answers.project_id}.FabricBootstrap`
            ]
        },
        "mixins": [
            "${project_id}.mixins.json",
            "${project_id}.fabric.mixins.json"
        ],
        "depends": {
            "fabricloader": ">=${fabric_loader_version}",
            "fabric-api": "*",
            "minecraft": "${minecraft_version}",
            "java": ">=${java_version}"
        },
        "suggests": {
            "another-mod": "*"
        }
    };

    return JSON.stringify(data, null, 2);
}
