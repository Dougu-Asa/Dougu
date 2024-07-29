
import { Auth } from "aws-amplify";
import { render, fireEvent, act } from "@testing-library/react-native";

import { MockUserProvider, MockLoadingProvider } from "./MockProviders";
import LoginScreen from "../../components/Login";
import { handleError } from "../../helper/Utils";

/*
    Test login.tsx file and ensure that the user can sign in successfully
    and that errors are handled correctly
*/

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock("aws-amplify", () => ({
  Auth: {
    signIn: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
  },
}));

jest.mock("../../helper/Utils", () => ({
  handleError: jest.fn(),
}));

describe("signIn", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("signs in a user successfully", async () => {
        const username = "T@gmail.com";
        const password = "Tassword";
        const mockUser = { username };

        Auth.signIn.mockResolvedValueOnce({});
        Auth.currentAuthenticatedUser.mockResolvedValueOnce(mockUser);

        const { getByTestId } = render(
            <MockLoadingProvider>
                <MockUserProvider>
                    <LoginScreen navigation={mockNavigation}/>
                </MockUserProvider>
            </MockLoadingProvider>
        );

        const emailInput = getByTestId("emailInput");
        act(() => {
            fireEvent.changeText(emailInput, username);
        });

        const passwordInput = getByTestId("passwordInput");
        act(() => {
            fireEvent.changeText(passwordInput, password);
        });

        const signInButton = getByTestId('signInButton');
        await act(async () => {
            fireEvent.press(signInButton);
        });

        expect(Auth.signIn).toHaveBeenCalledWith(username, password);
        expect(Auth.currentAuthenticatedUser).toHaveBeenCalled();
        expect(handleError).not.toHaveBeenCalled();
    });

    it("handles errors during sign in", async () => {
        const username = null;
        const password = null;
        const error = new Error('sign in failed');

        Auth.signIn.mockRejectedValueOnce(error);

        const { getByTestId } = render(
            <MockLoadingProvider>
                <MockUserProvider>
                    <LoginScreen navigation={mockNavigation}/>
                </MockUserProvider>
            </MockLoadingProvider>
        );

        const emailInput = getByTestId("emailInput");
            await act(async () => {
            fireEvent.changeText(emailInput, username);
        });

        const passwordInput = getByTestId("passwordInput");
            await act(async () => {
            fireEvent.changeText(passwordInput, password);
        });

        const signInButton = getByTestId('signInButton');
            await act(async () => {
            fireEvent.press(signInButton);
        });

        expect(Auth.signIn).toHaveBeenCalledWith(username, password);
        expect(handleError).toHaveBeenCalledWith('signIn', error, expect.any(Function));
    });
});
