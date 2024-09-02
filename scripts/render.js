import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// The composition you want to render
const compositionId = 'HelloWorld';

// You only have to create a bundle once, and you may reuse it
// for multiple renders that you can parametrize using input props.
const bundleLocation = await bundle({
  entryPoint: require.resolve('../remotion/index.ts'),
  // If you have a webpack override in remotion.config.ts, pass it here as well.
  webpackOverride: config => config,
});

// Parametrize the video by passing props to your component.
const inputProps = {
  foo: 'bar',
};

// Get the composition you want to render. Pass `inputProps` if you
// want to customize the duration or other metadata.
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: compositionId,
  inputProps,
});

// Render the video. Pass the same `inputProps` again
// if your video is parametrized with data.
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/${compositionId}.mp4`,
  inputProps,
});

console.log('Render done! 🎉');
