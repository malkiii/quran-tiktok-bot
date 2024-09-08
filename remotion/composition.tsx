import { AbsoluteFill, interpolate, useCurrentFrame, Video } from 'remotion';
import type { CompositionProps } from './schema';

export const VideoComposition: React.FC<CompositionProps> = props => {
  // const frame = useCurrentFrame();

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ padding: 0, margin: 0 }}>
      <Video loop volume={0.2} src={props.background} style={{ position: 'absolute', inset: 0 }} />
      <AbsoluteFill
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'radial-gradient(transparent, rgba(0,0,0,0.1))',
        }}
      >
        <AbsoluteFill
          style={{
            position: 'relative',
            width: '90%',
            height: 'fit-content',
            border: '1px solid white',
            margin: '0 auto',
          }}
        >
          <Video
            src={props.croma}
            volume={f => interpolate(f, [0, 25], [0, 1])}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              objectPosition: 'center',
              mixBlendMode: 'screen',
              overflow: 'hidden',
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
