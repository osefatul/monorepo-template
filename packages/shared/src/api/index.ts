import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'signer'
  department?: string
  lastLogin?: string
}

export interface Document {
  id: number
  title: string
  type: 'contract' | 'agreement' | 'policy' | 'invoice'
  status: 'draft' | 'pending' | 'signed' | 'expired'
  createdAt: string
  updatedAt: string
  signers: number[]
  content?: string
  fileUrl?: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: number
}

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  tagTypes: ['User', 'Post', 'Todo', 'Document'],
  endpoints: builder => ({
    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      transformResponse: (response: any[]) =>
        response.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d8abc&color=fff`,
          role: user.id === 1 ? 'admin' : user.id <= 3 ? 'signer' : 'user',
          department: ['Engineering', 'Legal', 'Finance', 'HR'][user.id % 4],
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        })),
      providesTags: ['User'],
    }),

    getUser: builder.query<User, number>({
      query: id => `users/${id}`,
      transformResponse: (user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d8abc&color=fff`,
        role: user.id === 1 ? 'admin' : user.id <= 3 ? 'signer' : 'user',
        department: ['Engineering', 'Legal', 'Finance', 'HR'][user.id % 4],
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Posts endpoints (we'll use these as documents)
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      transformResponse: (response: any[]) =>
        response.slice(0, 20).map(post => ({
          ...post,
          tags: ['legal', 'contract', 'important', 'urgent'].slice(
            0,
            Math.floor(Math.random() * 3) + 1
          ),
          reactions: Math.floor(Math.random() * 50),
        })),
      providesTags: ['Post'],
    }),

    getPost: builder.query<Post, number>({
      query: id => `posts/${id}`,
      transformResponse: (post: any) => ({
        ...post,
        tags: ['legal', 'contract', 'important', 'urgent'].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
        reactions: Math.floor(Math.random() * 50),
      }),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation<Post, Partial<Post>>({
      query: newPost => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),

    updatePost: builder.mutation<Post, Pick<Post, 'id'> & Partial<Post>>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),

    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: id => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Todos endpoints (we'll use these as tasks)
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
      transformResponse: (response: any[]) => response.slice(0, 15),
      providesTags: ['Todo'],
    }),

    getUserTodos: builder.query<Todo[], number>({
      query: userId => `users/${userId}/todos`,
      transformResponse: (response: any[]) => response.slice(0, 10),
      providesTags: ['Todo'],
    }),

    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: newTodo => ({
        url: 'todos',
        method: 'POST',
        body: newTodo,
      }),
      invalidatesTags: ['Todo'],
    }),

    updateTodo: builder.mutation<Todo, Pick<Todo, 'id'> & Partial<Todo>>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),

    deleteTodo: builder.mutation<{ success: boolean; id: number }, number>({
      query: id => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetTodosQuery,
  useGetUserTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = api
