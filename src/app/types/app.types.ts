export interface Terminal {
    id: number;
    name: string;
    ip: string;
    status: boolean;
    timer: string;
}

export interface Credentials {
    ip: string;
    name: string;
    password: string;
}

export interface Settings {
    panelControl: boolean;
    acceptTerms: boolean;
}
