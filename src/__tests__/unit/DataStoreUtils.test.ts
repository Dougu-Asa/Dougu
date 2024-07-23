import { DataStore } from "@aws-amplify/datastore";
import { Equipment, OrgUserStorage } from "../../models";
import { EquipmentObj } from "../../types/ModelTypes";
import {
  getEquipment,
  processEquipmentData,
} from "../../helper/DataStoreUtils";

jest.mock("@aws-amplify/datastore");

describe("DataStoreUtils", () => {
  describe("getEquipment", () => {
    it("should return processed equipment data for a given OrgUserStorage id", async () => {
      const orgUserStorageId = "orgUserStorageId";
      const orgUserStorage = { id: orgUserStorageId };
      const equipment = [
        { id: "equipmentId1", name: "equipment1", assignedTo: orgUserStorage },
        { id: "equipmentId2", name: "equipment2", assignedTo: orgUserStorage },
        { id: "equipmentId3", name: "equipment1", assignedTo: orgUserStorage },
      ];
      const processedEquipmentData = [
        {
          id: "equipmentId1",
          label: "equipment1",
          count: 2,
          data: ["equipmentId1", "equipmentId3"],
        },
        {
          id: "equipmentId2",
          label: "equipment2",
          count: 1,
          data: ["equipmentId2"],
        },
      ];

      (DataStore.query as jest.Mock).mockResolvedValueOnce(orgUserStorage);
      (DataStore.query as jest.Mock).mockResolvedValueOnce(equipment);

      const result = await getEquipment(orgUserStorageId);

      expect(DataStore.query).toHaveBeenCalledWith(
        OrgUserStorage,
        orgUserStorageId,
      );
      expect(DataStore.query).toHaveBeenCalledWith(
        Equipment,
        expect.any(Function),
      );
      expect(result).toEqual(processedEquipmentData);
    });

    it("should handle error when OrgUserStorage does not exist", async () => {
      const orgUserStorageId = "orgUserStorageId";
      const error = new Error("OrgUserStorage does not exist!");

      (DataStore.query as jest.Mock).mockResolvedValueOnce(undefined);

      const handleErrorMock = jest.spyOn(console, "error").mockImplementation();

      await getEquipment(orgUserStorageId);

      expect(DataStore.query).toHaveBeenCalledWith(
        OrgUserStorage,
        orgUserStorageId,
      );
      expect(handleErrorMock).toHaveBeenCalledWith("GetEquipment", error, null);

      handleErrorMock.mockRestore();
    });
  });

  describe("processEquipmentData", () => {
    it("should return processed equipment data with duplicates merged", () => {
      const equipment = [
        { id: "equipmentId1", name: "equipment1" },
        { id: "equipmentId2", name: "equipment2" },
        { id: "equipmentId3", name: "equipment1" },
      ];
      const processedEquipmentData = [
        {
          id: "equipmentId1",
          label: "equipment1",
          count: 2,
          data: ["equipmentId1", "equipmentId3"],
        },
        {
          id: "equipmentId2",
          label: "equipment2",
          count: 1,
          data: ["equipmentId2"],
        },
      ];

      const result = processEquipmentData(equipment);

      expect(result).toEqual(processedEquipmentData);
    });
  });
});
