-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('meeting-audio', 'meeting-audio', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'meeting-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own audio files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'meeting-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own audio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'meeting-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );