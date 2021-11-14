import * as CryptoJS from "crypto-js";

type MerkleTree = {
  root: string;
  tree: string[][];
  levels: number;
};

export function getMerkleRoot(leaves: string[]): string {
  return getMerkleTree(leaves).root;
}

export function getMerkleTree(leaves: string[], tree: string[][] = [], layer = 0): MerkleTree {
  const nodes = (tree[layer] = getNodes(leaves));
  if (nodes.length > 1) {
    return getMerkleTree(nodes, tree, layer + 1);
  }
  return {
    root: tree[tree.length - 1][0],
    tree,
    levels: layer
  };
}

export function getNodes(leaves: string[]) {
  const nodes: string[] = [];
  for (let i = 0, len = leaves.length; i < len; i += 2) {
    nodes.push(CryptoJS.SHA1(leaves[i] + leaves[i + 1] ?? leaves[i]).toString());
  }
  return nodes;
}
