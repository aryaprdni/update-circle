import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../../../libs/axios";
import { IReplyThread } from "../../../interface/IThread";
import React, { useState } from "react";

// GET THREAD DETAIL BY ID
function useThreadDetail() {
  const { id } = useParams();

  const {
    data: threadDetail,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["threadDetail"],
    queryFn: async () => API.get(`/threads/${id}`).then((data) => data.data.data),
  });

  return {
    threadDetail,
    isLoading,
    error,
    refetch,
  };
}

// GET THREAD DETAIL BY ID
function useGetReplies() {
  const id = useParams();
  const {
    data: getReplies,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getReplies", id],
    queryFn: async () => API.get(`/replies`).then((data) => data.data.data),
  });

  return {
    getReplies,
    isLoading,
    error,
    refetch,
  };
}

// POST REPLIES
function usePostReplies() {
  const { refetch } = useGetReplies();
  const { id } = useParams();
  const threadsId = Number(id);

  const [replies, setReplies] = React.useState<IReplyThread>({
    content: "",
    image: "",
    threads: threadsId,
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files) {
      setFile(files[0]);
    } else {
      setReplies({
        ...replies,
        [name]: value,
      });
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const postReplies = useMutation({
    mutationFn: async () => {
      if (!replies.content.trim()) {
        throw new Error('"content" cannot be empty');
      }

      const formData = new FormData();
      formData.append("content", replies.content);
      formData.append("image", file as File);
      formData.append("threads", threadsId.toString());

      await API.post("/replies", formData);

      refetch();
      setReplies({
        content: "",
        image: "",
        threads: threadsId,
      });
    },

    onError: (error) => {
      console.error("Error uploading thread:", error.message);
    },
  });

  return {
    replies,
    handleChange,
    fileInputRef,
    postReplies,
  };
}

export { useThreadDetail, usePostReplies, useGetReplies };
