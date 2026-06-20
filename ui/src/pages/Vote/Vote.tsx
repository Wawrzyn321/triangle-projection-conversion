import { Article } from '@/components/Article';
import { Heading } from '@/components/Heading';
import { ListRoot } from '@chakra-ui/react';
import { getVote, saveVote } from './voteStorage';
import { useState } from 'react';
import { FEATURES } from './FEATURES';
import { VoteAlert } from './VoteAlert';
import { VoteOption } from './VoteOption';

export function Vote() {
  const [existingVote, setExistingVote] = useState(() => getVote());

  async function handleVote(key: (typeof FEATURES)[number]['key']) {
    setExistingVote(key);
    if (saveVote(key)) {
      alert('todo request');
    }
  }

  return (
    <Article>
      <Heading>Vote for new features!</Heading>
      {existingVote && <VoteAlert />}
      <ListRoot>
        {FEATURES.map(feature => (
          <VoteOption
            feature={feature}
            disabled={!!existingVote}
            handleVote={handleVote}
            key={feature.key}
          />
        ))}
      </ListRoot>
    </Article>
  );
}
