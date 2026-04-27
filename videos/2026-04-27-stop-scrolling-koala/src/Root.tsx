import './index.css';
import {Audio, Composition, Series, staticFile} from 'remotion';
import {aspect, fps} from './design';
import Scene1 from './scenes/Scene1';
import Scene2 from './scenes/Scene2';
import Scene3 from './scenes/Scene3';
import Scene4 from './scenes/Scene4';
import Scene5 from './scenes/Scene5';
import Scene6 from './scenes/Scene6';
import Scene7 from './scenes/Scene7';
import Scene8 from './scenes/Scene8';

const SCENE_FRAMES = [125, 169, 139, 74, 111, 103, 118, 92];
const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

const MainVideo: React.FC = () => (
	<>
		<Audio src={staticFile('audio.mp3')} />
		<Series>
			<Series.Sequence durationInFrames={SCENE_FRAMES[0]}>
				<Scene1 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[1]}>
				<Scene2 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[2]}>
				<Scene3 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[3]}>
				<Scene4 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[4]}>
				<Scene5 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[5]}>
				<Scene6 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[6]}>
				<Scene7 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[7]}>
				<Scene8 />
			</Series.Sequence>
		</Series>
	</>
);

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="main"
				component={MainVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={fps}
				width={aspect.width}
				height={aspect.height}
			/>
		</>
	);
};
