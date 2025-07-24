'use client'

import { create } from 'zustand'
import { User } from 'firebase/auth'

export interface Participant {
  id: string
  name: string
  email?: string
  isHost: boolean
  isMuted: boolean
  isVideoOff: boolean
  isScreenSharing: boolean
  stream?: MediaStream
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: number
}

export interface MeetingState {
  // User & Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Meeting
  meetingCode: string
  setMeetingCode: (code: string) => void
  isHost: boolean
  setIsHost: (isHost: boolean) => void
  meetingStarted: boolean
  setMeetingStarted: (started: boolean) => void
  
  // Participants
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
  addParticipant: (participant: Participant) => void
  removeParticipant: (participantId: string) => void
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void
  
  // Local user state
  localStream: MediaStream | null
  setLocalStream: (stream: MediaStream | null) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  isVideoOff: boolean
  setIsVideoOff: (videoOff: boolean) => void
  isScreenSharing: boolean
  setIsScreenSharing: (sharing: boolean) => void
  
  // Chat
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
  
  // UI State
  isInLobby: boolean
  setIsInLobby: (inLobby: boolean) => void
  waitingParticipants: Participant[]
  setWaitingParticipants: (participants: Participant[]) => void
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  // User & Auth
  user: null,
  setUser: (user) => set({ user }),
  
  // Meeting
  meetingCode: '',
  setMeetingCode: (code) => set({ meetingCode: code }),
  isHost: false,
  setIsHost: (isHost) => set({ isHost }),
  meetingStarted: false,
  setMeetingStarted: (started) => set({ meetingStarted: started }),
  
  // Participants
  participants: [],
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),
  removeParticipant: (participantId) => set((state) => ({
    participants: state.participants.filter(p => p.id !== participantId)
  })),
  updateParticipant: (participantId, updates) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    )
  })),
  
  // Local user state
  localStream: null,
  setLocalStream: (stream) => set({ localStream: stream }),
  isMuted: false,
  setIsMuted: (muted) => set({ isMuted: muted }),
  isVideoOff: false,
  setIsVideoOff: (videoOff) => set({ isVideoOff: videoOff }),
  isScreenSharing: false,
  setIsScreenSharing: (sharing) => set({ isScreenSharing: sharing }),
  
  // Chat
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  isChatOpen: false,
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  
  // UI State
  isInLobby: false,
  setIsInLobby: (inLobby) => set({ isInLobby: inLobby }),
  waitingParticipants: [],
  setWaitingParticipants: (participants) => set({ waitingParticipants: participants }),
}))