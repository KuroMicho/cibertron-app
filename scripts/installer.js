/* eslint-disable */
const electronInstaller = require('electron-winstaller');
const path = require('path');

async function handleInstaller() {
    console.log('Creating windows installer');
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: `${path.join(__dirname, '..', 'out', 'cibertron-win32-x64')}`,
            authors: 'KuroMicho & YosstinCode',
            outputDirectory: `${path.join(__dirname, '..', 'out', 'cibertron')}`,
            exe: 'cibertron.exe',
            // skipUpdateIcon: true,
            // setupExe: 'cibertron-Installer.exe',
            // setupMsi: 'cibertron.msi',
            // setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico'),
        });
    } catch (error) {
        console.log(error);
    }
}
handleInstaller();
