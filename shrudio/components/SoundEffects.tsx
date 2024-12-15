"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type SoundEffect = 'laser' | 'explosion' | 'powerUp' | 'jump' | 'coin' | 'swoosh' | 'beep' | 'buzz' | 'chirp' | 'splash'

export function SoundEffects() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  function playEffect(type: SoundEffect) {
    if (isPlaying) return

    setIsPlaying(true)

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    switch (type) {
      case 'laser':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(110, audioContextRef.current.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.1)
        break
      case 'explosion':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(10, audioContextRef.current.currentTime + 1)
        gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 1)
        break
      case 'powerUp':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.5)
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.5)
        break
      case 'jump':
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(150, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.2)
        break
      case 'coin':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(987.77, audioContextRef.current.currentTime)
        oscillator.frequency.setValueAtTime(1318.51, audioContextRef.current.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.2)
        break
      case 'swoosh':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContextRef.current.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.3)
        break
      case 'beep':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime)
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.1)
        break
      case 'buzz':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.3)
        break
      case 'chirp':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(2000, audioContextRef.current.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.1)
        break
      case 'splash':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContextRef.current.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.3)
        break
    }

    setTimeout(() => setIsPlaying(false), 1000)
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-800">Sound Effects</CardTitle>
        <CardDescription className="text-gray-600">Play various sound effects</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {['laser', 'explosion', 'powerUp', 'jump', 'coin', 'swoosh', 'beep', 'buzz', 'chirp', 'splash'].map((effect) => (
            <Button
              key={effect}
              onClick={() => playEffect(effect as SoundEffect)}
              disabled={isPlaying}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out capitalize"
            >
              {effect}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

