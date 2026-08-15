import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const ANIMAL_NAMES = [
  'Bunny',
  'Koala',
  'Fox',
  'Panda',
  'Otter',
  'Penguin',
  'Turtle',
  'Dolphin',
  'Bear',
  'Deer'
];

const getRandomAnimal = () => {
  const index = Math.floor(Math.random() * ANIMAL_NAMES.length);
  return ANIMAL_NAMES[index];
};

const getParticipantName = (user) => {
  const displayName = user?.user_metadata?.display_name?.trim();

  if (displayName) {
    return displayName.split(/\s+/)[0];
  }

  return getRandomAnimal();
};

export function useBreathingPresence() {
  const { user, loading } = useAuth();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (loading || !supabase) return;

    const channel = supabase.channel('breathing-room');
    const participantName = getParticipantName(user);

const updateParticipants = () => {
  const state = channel.presenceState();

  const people = Object.values(state)
    .flat()
    .filter((presence) => presence.userId !== user?.id)
    .map((presence) => ({
      id: presence.userId,
      name: presence.name
    }));

  setParticipants(people);
};

    channel
      .on('presence', { event: 'sync' }, updateParticipants)
      .on('presence', { event: 'join' }, updateParticipants)
      .on('presence', { event: 'leave' }, updateParticipants)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user?.id ?? crypto.randomUUID(),
            name: participantName
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loading]);

  return participants;
}