export interface LoginResponse {
    refresh: string;
    access: string;
}
export interface RegisterResponse {
    mensaje: string;
}

export interface VerifyAccountResponse {
    mensaje: string;
}

export interface ResendCodeResponse {
    mensaje: string;
}

export interface RefreshResponse {
    access: string;
}

export interface UserDetail {
    count:    number;
    next:     boolean;
    previous: boolean;
    results:  User[];
}

export interface User {
    username:         string;
    password:         string;
    last_login:       string;
    is_superuser:     boolean;
    first_name:       string;
    last_name:        string;
    is_staff:         boolean;
    is_active:        boolean;
    date_joined:      string;
    email:            string;
    phone:            number;
    cargo:            string;
    groups:           number[];
    user_permissions: number[];
    zonas:            number[];
}
