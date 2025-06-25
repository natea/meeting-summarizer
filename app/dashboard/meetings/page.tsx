import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Clock, CheckCircle2 } from 'lucide-react'

export default async function MeetingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: meetings } = await supabase
    .from('meetings')
    .select(`
      *,
      action_items (
        id,
        status
      )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Meetings</h1>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </Button>
        </Link>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {meetings.map((meeting) => {
              const pendingActions = meeting.action_items?.filter(
                (item: any) => item.status === 'pending'
              ).length || 0
              const totalActions = meeting.action_items?.length || 0

              return (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meetings/${meeting.id}`}
                  className="block p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(meeting.created_at), 'PPp')}
                        </span>
                        {meeting.duration && (
                          <span>{Math.floor(meeting.duration / 60)} min</span>
                        )}
                      </div>
                      {meeting.summary && (
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {meeting.summary}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 ml-6">
                      {totalActions > 0 && (
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {pendingActions}/{totalActions} actions
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-right">
                        {meeting.transcript ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Processed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No meetings yet</h2>
          <p className="text-gray-600 mb-6">
            Upload your first meeting recording to get started
          </p>
          <Link href="/dashboard/upload">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Meeting
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}