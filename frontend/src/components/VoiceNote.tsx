'use client'

import { useState, useRef } from 'react'

interface VoiceNoteProps {
  onVoiceNote: (audioBlob: Blob) => void
}

export default function VoiceNote({ onVoiceNote }: VoiceNoteProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        onVoiceNote(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 rounded-full transition-all ${
        isRecording 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
    >
      {isRecording ? (
        <div className="flex items-center space-x-2">
          <span>🎤</span>
          <span className="text-xs">{recordingTime}s</span>
        </div>
      ) : (
        <span>🎤</span>
      )}
    </button>
  )
}