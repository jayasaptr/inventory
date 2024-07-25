export interface UserModel {
  success: boolean;
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  nip: string;
  email: string;
  email_verified_at: null;
  password: string;
  no_telp: string;
  alamat: string;
  foto: string;
  role: string;
  remember_token: null;
  created_at: null;
  updated_at: null;
}
