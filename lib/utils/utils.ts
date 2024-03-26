import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function compareStringArrays(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const frequencyMap: Record<string, number> = {};

  // Count frequencies of elements in arr1
  for (const elem of arr1) {
    frequencyMap[elem] = (frequencyMap[elem] || 0) + 1;
  }

  // Decrement frequencies based on elements in arr2
  for (const elem of arr2) {
    if (!frequencyMap[elem]) {
      return false; // Element not present in arr1
    }
    frequencyMap[elem]--;
  }

  // Check if all frequencies are zero
  for (const key in frequencyMap) {
    if (frequencyMap[key] !== 0) {
      return false; // Frequencies don't match
    }
  }

  return true; // Both arrays are the same
}

export function findAssigneesDifferences(
  existingUsers: string[],
  updatedUsers: string[]
): { addedAssignees: string[]; removedAssignees: string[] } {
  // Check if either array is empty
  if (existingUsers.length === 0 && updatedUsers.length === 0) {
    return { addedAssignees: [], removedAssignees: [] };
  } else if (existingUsers.length === 0) {
    return { addedAssignees: updatedUsers, removedAssignees: [] };
  } else if (updatedUsers.length === 0) {
    return { addedAssignees: [], removedAssignees: existingUsers };
  }

  const existingSet = new Set(existingUsers);
  const updatedSet = new Set(updatedUsers);
  const addedAssignees: string[] = [];
  const removedAssignees: string[] = [];

  // Find added assignees
  for (const user of updatedUsers) {
    if (!existingSet.has(user)) {
      addedAssignees.push(user);
    }
  }

  // Find removed assignees
  for (const user of existingUsers) {
    if (!updatedSet.has(user)) {
      removedAssignees.push(user);
    }
  }

  return { addedAssignees, removedAssignees };
}
