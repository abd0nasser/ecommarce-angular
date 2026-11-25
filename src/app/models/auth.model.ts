export interface User { name: string; email: string; role?: string; }
export interface AuthResponse { message: string; user: User; token: string; }
export interface SignInPayload { email: string; password: string; }
export interface SignUpPayload { name: string; email: string; phone: string; password: string; rePassword: string; }
export interface ChangePasswordPayload { currentPassword: string; password: string; rePassword: string; }
