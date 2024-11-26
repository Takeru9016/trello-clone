import { List } from "@/types/task";

export function loadFromStorage(): List[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("trelloLists");
  return saved ? JSON.parse(saved) : [];
}

export function saveToStorage(lists: List[]): void {
  localStorage.setItem("trelloLists", JSON.stringify(lists));
}
