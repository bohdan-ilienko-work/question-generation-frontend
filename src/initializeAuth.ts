import { setLoading, logout, setAuthorized } from "./state/authSlice";
import { authApi } from "./state/api/authApi";
import { AppDispatch } from "./store";

export const initializeAuth = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true)); // Set loading state
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    dispatch(logout()); // Exit if no tokens
    dispatch(setLoading(false));

    localStorage.removeItem("accessToken"); // Remove tokens from local storage
    localStorage.removeItem("refreshToken");
    return;
  }

  try {
    const response = await dispatch(
      authApi.endpoints.refreshToken.initiate(refreshToken)
    ).unwrap();

    localStorage.setItem("accessToken", response.responseObject.accessToken); // Update tokens
    localStorage.setItem("refreshToken", response.responseObject.refreshToken);

    dispatch(setAuthorized(true)); // Set authorized state
  } catch (error) {
    console.error(error);
    dispatch(logout()); // Logout if error
  } finally {
    dispatch(setLoading(false)); // Set loading state
  }
};
