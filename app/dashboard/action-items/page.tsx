'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Calendar, User, Flag } from 'lucide-react'
import toast from 'react-hot-toast'

type ActionItem = {
  id: string
  description: string
  assignee: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  due_date: string | null
  created_at: string
  meetings: {
    id: string
    title: string
  }
}

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadActionItems()
  }, [])

  async function loadActionItems() {
    try {
      const { data, error } = await supabase
        .from('action_items')
        .select(`
          *,
          meetings (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setActionItems(data || [])
    } catch (error) {
      console.error('Error loading action items:', error)
      toast.error('Failed to load action items')
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleStatus(item: ActionItem) {
    const newStatus = item.status === 'pending' ? 'completed' : 'pending'
    
    try {
      const { error } = await supabase
        .from('action_items')
        .update({ status: newStatus })
        .eq('id', item.id)

      if (error) throw error

      setActionItems(prev =>
        prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i)
      )

      toast.success(`Action item marked as ${newStatus}`)
    } catch (error) {
      console.error('Error updating action item:', error)
      toast.error('Failed to update action item')
    }
  }

  const filteredItems = actionItems.filter(item => {
    if (filter === 'all') return true
    return item.status === filter
  })

  const priorityColors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-green-600 bg-green-100',
  }

  const priorityIcons = {
    high: '!!!',
    medium: '!!',
    low: '!',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Action Items</h1>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({actionItems.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({actionItems.filter(i => i.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({actionItems.filter(i => i.status === 'completed').length})
          </Button>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow p-6 transition ${
                item.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStatus(item)}
                  className="mt-1 flex-shrink-0"
                >
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-primary-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    item.status === 'completed' ? 'line-through text-gray-500' : ''
                  }`}>
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {item.meetings.title}
                    </span>
                    
                    {item.assignee && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {item.assignee}
                      </span>
                    )}
                    
                    {item.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(item.due_date), 'PP')}
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500">
                      Created {format(new Date(item.created_at), 'PP')}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[item.priority]
                  }`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {item.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No action items yet' : `No ${filter} action items`}
          </h2>
          <p className="text-gray-600">
            Action items will appear here as they're extracted from your meetings
          </p>
        </div>
      )}
    </div>
  )
}

// Fix FileText import
import { FileText } from 'lucide-react'