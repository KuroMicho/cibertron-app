export interface Data {
    iv: string;
    encryptedData: string;
}

export interface InfoUser {
    ip: Data;
    username: string;
}

export interface InfoTime {
    ip: Data;
    time: string;
}

export interface Credentials {
    ip: string;
    name: string;
    password: string;
}
