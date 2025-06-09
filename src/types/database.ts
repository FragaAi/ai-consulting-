export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface AIAgent {
  id: string
  user_id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'paused'
  type: string
  configuration: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      ai_agents: {
        Row: AIAgent
        Insert: Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 