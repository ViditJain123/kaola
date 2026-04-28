import './index.css';
import {
	AbsoluteFill,
	Audio,
	Composition,
	Img,
	Series,
	staticFile,
} from 'remotion';
import {aspect, colors, fps} from './design';
import Scene1 from './scenes/Scene1';
import Scene2 from './scenes/Scene2';
import Scene3 from './scenes/Scene3';
import Scene4 from './scenes/Scene4';
import Scene5 from './scenes/Scene5';
import Scene6 from './scenes/Scene6';
import Scene7 from './scenes/Scene7';
import Scene8 from './scenes/Scene8';
import Scene9 from './scenes/Scene9';
import Scene10 from './scenes/Scene10';
import Scene11 from './scenes/Scene11';

const SCENE_FRAMES = [135, 265, 134, 125, 176, 131, 157, 205, 129, 76, 266];
const END_CARD_FRAMES = 30; // main.md §10: 1.0s full-canvas brand outro
const TOTAL_FRAMES =
	SCENE_FRAMES.reduce((a, b) => a + b, 0) + END_CARD_FRAMES;

const EndCard: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: colors.background}}>
		<Img
			src={staticFile('assets/image.png')}
			className="w-full h-full object-contain"
		/>
	</AbsoluteFill>
);

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
			<Series.Sequence durationInFrames={SCENE_FRAMES[8]}>
				<Scene9 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[9]}>
				<Scene10 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={SCENE_FRAMES[10]}>
				<Scene11 />
			</Series.Sequence>
			<Series.Sequence durationInFrames={END_CARD_FRAMES}>
				<EndCard />
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
