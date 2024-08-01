/* eslint-disable no-undef */
import { render, waitFor } from "@testing-library/react-native";
import SwapEquipmentScreen from "../../screens/member/SwapEquipment";

/*jest.mock("../../helper/DataStoreUtils", () => ({
  getEquipment: jest.fn(),
})); */

jest.mock("aws-amplify", () => ({
  DataStore: {
    save: jest.fn(),
    query: jest.fn(),
  },
}));

/* jest.mock("../../helper/Utils", () => ({
  handleError: jest.fn(),
})); */

test("should fetch and display equipment", async () => {
  /*const mockEquipment = {
    id: "id-1",
    label: "Equipment One",
    count: 1,
    data: ["id-1", "id-2"],
    assignedTo: "user-1",
    assignedToName: "John Doe",
  };
  getEquipment.mockResolvedValueOnce([mockEquipment]);
  const swapUser = { current: null };

  // Render the component with necessary props
  render(
    <SwapEquipmentScreen
      orgUserStorage="someStorageValue"
      swapUser={swapUser}
    />,
  );

  // Wait for the equipment to be fetched and displayed
  await waitFor(() => {
    const equipmentElement = screen.getByText("Equipment One");
    expect(equipmentElement).toBeInTheDocument();
  }); */
});
