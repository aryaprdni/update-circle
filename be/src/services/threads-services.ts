import { Repository } from "typeorm";
import { Threads } from "../entities/Threads";
import { AppDataSource } from "../data-source";

export default new (class ThreadsService {
  private readonly ThreadsRepository: Repository<Threads> = AppDataSource.getRepository(Threads);

  async create(data: any): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.save(data);
      return {
        message: "Create threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Create threads failed",
        error: error.message,
      };
    }
  }

  async update(id: number, data: Threads): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.update(id, data);
      return {
        message: "Update threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Update threads failed",
        error: error.message,
      };
    }
  }

  async delete(id: number): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.delete(id);
      return {
        message: "Delete threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Delete threads failed",
        error: error.message,
      };
    }
  }

  async getAll(loginSession: any): Promise<object | string> {
    try {
      console.log('Login Session:', loginSession);
      if (!loginSession || typeof loginSession.id === 'undefined') {
        return {
          message: 'Get all threads failed',
          error: 'Invalid login session',
        };
      }

      const threads= await this.ThreadsRepository.find({
        relations: ["user", "likes", "replies"],
        order: {
          id: "DESC",
        }
      })
      
      const mappedThreads = threads.map((thread) => ({
        id: thread.id,
        content: thread.content,
        image: thread.image,
        user: {
          username: thread.user.username,
          full_name: thread.user.full_name
        },
        likes_count: thread.likes.length,
        replies_count: thread.replies.length,
        isLiked: thread.likes.some(
          (like: any) => like.userId === loginSession.id
        )
      }))

      return {
        message: 'Get all threads success',
        data: mappedThreads
      };
    } catch (error) {
      return {
        message: 'Get all threads failed',
        error: error.message,
      };
    }
  }
  

  
  

  async getById(id: number): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.createQueryBuilder("threads")
        .leftJoin("threads.user", "user")
        .leftJoin("threads.likes", "likes")
        .leftJoin("threads.replies", "replies")
        .addSelect(["user.username", "user.full_name"])
        .loadRelationCountAndMap("threads.likes_count", "threads.likes")
        .loadRelationCountAndMap("threads.replies_count", "threads.replies")
        .where("threads.id = :id", { id: id })
        .orderBy("threads.id", "DESC")
        .getOne();
      return {
        message: "Get one threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Get one threads failed",
        error: error.message,
      };
    }
  }
})();
