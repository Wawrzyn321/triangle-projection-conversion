import { Article } from '@/components/Article';
import { Heading } from '@/components/Heading';
import { Box, ListRoot } from '@chakra-ui/react';
import { getVote, saveVote } from './voteStorage';
import { useRef, useState, type SubmitEvent } from 'react';
import { FEATURES } from './FEATURES';
import { VoteAlert } from './VoteAlert';
import { VoteOption } from './VoteOption';
import { Paragraph } from '@/components/Paragraph';

const MIN_FORM_FILL_TIME = 3000;
const FEEDBACK_URL =
  import.meta.env.MODE === 'production'
    ? 'https://3d-projection-lab.com/feedback'
    : 'http://localhost:9010/feedback';

export function Vote() {
  const [existingVote, setExistingVote] = useState(() => getVote());
  // eslint-disable-next-line react-hooks/purity
  const formLoadedAt = useRef<number>(Date.now());

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const timeOnPage = Date.now() - formLoadedAt.current;

    let isSubmitValid = true;

    const formData = new FormData(document.forms[0]);

    // check if submit time is sane
    if (timeOnPage < MIN_FORM_FILL_TIME) {
      isSubmitValid = false;
    }
    // check if bot didn't fill agreement field
    if (formData.get('agreement') !== null) {
      isSubmitValid = false;
    }

    const submitter = e.nativeEvent.submitter as HTMLButtonElement;
    const key = submitter.value;

    if (saveVote(key) && isSubmitValid) {
      formData.set('vote', key);
      fetch(FEEDBACK_URL, { method: 'POST', body: formData })
        .catch(() => {})
        .finally(() => setExistingVote(key));
    } else {
      setExistingVote(key);
    }
  }

  return (
    <Article>
      <Heading>Vote for a new feature!</Heading>
      <Paragraph>Choose on feature you'd like to see on the website.</Paragraph>
      {existingVote && <VoteAlert />}
      <form action="/sub" method="post" onSubmit={onSubmit}>
        <ListRoot>
          {FEATURES.map(feature => (
            <VoteOption
              feature={feature}
              disabled={!!existingVote}
              key={feature.key}
            />
          ))}
        </ListRoot>
        <HoneypotFields />
      </form>
    </Article>
  );
}

function HoneypotFields() {
  return (
    <>
      <Box display="none" aria-hidden="true">
        <label htmlFor="agreement">Agreed?</label>
        <input
          type="checkbox"
          id="agreement"
          name="agreement"
          tabIndex={-1}
          autoComplete="off"
        />
      </Box>
    </>
  );
}
