import { api } from "@/utils/http";
import { AuthService } from "@/modules/auth";
import { UserService } from "@/modules/user";
import { PostService } from "@/modules/post";
import { BooksService } from "@/modules/books";
import { NotesService } from "@/modules/notes";
export const serviceContainer = {
  authService: new AuthService({ api }),
  userService: new UserService({ api }),
  postService: new PostService({ api }),
  booksService: new BooksService({ api }),
  notesService: new NotesService({ api }),
};
