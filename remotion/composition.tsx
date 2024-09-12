import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Video } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import type { CompositionProps } from './schema';

export const VideoComposition: React.FC<CompositionProps> = props => {
  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ padding: 0, margin: 0 }}>
      <Video
        loop
        volume={0.19}
        src={props.background}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'brightness(1.16)',
        }}
      />
      <AbsoluteFill
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
          color: 'white',
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
            transform: 'translateY(-50%)',
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
              marginBottom: '4rem',
            }}
          />
          <AudioVisualizer />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AudioVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const config = useVideoConfig();

  const props = config.props as CompositionProps;
  const audioData = useAudioData(props.croma);

  if (!audioData) return null;

  const visualization = visualizeAudio({
    frame,
    fps: config.fps,
    numberOfSamples: 64,
    audioData,
  });

  // Render a bar chart for each frequency, the higher the amplitude,
  // the longer the bar
  return (
    <AbsoluteFill
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        gap: '1rem',
        margin: '0 auto',
      }}
    >
      {visualization
        .reverse()
        .slice(44)
        .map(v => (
          <VisualizerBar height={v} />
        ))}
      {visualization
        .reverse()
        .slice(1, 21)
        .map(v => (
          <VisualizerBar height={v} />
        ))}
    </AbsoluteFill>
  );
};

const VisualizerBar: React.FC<{ height: number }> = ({ height }) => {
  return (
    <div
      style={{
        width: 5,
        height: height * 1000,
        backgroundColor: 'currentcolor',
        borderRadius: 10,
      }}
    />
  );
};
