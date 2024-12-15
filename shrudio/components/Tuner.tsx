"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Tuner() {
  const [pitch, setPitch] = useState<number | null>(null)
  const [note, setNote] = useState<string>('')
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 2048

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContextRef.current!.createMediaStreamSource(stream)
        source.connect(analyserRef.current!)
        updatePitch()
      })
      .catch(err => console.error('Error accessing microphone:', err))

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  function updatePitch() {
    const buffer = new Float32Array(analyserRef.current!.fftSize)
    analyserRef.current!.getFloatTimeDomainData(buffer)
    const ac = autoCorrelate(buffer, audioContextRef.current!.sampleRate)
    
    if (ac !== -1 && isFinite(ac) && ac > 20 && ac < 20000) {
      setPitch(ac)
      setNote(getNote(ac))
    } else {
      setPitch(null)
      setNote('')
    }

    rafIdRef.current = requestAnimationFrame(updatePitch)
  }

  function autoCorrelate(buffer: Float32Array, sampleRate: number) {
    const SIZE = buffer.length
    const MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0
    let foundGoodCorrelation = false

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i]
      rms += val * val
    }
    rms = Math.sqrt(rms / SIZE)
    if (rms < 0.01) return -1

    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs((buffer[i]) - (buffer[i + offset]))
      }

      correlation = 1 - (correlation / MAX_SAMPLES)
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      }

      if (correlation > 0.9) {
        foundGoodCorrelation = true
      } else if (foundGoodCorrelation) {
        const shift = (correlationShift(buffer, MAX_SAMPLES, offset - 1, 1) +
                       correlationShift(buffer, MAX_SAMPLES, offset, 1) +
                       correlationShift(buffer, MAX_SAMPLES, offset + 1, 1)) / 3
        return sampleRate / (offset + shift)
      }
    }

    if (bestCorrelation > 0.75) {
      const shift = (correlationShift(buffer, MAX_SAMPLES, bestOffset - 1, 1) +
                     correlationShift(buffer, MAX_SAMPLES, bestOffset, 1) +
                     correlationShift(buffer, MAX_SAMPLES, bestOffset + 1, 1)) / 3
      return sampleRate / (bestOffset + shift)
    }
    return -1
  }

  function correlationShift(buffer: Float32Array, MAX_SAMPLES: number, offset: number, step: number) {
    let correlation = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs((buffer[i]) - (buffer[i + offset]))
    }
    const d = 1 - (correlation / MAX_SAMPLES)
    return d
  }

  function getNote(frequency: number) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    const c0 = 16.35
    const halfStepsBelowMiddleC = Math.round(12 * Math.log2(frequency / c0))
    return notes[halfStepsBelowMiddleC % 12]
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-800">Tuner</CardTitle>
        <CardDescription className="text-gray-600">Tune your instrument using your microphone</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="text-7xl font-bold mb-4 text-blue-600">{note}</div>
        <div className="text-3xl text-gray-700">{pitch ? `${pitch.toFixed(2)} Hz` : 'Listening...'}</div>
      </CardContent>
    </Card>
  )
}

