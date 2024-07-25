import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Auth } from "aws-amplify";
import LoginScreen from "../components/Login";

jest.mock("aws-amplify", () => ({
  Auth: {
    signIn: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
  },
}));

describe("LoginScreen", () => {
  it("should call signIn and navigate to DrawerNav screen on successful login", async () => {
    const signInMock = Auth.signIn as jest.Mock;
    const currentAuthenticatedUserMock = Auth.currentAuthenticatedUser as jest.Mock;

    const user = { /* mock user object */ };
    signInMock.mockResolvedValueOnce();
    currentAuthenticatedUserMock.mockResolvedValueOnce(user);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("email");
    const passwordInput = getByPlaceholderText("password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("test@example.com", "password");
      expect(currentAuthenticatedUserMock).toHaveBeenCalled();
      expect(/* navigation assertion */).toHaveBeenCalled();
    });
  });

  it("should handle error on failed login", async () => {
    const signInMock = Auth.signIn as jest.Mock;
    const handleErrorMock = jest.fn();

    signInMock.mockRejectedValueOnce(new Error("Login failed"));

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("email");
    const passwordInput = getByPlaceholderText("password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("test@example.com", "password");
      expect(handleErrorMock).toHaveBeenCalledWith("signIn", new Error("Login failed"), /* setIsLoading assertion */);
    });
  });
});