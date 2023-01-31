// import path from 'path';
import { NodeSSH } from 'node-ssh';
// const notifier = require('node-notifier');
// const home = path.join(process.env?.USERPROFILE || process.env?.HOMEPATH || 'User');

export default class SSH {
    public readonly ssh!: NodeSSH;
    public readonly ip: string;
    public readonly username: string;
    // private privateKeyPath?: string;
    // private passphrase?: string;
    private password!: string;
    private readonly tryKeyboard: boolean;

    constructor(ip: string, username: string) {
        this.ip = ip;
        this.username = username;
        this.ssh = new NodeSSH();
        // this.privateKeyPath = `${home}\\.ssh\\id_ecdsa`;
        // this.passphrase = 'kevin';
        this.tryKeyboard = true;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public setConnection() {
        return this.ssh.connect({
            host: this.ip,
            username: this.username,
            // privateKeyPath: this.privateKeyPath,
            // passphrase: this.passphrase,
            password: this.password,
            tryKeyboard: this.tryKeyboard,
        });
        // .then(() => {
        //     console.log('Connected to the remote machine successfully!');
        //     // notifier.notify("Connected to the remote machine successfully!");
        //     // DisableControlPanel(0);
        //     // DisableIllegalApps(['.exe', '.msi']);
        //     // CreateLocalGroup("CiberCOL");
        //     // ViewUserAccounts();
        //     // AddUserToGroup("CiberCOL", "Kevin");
        // })
        // .catch((error: any) => {
        //     console.error('Error connecting to the remote machine: ', error);
        // });
    }

    public disableControlPanel(value = 1) {
        return this.ssh.execCommand(
            `reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v "NoControlPanel" /t REG_DWORD /d ${value} /f`
        );
    }
}

// async function DisableIllegalApps(value = ['.exe']) {
//     // reg add <keyname> [{/v valuename | /ve}] [/t datatype] [/s separator] [/d data] [/f] More in:https://learn.microsoft.com/es-es/windows-server/administration/windows-commands/reg-add
//     let extensions = '';
//     value.forEach((str) => {
//         ssh.execCommand(
//             `reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Associations" /v "LowRiskFileTypes" /t REG_SZ /d ${(extensions +=
//                 str + ',')} /f`
//         ).then(function (result) {
//             console.log('STDOUT: ' + result.stdout);
//             console.log('STDERR: ' + result.stderr);
//         });
//     });
// }

// async function CreateLocalGroup(name) {
//     // https://en.wikiversity.org/wiki/Net_(command)/Localgroup
//     ssh.execCommand(`net localgroup ${name} /add`).then(function (result) {
//         console.log('STDOUT: ' + result.stdout);
//         console.log('STDERR: ' + result.stderr);
//     });
// }

// async function ViewLocalGroups() {
//     SSH.exec('net localgroup').then(function (result) {
//         console.log('STDOUT: ' + result.stdout);
//         console.log('STDERR: ' + result.stderr);
//     });
// }

// async function ViewUserAccounts() {
//     ssh.execCommand(`net user`).then(function (result) {
//         const accounts: string[] = [];
//         const splittedString = result.stdout.split('\n');

//         for (let num = 2; num <= 3; num++) {
//             let filteredString = splittedString.filter((elem) => elem.trim() !== '')[num];
//             accounts.push(filteredString.match(/\b[A-Za-z]+\b/g)?.[0] || 'Administrator');
//         }
//         console.log('STDOUT: ', accounts);
//         console.log('STDERR: ' + result.stderr);
//     });
// }

// async function AddUserToGroup(groupname, user) {
//     ssh.execCommand(`net localgroup ${groupname} ${user} /add`).then(function (result) {
//         console.log('STDOUT: ' + result.stdout);
//         console.log('STDERR: ' + result.stderr);
//     });
// }
