import { Composition, staticFile } from 'remotion';
import { compositionSchema } from './schema';
import { VideoComposition } from './composition';
import { getVideoMetadata } from '@remotion/media-utils';

const FPS = 40;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="tiktok-video"
      component={VideoComposition}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={FPS * 5}
      schema={compositionSchema}
      defaultProps={{
        croma: staticFile('croma_4.mp4'),
        background: staticFile('background_4.mp4'),
      }}
      calculateMetadata={async ({ props }) => {
        const data = await getVideoMetadata(props.croma);
        return { durationInFrames: Math.floor(data.durationInSeconds * FPS) };
      }}
    />
  );
};
