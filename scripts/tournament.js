// 토너먼트 로직 모듈

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createMatchPairs(images) {
  const pairs = [];
  for (let i = 0; i < images.length; i += 2) {
    if (i + 1 < images.length) {
      pairs.push({
        left: images[i],
        right: images[i + 1],
      });
    }
  }
  return pairs;
}

function getRoundFromCount(count) {
  switch (count) {
    case 32:
      return 'round32';
    case 16:
      return 'round16';
    case 8:
      return 'round8';
    case 4:
      return 'round4';
    case 2:
      return 'round2';
    case 1:
      return 'final';
    default:
      return 'round32';
  }
}

export function initializeTournament(category, images) {
  const shuffled = shuffleArray(images);
  const pairs = createMatchPairs(shuffled);

  return {
    category,
    round: getRoundFromCount(images.length),
    pairs,
    survivors: [],
    cursor: 0,
    startedAt: Date.now(),
    history: [],
  };
}

export function selectWinner(session, winner) {
  const newSurvivors = [...session.survivors, winner];
  const newHistory = [...session.history, winner];
  const newCursor = session.cursor + 1;

  // Check if round is complete
  if (newCursor >= session.pairs.length) {
    // Round complete
    if (newSurvivors.length === 1) {
      // Tournament complete
      return {
        ...session,
        survivors: newSurvivors,
        cursor: newCursor,
        round: 'final',
        history: newHistory,
      };
    }

    // Start next round
    const newPairs = createMatchPairs(newSurvivors);
    return {
      ...session,
      round: getRoundFromCount(newSurvivors.length),
      pairs: newPairs,
      survivors: [],
      cursor: 0,
      history: newHistory,
    };
  }

  // Continue with current round
  return {
    ...session,
    survivors: newSurvivors,
    cursor: newCursor,
    history: newHistory,
  };
}

export function getCurrentMatch(session) {
  if (session.cursor < session.pairs.length) {
    return session.pairs[session.cursor];
  }
  return null;
}

export function isTournamentComplete(session) {
  return (
    session.round === 'final' &&
    session.cursor >= session.pairs.length &&
    session.survivors.length === 1
  );
}

export function getRoundInfo(session) {
  const roundNames = {
    round32: '32강',
    round16: '16강',
    round8: '8강',
    round4: '4강',
    round2: '결승',
    final: '우승',
  };

  return {
    name: roundNames[session.round],
    matchNumber: session.cursor + 1,
    totalMatches: session.pairs.length,
  };
}

export function autoSelectWinner(session) {
  const currentMatch = getCurrentMatch(session);
  if (!currentMatch) {
    return session;
  }

  const randomWinner = Math.random() < 0.5 ? currentMatch.left : currentMatch.right;
  return selectWinner(session, randomWinner);
}
