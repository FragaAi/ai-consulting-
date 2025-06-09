import { supabase } from './supabase'
import { User } from '@/types/database'

export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching profile for user ID:', userId)
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // If the user doesn't exist in our users table, try to create them
      if (error.code === 'PGRST116') {
        console.log('User not found in users table, this should have been created by trigger')
        return null
      }
      return null
    }
    
    console.log('Profile fetched successfully:', data)
    return data
  } catch (err) {
    console.error('Unexpected error fetching profile:', err)
    return null
  }
}

export const updateProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Helper function to check if user is admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking admin status for user:', userId)
    const profile = await getProfile(userId)
    const isAdmin = profile?.is_admin || false
    console.log('Admin status result:', isAdmin)
    return isAdmin
  } catch (err) {
    console.error('Error checking admin status:', err)
    return false
  }
} 