// @ts-expect-error Perspective does not have type files :/
import Perspective from 'perspective-api-client';
import {PERSPECTIVE_API_KEY} from '$env/static/private';

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
  TOXICITY: Record<string, never>;
  SEVERE_TOXICITY: Record<string, never>;
  IDENTITY_ATTACK: Record<string, never>;
  INSULT: Record<string, never>;
  PROFANITY: Record<string, never>;
  THREAT: Record<string, never>;
  TOXICITY_EXPERIMENTAL: Record<string, never>;
  SEVERE_TOXICITY_EXPERIMENTAL: Record<string, never>;
  IDENTITY_ATTACK_EXPERIMENTAL: Record<string, never>;
  INSULT_EXPERIMENTAL: Record<string, never>;
  PROFANITY_EXPERIMENTAL: Record<string, never>;
  THREAT_EXPERIMENTAL: Record<string, never>;
  SEXUALLY_EXPLICIT: Record<string, never>;
  FLIRTATION: Record<string, never>;
  ATTACK_ON_AUTHOR: Record<string, never>;
  ATTACK_ON_COMMENTER: Record<string, never>;
  INCOHERENT: Record<string, never>;
  INFLAMMATORY: Record<string, never>;
  LIKELY_TO_REJECT: Record<string, never>;
  OBSCENE: Record<string, never>;
  SPAM: Record<string, never>;
  UNSUBSTANTIAL: Record<string, never>;
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
export default perspective.analyze.bind(perspective);
