import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { transcribeAudio, generateSummary } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { meetingId } = await request.json()

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check usage limits
    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', currentMonth)
      .single()

    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const limits = {
      free: { meetings: 5, maxDuration: 30 * 60 }, // 30 minutes
      pro: { meetings: 50, maxDuration: 2 * 60 * 60 }, // 2 hours
      enterprise: { meetings: Infinity, maxDuration: Infinity }
    }

    const userTier = userProfile?.subscription_tier || 'free'
    const tierLimits = limits[userTier]

    if (usage && usage.summaries_count >= tierLimits.meetings) {
      return NextResponse.json(
        { error: 'Monthly meeting limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Get meeting details
    const { data: meeting, error: meetingError } = await supabaseAdmin
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    if (!meeting.audio_url) {
      return NextResponse.json(
        { error: 'No audio file found for this meeting' },
        { status: 400 }
      )
    }

    // Transcribe audio
    const transcript = await transcribeAudio(meeting.audio_url)

    // Generate summary and extract action items
    const { summary, actionItems } = await generateSummary(transcript)

    // Update meeting with transcript and summary
    const { error: updateError } = await supabaseAdmin
      .from('meetings')
      .update({
        transcript,
        summary,
      })
      .eq('id', meetingId)

    if (updateError) {
      throw updateError
    }

    // Insert action items
    if (actionItems.length > 0) {
      const actionItemsToInsert = actionItems.map(item => ({
        meeting_id: meetingId,
        description: item.description,
        assignee: item.assignee || null,
        priority: item.priority,
      }))

      const { error: actionItemsError } = await supabaseAdmin
        .from('action_items')
        .insert(actionItemsToInsert)

      if (actionItemsError) {
        console.error('Failed to insert action items:', actionItemsError)
      }
    }

    // Update usage tracking
    if (usage) {
      await supabaseAdmin
        .from('usage_tracking')
        .update({
          summaries_count: usage.summaries_count + 1,
          audio_minutes: usage.audio_minutes + Math.ceil((meeting.duration || 0) / 60),
        })
        .eq('id', usage.id)
    } else {
      await supabaseAdmin
        .from('usage_tracking')
        .insert({
          user_id: user.id,
          month_year: currentMonth,
          summaries_count: 1,
          audio_minutes: Math.ceil((meeting.duration || 0) / 60),
        })
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting processed successfully',
      meetingId,
    })
  } catch (error: any) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process meeting' },
      { status: 500 }
    )
  }
}