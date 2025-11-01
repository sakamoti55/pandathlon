"use server";

import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle bookmark status for a quiz
 * @param {number} quizId - The quiz ID to bookmark/unbookmark
 * @returns {Promise<{success: boolean, bookmarked: boolean, error?: string}>}
 */
export async function toggleBookmark(quizId) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, bookmarked: false, error: "ログインが必要です" };
  }

  try {
    // Check if bookmark exists
    const { data: existing } = await supabase
      .from("bookmarks")
      .select()
      .eq("quiz_id", quizId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Remove bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("quiz_id", quizId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Revalidate paths
      revalidatePath(`/quizzes/${quizId}`);
      revalidatePath("/mypage/favorite");

      return { success: true, bookmarked: false };
    } else {
      // Add bookmark
      const { error } = await supabase
        .from("bookmarks")
        .insert({ quiz_id: quizId, user_id: user.id });

      if (error) throw error;

      // Revalidate paths
      revalidatePath(`/quizzes/${quizId}`);
      revalidatePath("/mypage/favorite");

      return { success: true, bookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return {
      success: false,
      bookmarked: false,
      error: "ブックマークの更新に失敗しました",
    };
  }
}

/**
 * Get bookmark status for a quiz
 * @param {number} quizId - The quiz ID to check
 * @returns {Promise<boolean>}
 */
export async function getBookmarkStatus(quizId) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  try {
    const { data } = await supabase
      .from("bookmarks")
      .select()
      .eq("quiz_id", quizId)
      .eq("user_id", user.id)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error("Error getting bookmark status:", error);
    return false;
  }
}

/**
 * Get all bookmarked quiz IDs for the current user
 * @returns {Promise<number[]>}
 */
export async function getUserBookmarks() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  try {
    const { data } = await supabase
      .from("bookmarks")
      .select("quiz_id")
      .eq("user_id", user.id);

    return data ? data.map((b) => b.quiz_id) : [];
  } catch (error) {
    console.error("Error getting user bookmarks:", error);
    return [];
  }
}
