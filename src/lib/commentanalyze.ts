// @ts-ignore
import Perspective from 'perspective-api-client';
import { PERSPECTIVE_API_KEY } from '$env/static/private';

type PPScore = {
  value: number;
  type: 'PROBABILITY';
};
type PPSpan = {
  begin: number;
  end: number;
  score: PPScore;
};
type PPR<T extends string | number | symbol> = {
  attributeScores: {
    [x in T]: {
      spanScores: PPSpan[];
      summaryScore: PPScore;
    };
  };
  languages: string[];
};
type PPTypes = {
  TOXICITY: {};
  SEVERE_TOXICITY: {};
  IDENTITY_ATTACK: {};
  INSULT: {};
  PROFANITY: {};
  THREAT: {};
  TOXICITY_EXPERIMENTAL: {};
  SEVERE_TOXICITY_EXPERIMENTAL: {};
  IDENTITY_ATTACK_EXPERIMENTAL: {};
  INSULT_EXPERIMENTAL: {};
  PROFANITY_EXPERIMENTAL: {};
  THREAT_EXPERIMENTAL: {};
  SEXUALLY_EXPLICIT: {};
  FLIRTATION: {};
  ATTACK_ON_AUTHOR: {};
  ATTACK_ON_COMMENTER: {};
  INCOHERENT: {};
  INFLAMMATORY: {};
  LIKELY_TO_REJECT: {};
  OBSCENE: {};
  SPAM: {};
  UNSUBSTANTIAL: {};
};
type PP = {
  analyze: <T extends Partial<PPTypes>>(
    text:
      | string
      | {
          comment: {
            text: string;
          };
          requestedAttributes: T;
        },
    options:
      | {
          attributes: (keyof T)[];
          stripHTML?: boolean;
          truncate?: boolean;
          doNotScore?: boolean;
          validate?: boolean;
        }
      | undefined
  ) => Promise<PPR<keyof T>>;
};

const perspective: PP = new Perspective({ apiKey: PERSPECTIVE_API_KEY });
export default perspective.analyze;
