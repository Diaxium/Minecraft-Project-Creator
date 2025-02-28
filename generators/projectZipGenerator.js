import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

/**
 * Recursively adds files and folders to the ZIP archive.
 * @param {JSZip} zipFolder - The JSZip folder object.
 * @param {Object} file - File or folder object.
 */
async function addFileOrFolder(zipFolder, file) {
    if (file.children && Array.isArray(file.children)) {
        // Create a folder and process children recursively
        const folder = zipFolder.folder(file.path);
        await Promise.all(file.children.map(child => addFileOrFolder(folder, child)));
    } else if (file.content !== undefined) {
        // Add file to the ZIP
        zipFolder.file(file.path, file.content);
    } else {
        console.warn(`Skipping invalid entry: ${JSON.stringify(file)}`);
    }
}

/**
 * Generates a ZIP archive from the provided project files and folders.
 * @param {Object} config - Project configuration, including the name.
 * @param {Array} files - List of file/folder objects.
 * @returns {Promise<Buffer>} - The generated ZIP buffer.
 */
export async function generateProjectZip(config, files) {
    try {
        const zip = new JSZip();
        const root = zip.folder(config.project_name);

        await Promise.all(files.map(file => addFileOrFolder(root, file)));

        // Generate ZIP buffer
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // Optional: Write to file
        const zipPath = path.join(process.cwd(), `${config.project_name}.zip`);
        fs.writeFileSync(zipPath, zipBuffer);
        console.log(`ZIP file created: ${zipPath}`);

        return zipBuffer; // Return the ZIP buffer for further use if needed
    } catch (error) {
        console.error("Error generating ZIP file:", error);
        throw error;
    }
}
