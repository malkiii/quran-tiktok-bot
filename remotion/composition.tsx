import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Video } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import type { CompositionProps } from './schema';

const { fontFamily: Inter } = loadFont();

export const VideoComposition: React.FC<CompositionProps> = props => {
  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ padding: 0, margin: 0 }}>
      <Video
        loop
        volume={0.2}
        src={props.background}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(1.25px) brightness(1.2)',
        }}
      />
      <AbsoluteFill
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <AbsoluteFill
          style={{
            position: 'absolute',
            width: '100%',
            height: 'fit-content',
            left: '0',
            top: '50%',
            mixBlendMode: 'screen',
            transform: 'translateY(-70%)',
          }}
        >
          <Video
            src={props.croma}
            volume={f => interpolate(f, [0, 25], [0, 1])}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 7',
              objectFit: 'cover',
              objectPosition: 'center',
              overflow: 'hidden',
            }}
          />
          <ProgressBar />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalSeconds = durationInFrames / fps;
  const time = interpolate(frame, [0, durationInFrames], [0, totalSeconds]);

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const progress = (seconds / totalSeconds) * 100;

  return (
    <AbsoluteFill
      style={{
        position: 'relative',
        display: 'grid',
        gap: '2rem',
        padding: '2rem 0',
        height: 'fit-content',
        width: '60%',
        margin: '0 auto',
        color: 'white',
      }}
    >
      <AbsoluteFill
        style={{
          position: 'relative',
          background: '#FFF3',
          width: '100%',
          height: 8,
          borderRadius: 10,
        }}
      >
        <AbsoluteFill
          style={{
            position: 'absolute',
            background: 'currentColor',
            width: `${progress}%`,
            height: '100%',
            borderRadius: 'inherit',
          }}
        >
          <AbsoluteFill
            style={{
              position: 'absolute',
              top: '50%',
              left: '100%',
              transform: 'translateX(-50%) translateY(-50%)',
              background: 'inherit',
              width: 24,
              height: 24,
              borderRadius: '50%',
              boxShadow: '0 0 0 8px #FFF5',
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          position: 'relative',
          height: 'auto',
          fontFamily: Inter,
          fontSize: '1.75rem',
        }}
      >
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
