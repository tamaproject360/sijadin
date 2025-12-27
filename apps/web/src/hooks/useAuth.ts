import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/axios'
import { User } from '../types'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  token_type: string
}

export function useAuth() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, login: loginStore, logout: logoutStore } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // First, login to get token
      const loginResponse = await api.post<LoginResponse>('/auth/login', credentials)
      const accessToken = loginResponse.data.access_token
      
      // Store token temporarily for the next request
      localStorage.setItem('token', accessToken)
      
      // Then fetch user info
      const userResponse = await api.get<User>('/auth/me')
      
      return { token: accessToken, user: userResponse.data }
    },
    onSuccess: (data) => {
      loginStore(data.token, data.user)
      navigate('/')
    },
    onError: () => {
      // Clear token if login failed
      localStorage.removeItem('token')
    }
  })

  // Get current user
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get<User>('/auth/me')
      return response.data
    },
    enabled: isAuthenticated && !!token,
  })

  // Logout
  const logout = () => {
    logoutStore()
    navigate('/login')
  }

  return {
    user: currentUser || user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
    refetchUser,
  }
}
