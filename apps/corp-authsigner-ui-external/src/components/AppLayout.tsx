import React from 'react'

import { useGetPostsQuery, useGetTodosQuery, useGetUsersQuery } from '@shared'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '../store'
import { decrement, increment } from '../store/counterSlice'

export const AppLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const count = useSelector((state: RootState) => state.counter.value)

  const { data: users, isLoading: usersLoading, error: usersError } = useGetUsersQuery()
  const { data: posts, isLoading: postsLoading, error: postsError } = useGetPostsQuery()
  const { data: todos, isLoading: todosLoading, error: todosError } = useGetTodosQuery()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">External App</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Counter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Counter Example</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">{count}</div>
            <div className="space-x-3">
              <button
                onClick={() => dispatch(decrement())}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                -
              </button>
              <button
                onClick={() => dispatch(increment())}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          {usersLoading ? (
            <div className="text-center text-gray-500">Loading users...</div>
          ) : usersError ? (
            <div className="text-center text-red-500">Error loading users</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users?.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Todos Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
          {todosLoading ? (
            <div className="text-center text-gray-500">Loading tasks...</div>
          ) : todosError ? (
            <div className="text-center text-red-500">Error loading tasks</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todos?.slice(0, 8).map(todo => (
                <div
                  key={todo.id}
                  className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="mt-1 h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {postsLoading ? (
          <div className="text-center text-gray-500 py-8">Loading posts...</div>
        ) : postsError ? (
          <div className="text-center text-red-500 py-8">Error loading posts</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts?.slice(0, 6).map(post => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.body}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Post #{post.id}</span>
                  {post.reactions ? (
                    <span className="text-xs text-blue-600">{post.reactions} reactions</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
