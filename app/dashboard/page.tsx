import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's recent meetings
  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get user's pending action items
  const { data: actionItems } = await supabase
    .from('action_items')
    .select('*, meetings(title)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get current month usage
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user?.id)
    .eq('month_year', currentMonth)
    .single()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold">{meetings?.length || 0}</span>
          </div>
          <h3 className="text-gray-600">Total Meetings</h3>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">{actionItems?.length || 0}</span>
          </div>
          <h3 className="text-gray-600">Pending Actions</h3>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">{usage?.summaries_count || 0}/5</span>
          </div>
          <h3 className="text-gray-600">Monthly Usage</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
          {meetings && meetings.length > 0 ? (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meetings/${meeting.id}`}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <h3 className="font-medium">{meeting.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(meeting.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No meetings yet. Upload your first recording!</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Action Items</h2>
          {actionItems && actionItems.length > 0 ? (
            <div className="space-y-3">
              {actionItems.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {item.meetings?.title}
                  </p>
                  {item.assignee && (
                    <p className="text-sm text-gray-600">
                      Assigned to: {item.assignee}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending action items.</p>
          )}
        </div>
      </div>
    </div>
  )
}