const DEFAULT_STATE = {
  success: false,
  user: {
    id: 0,
    name: "",
    nip: "",
    email: "",
    email_verified_at: null,
    password: "",
    no_telp: "",
    alamat: "",
    foto: "",
    role: "",
    remember_token: null,
    created_at: null,
    updated_at: null,
  },
  token: "",
};

export const userReducer = (state = DEFAULT_STATE, action: any) => {
  if (action.type === "SET_USER") {
    console.log(
      "🚀 ~ file: user.ts ~ line 10 ~ userReducer ~ action",
      action.payload.user
    );
    const dupState = { ...state };

    dupState.success = action.payload.success;

    if (action.payload.success) {
      dupState.user = action.payload.user;
      dupState.token = action.payload.token;
    }

    return dupState;
  } else if (action.type === "LOGOUT_USER") {
    return DEFAULT_STATE;
  }

  return state;
};
