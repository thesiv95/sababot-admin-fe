/* Modify state array to visualize GUI changes */

import type { Word } from "@/types/word.type";
import type { Lesson } from "@/types/lesson.type";
import type { Reminder } from "@/types/reminder.type";

export const afterInsert = (itemsStateArray: Word[], newItem: Word) => {
  // add latest item
  itemsStateArray.unshift(newItem);

  // then remove oldest item
  itemsStateArray.pop();

  return itemsStateArray;
};

export const afterRename = (
  itemsStateArray: Word[],
  oldItem: Word,
  newItem: Word
) => {
  // replace by _id
  return itemsStateArray.map((item) => {
    if (item._id === oldItem._id) {
      return newItem;
    }
    return item;
  });
};

export const afterDelete = (
  itemsStateArray: Word[],
  itemIdToRemove: string
) => {
  // not the best solution but filter by _id
  return itemsStateArray.filter((item) => item._id !== itemIdToRemove);
};

export const afterInsertLesson = (
  itemsStateArray: Lesson[],
  newItem: Lesson
) => {
  // add latest item
  itemsStateArray.unshift(newItem);

  // then remove oldest item
  itemsStateArray.pop();

  return itemsStateArray;
};

export const afterRenameLesson = (
  itemsStateArray: Lesson[],
  oldItem: Lesson,
  newItem: Lesson
) => {
  // replace by _id
  return itemsStateArray.map((item) => {
    if (item._id === oldItem._id) {
      return newItem;
    }
    return item;
  });
};

export const afterDeleteLesson = (
  itemsStateArray: Lesson[],
  itemIdToRemove: string
) => {
  // not the best solution but filter by userId
  return itemsStateArray.filter((item) => item._id !== itemIdToRemove);
};

export const afterInsertReminder = (
  itemsStateArray: Reminder[],
  newItem: Reminder
) => {
  // add latest item
  itemsStateArray.unshift(newItem);

  // then remove oldest item
  itemsStateArray.pop();

  return itemsStateArray;
};

export const afterDeleteReminder = (
  itemsStateArray: Reminder[],
  userIdToRemove: string
) => {
  return itemsStateArray.filter((item) => item.userId !== userIdToRemove);
};

export const afterChangeReminderStatus = (
  itemsStateArray: Reminder[],
  nickNameToModify: string,
  isActive: boolean
) => {
  // find by userId and set isActive flag
  return itemsStateArray.map((item) => {
    if (item.userId === nickNameToModify) {
      item.isActive = isActive;
      return item;
    }
    return item;
  });
};
