/* eslint-disable react-hooks/exhaustive-deps */
import { API, setAuthToken } from "../../../libs/axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_THREADS, POST_THREAD, SET_THREAD_LIKE } from "../../../store/RootReducer";
import { RootState } from "../../../store/types/RootState";
import { useEffect } from "react";
import React from "react";
import { IPostThread } from "../../../interface/IThread";

export function useThreads() {
  const dispatch = useDispatch();
  const threads = useSelector((state: RootState) => state.thread);
  
    // Di dalam useThreads
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else {
    console.warn("Token not found in localStorage");
  }

  const [data, setData] = React.useState<IPostThread>({
    content: "",
    image: "",
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("image", data.image as File);

      const response = await API.post("/threads", formData);
      dispatch(POST_THREAD(response.data));
      await getThreads(); // Make sure to wait for the threads to be updated before further actions.
    } catch (error) {
      console.error("Error posting thread:", error);
      // Handle the error or show a user-friendly message.
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (files) {
      setData({
        ...data,
        [name]: files[0],
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  async function getThreads() {
    try {
      const response = await API.get("/threads");
      dispatch(GET_THREADS(response.data.data));
    } catch (error) {
      console.error("Error getting threads:", error);
      // Handle the error or show a user-friendly message.
      throw error; // Make sure to rethrow the error to propagate it to the calling function.
    }
  }

  async function handleLike(id: number, isLiked: boolean) {
    try {
      console.log("Before API call - id:", id, "isLiked:", isLiked);
      localStorage.setItem(`isLiked_${id}`, isLiked.toString());
      if (!isLiked) {
        const response = await API.post("/like", { threadsId: id });
        console.log("API Response - isLiked:", response.data, "id:", id);
      } else {
        await API.delete(`/like/${id}`);
        // console.log("Berhasil menghapus like", response.data);
      }
      console.log("After API call - id:", id, "isLiked:", isLiked);
      dispatch(SET_THREAD_LIKE({ id: id, isLiked: isLiked }));
    } catch (error) {
      console.error("Error handling like:", error);
      throw error;
    }
  }

  useEffect(() => {
    getThreads();
  }, []);

  return {
    threads,
    handlePost,
    fileInputRef,
    handleChange,
    handleLike
  };
}
