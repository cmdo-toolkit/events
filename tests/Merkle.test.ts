import { getMerkleRoot, getMerkleTree } from "../src/Utils/Merkle";

const LEAVES_EVEN = ["1", "3", "6", "19", "5", "9", "28", "13", "0", "17"];
const LEAVE_ODD = ["1", "3", "6", "19", "5", "9", "28", "13", "0"];

const merkleRootA = getMerkleRoot(LEAVES_EVEN);
const merkleRootB = getMerkleRoot(LEAVES_EVEN);
const merkleRootC = getMerkleRoot(LEAVE_ODD);

const merkleTreeA = getMerkleTree(LEAVES_EVEN);
const merkleTreeB = getMerkleTree(LEAVES_EVEN);
const merkleTreeC = getMerkleTree(LEAVE_ODD);

describe("Merkle", () => {
  describe("when same list of leaves is provided", () => {
    it("should resolve to the same merkle root", () => {
      expect(merkleRootA).toBe(merkleRootB);
    });

    it("should result in the same tree", () => {
      expect(merkleTreeA).toEqual(merkleTreeB);
    });
  });

  describe("when different list of leaves is provided", () => {
    it("should not resolve to the same merkle root", () => {
      expect(merkleRootA).not.toBe(merkleRootC);
    });

    it("should not result in the same tree", () => {
      expect(merkleTreeA).not.toEqual(merkleTreeC);
    });
  });
});
