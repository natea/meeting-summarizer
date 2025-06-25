import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, FileText, CheckCircle2, Download, Loader2 } from 'lucide-react'

export default async function MeetingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get meeting details
  const { data: meeting, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single()

  if (error || !meeting) {
    notFound()
  }

  // Get action items for this meeting
  const { data: actionItems } = await supabase
    .from('action_items')
    .select('*')
    .eq('meeting_id', params.id)
    .order('priority', { ascending: false })

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }

  const isProcessing = !meeting.transcript || !meeting.summary

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/meetings" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to meetings
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>
            <p className="text-gray-600 mt-2 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(meeting.created_at), 'PPp')}
              </span>
              {meeting.duration && (
                <span>Duration: {Math.floor(meeting.duration / 60)} minutes</span>
              )}
            </p>
          </div>
          
          {meeting.audio_url && (
            <Button variant="secondary" size="sm" asChild>
              <a href={meeting.audio_url} download>
                <Download className="w-4 h-4 mr-2" />
                Download Audio
              </a>
            </Button>
          )}
        </div>
      </div>

      {isProcessing ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Meeting</h2>
          <p className="text-gray-600">
            We're transcribing and analyzing your meeting. This may take a few minutes...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Meeting Summary
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{meeting.summary}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-600" />
              Action Items ({actionItems?.length || 0})
            </h2>
            
            {actionItems && actionItems.length > 0 ? (
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.description}</p>
                        {item.assignee && (
                          <p className="text-sm text-gray-600 mt-1">
                            Assigned to: {item.assignee}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            priorityColors[item.priority]
                          }`}
                        >
                          {item.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No action items identified in this meeting.</p>
            )}
          </div>

          <details className="bg-white rounded-lg shadow">
            <summary className="p-6 cursor-pointer font-semibold hover:bg-gray-50">
              View Full Transcript
            </summary>
            <div className="px-6 pb-6">
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-sm">{meeting.transcript}</p>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}