import { api } from "./provider";

export async function tryLogin(request: LoginRequest): Promise<LoginResponse> {
    const response = await api().post('auth/login', request);
    // console.log('login response', response);
    return response.data as LoginResponse;
}

export async function tryExtendSession(): Promise<LoginResponse> {
    const response = await api().post('auth/extendSession');
    // console.log('extendSession response', response);
    return response.data as LoginResponse;
}



export async function tryLogout() {
    await api().post('auth/logout');
}



export interface LoginRequest {
    readonly groupId: number;
    readonly userId: number;
    readonly password: string;
    readonly loginMode: LoginRequestMode;
}

export enum LoginRequestMode {
    Web = 0,
    ExternalKey = 1,
}

export interface LoginResponse {
    readonly token: string;
    readonly expiresAt: string;
    readonly userId: number;
    readonly groupId: number;
    readonly loginMode: LoginRequestMode;
}


