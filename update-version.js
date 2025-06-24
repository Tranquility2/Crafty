const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, 'version.txt');
const indexFilePath = path.join(__dirname, 'index.html');

// Function to bump the version number (patch version)
function bumpVersion(version) {
    const parts = version.split('.');
    if (parts.length !== 3) {
        console.error('Invalid version format in version.txt. Expected format: X.Y.Z');
        return version; // Return original version if format is unexpected
    }
    const patch = parseInt(parts[2], 10);
    if (isNaN(patch)) {
         console.error('Invalid patch version in version.txt. Expected a number.');
         return version; // Return original version if patch is not a number
    }
    const newPatch = patch + 1;
    return `${parts[0]}.${parts[1]}.${newPatch}`;
}

// Read the version from version.txt
fs.readFile(versionFilePath, 'utf8', (err, version) => {
    if (err) {
        console.error('Error reading version.txt:', err);
        return;
    }

    const currentVersion = version.trim();
    const newVersion = bumpVersion(currentVersion);

    if (newVersion === currentVersion) {
        console.error('Version not updated due to format error in version.txt');
        return;
    }

    // Read index.html
    fs.readFile(indexFilePath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error reading index.html:', err);
            return;
        }

        // Update the version in the span element
        let updatedHtmlContent = htmlContent.replace(
            /(<span id="version">Version )[\d\.]+(<\/span>)/g,
            `$1${newVersion}$2`
        );

        // Update the version in the script tag
        updatedHtmlContent = updatedHtmlContent.replace(
            /(<script src="script\.js\?v=)[\d\.]+(">)/g,
            `$1${newVersion}$2`
        );

        // Write the updated content back to index.html
        fs.writeFile(indexFilePath, updatedHtmlContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to index.html:', err);
                return;
            }
            console.log(`Updated versions in index.html to ${newVersion}`);

            // Write the new version back to version.txt
            fs.writeFile(versionFilePath, newVersion, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to version.txt:', err);
                    return;
                }
                console.log(`Bumped version.txt to ${newVersion}`);
            });
        });
    });
});