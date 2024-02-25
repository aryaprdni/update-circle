import { createSlice } from "@reduxjs/toolkit";
import { IPostThread, ThreadInterface } from "../../interface/IThread";

const initialThreadsState: { threads: ThreadInterface[] } = { threads: []};

export const threadSlice = createSlice({
  name: "thread",
  initialState: initialThreadsState,
  reducers: {
    GET_THREADS: (state, action) => {
      const payload = action.payload;
      // console.log("threads", state.threads);

      const threads = payload.map((data: ThreadInterface) => {
        return {
            id: data.id,
            content: data.content,
            image: data.image,
            likes_count: data.likes_count,
            replies_count: data.replies_count,
            created_at: data.created_at,
            isLiked: data.isLiked,
            user: {
                photo_profile: data.user.photo_profile,
                full_name: data.user.full_name,
                username: data.user.username,
            }
            
        }
    })
    state.threads = threads
    },
    SET_THREAD_LIKE: (
      state,
      action: { payload: { id: number; isLiked: boolean } }
    ) => {
      const { id, isLiked } = action.payload;

      console.log("Before SET_THREAD_LIKE dispatch - id:", id, "isLiked:", isLiked);
      
      const threads = state.threads.map((thread) => {
        if (thread.id === id) {
          return {
            ...thread,
            likes_count: isLiked
              ? (thread.likes_count) - 1
              : (thread.likes_count) + 1,
            isLiked: !isLiked,
          };
        }
        return thread;
      });

      
      state.threads = threads;
      console.log("After SET_THREAD_LIKE dispatch - id:", id, "isLiked:", isLiked);


      console.log("State after dispatch SET_THREAD_LIKE:", state.threads);
    },
  },
});

const initialThreadPost: { data: IPostThread } = {
  data: {
    content: "",
    image: "",
  },
};

export const postThreadSlice = createSlice({
  name: "postThread",
  initialState: initialThreadPost,
  reducers: {
    POST_THREAD: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});
