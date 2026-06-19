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
    saveVote(key);
    setExistingVote(key);

  }

  return (
    <main>
      <Article>
        <Heading>Vote for new features!</Heading>
        {existingVote && <VoteAlert />}
        <ListRoot>
          {FEATURES.map(feature => (
            <VoteOption
              feature={feature}
              disabled={!!existingVote}
              handleVote={handleVote}
            />
          ))}
        </ListRoot>
      </Article>
    </main>
  );
}
