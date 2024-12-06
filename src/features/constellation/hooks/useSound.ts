import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { SOUND } from '../config';

type EffectType = 'MENU_OPEN' | 'NODE_SELECT' | 'INFO_OPEN' | 'CONSTELLATION_START';

export function useSound() {
  const backgroundMusic = useRef<Howl>();
  const effects = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize background music
    backgroundMusic.current = new Howl({
      src: [SOUND.MUSIC.BACKGROUND],
      loop: true,
      volume: SOUND.MUSIC.VOLUME,
      preload: true
    });

    // Initialize sound effects
    effects.current = {
      MENU_OPEN: new Howl({
        src: [SOUND.EFFECTS.MENU_OPEN],
        volume: SOUND.EFFECTS.VOLUME
      }),
      NODE_SELECT: new Howl({
        src: [SOUND.EFFECTS.NODE_SELECT],
        volume: SOUND.EFFECTS.VOLUME
      }),
      INFO_OPEN: new Howl({
        src: [SOUND.EFFECTS.INFO_OPEN],
        volume: SOUND.EFFECTS.VOLUME
      }),
      CONSTELLATION_START: new Howl({
        src: [SOUND.EFFECTS.CONSTELLATION_START],
        volume: SOUND.EFFECTS.VOLUME
      })
    };

    return () => {
      backgroundMusic.current?.unload();
      Object.values(effects.current).forEach(effect => effect.unload());
    };
  }, []);

  const playBackgroundMusic = useCallback(() => {
    backgroundMusic.current?.play();
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    backgroundMusic.current?.stop();
  }, []);

  const playEffect = useCallback((effectName: EffectType) => {
    const effect = effects.current[effectName];
    if (effect) {
      effect.play();
    }
  }, []);

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playEffect
  };
}