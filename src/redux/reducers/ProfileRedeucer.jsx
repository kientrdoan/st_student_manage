import { GET_PROFILE } from "../types/ProfileType";

const stateDefault = {
  profiles: [],
  profile_detail: {},
};

export const ProfileReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_PROFILE: {
      state.profile = action.profile;
      return { ...state };
    }

    default:
      return { ...state };
  }
};