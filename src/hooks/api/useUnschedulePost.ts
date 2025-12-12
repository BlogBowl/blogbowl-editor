import { request } from "@/lib/request.ts";
import { API } from "@/types.ts";
import api from "@/lib/api.ts";
import toast from "react-hot-toast";
import { useState } from "react";
import { useMainContext } from "@/App.tsx";

export const useUnschedulePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useMainContext();

  const { post, updatePost, page } = context;

  const unschedulePost = async () => {
    setIsLoading(true);

    const [data, error] = await request<API.Post>(
      api.post(`/pages/${post.page_id}/posts/${post!.id}/unschedule`),
    );
    setIsLoading(false);
    if (error) {
      toast.error("There was a problem with unscheduling post");
      return;
    }
    updatePost(data!);

    toast.success("Successfully cancelled publication of post");
  };

  return {
    isLoading,
    unschedulePost,
  };
};
