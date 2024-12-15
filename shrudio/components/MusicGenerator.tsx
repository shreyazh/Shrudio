"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MusicGenerator() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [scale, setScale] = useState('major')
  const [octave, setOctave] = useState(4)
  const [instrument, setInstrument] = useState('sine')
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10],
  }

  function getNoteFrequency(note: number) {
    return 440 * Math.pow(2, (note - 69) / 12)
  }

  function playNote(frequency: number, duration: number) {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    oscillatorRef.current = audioContextRef.current.createOscillator()
    gainNodeRef.current = audioContextRef.current.createGain()

    oscillatorRef.current.type = instrument as OscillatorType
    oscillatorRef.current.connect(gainNodeRef.current)
    gainNodeRef.current.connect(audioContextRef.current.destination)

    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    gainNodeRef.current.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)

    oscillatorRef.current.start()
    gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)
    oscillatorRef.current.stop(audioContextRef.current.currentTime + duration)
  }

  function generateMelody() {
    if (isPlaying) return

    setIsPlaying(true)
    const selectedScale = scales[scale as keyof typeof scales]
    let time = 0
    for (let i = 0; i < 8; i++) {
      const note = selectedScale[Math.floor(Math.random() * selectedScale.length)]
      const frequency = getNoteFrequency(note + (octave * 12))
      const duration = 60 / tempo
      setTimeout(() => playNote(frequency, duration), time * 1000)
      time += duration
    }

    setTimeout(() => setIsPlaying(false), time * 1000)
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-800">Music Generator</CardTitle>
        <CardDescription className="text-gray-600">Create unique melodies with customizable parameters</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tempo: {tempo} BPM</label>
          <Slider
            min={60}
            max={240}
            step={1}
            value={[tempo]}
            onValueChange={(value) => setTempo(value[0])}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Scale</label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger>
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="pentatonic">Pentatonic</SelectItem>
                <SelectItem value="blues">Blues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Octave</label>
            <Select value={octave.toString()} onValueChange={(value) => setOctave(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select octave" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6].map((o) => (
                  <SelectItem key={o} value={o.toString()}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Instrument</label>
          <Select value={instrument} onValueChange={setInstrument}>
            <SelectTrigger>
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sine">Sine</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="sawtooth">Sawtooth</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={generateMelody} 
          disabled={isPlaying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          {isPlaying ? 'Playing...' : 'Generate Melody'}
        </Button>
      </CardContent>
    </Card>
  )
}

