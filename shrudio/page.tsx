"use client"

import { useState } from 'react'
import { Tuner } from './components/Tuner'
import { MusicGenerator } from './components/MusicGenerator'
import { SoundEffects } from './components/SoundEffects'
import { MusicPlayer } from './components/MusicPlayer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AudioLab() {
  const [activeTab, setActiveTab] = useState('tuner')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">Shrudio</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="musicPlayer">Music Player</TabsTrigger>
          <TabsTrigger value="musicGenerator">Music Generator</TabsTrigger>
          <TabsTrigger value="soundEffects">Sound Effects</TabsTrigger>
          <TabsTrigger value="tuner">Tuner</TabsTrigger>
        </TabsList>
        <TabsContent value="tuner">
          <Tuner />
        </TabsContent>
        <TabsContent value="musicGenerator">
          <MusicGenerator />
        </TabsContent>
        <TabsContent value="soundEffects">
          <SoundEffects />
        </TabsContent>
        <TabsContent value="musicPlayer">
          <MusicPlayer />
        </TabsContent>
      </Tabs>
    </div>
  )
}

