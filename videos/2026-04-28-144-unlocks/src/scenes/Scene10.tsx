import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 48.6;

const WORDS = [
	{word: 'Same', start: 48.6, end: 48.78},
	{word: 'reach.', start: 48.78, end: 49.59},
	{word: 'Better', start: 49.59, end: 50.21},
	{word: 'payoff.', start: 50.21, end: 51.13},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

const LINE1_START = wordFrames[0].startFrame; // "Same"
const LINE2_START = wordFrames[2].startFrame; // "Better"

const MASCOT: MascotSegment[] = [{pose: 'koala_happy.png', fromFrame: 0}];

const popIn = (localFrame: number) =>
	interpolate(
		localFrame,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.6, 1.12, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

const popOpacity = (localFrame: number) =>
	interpolate(localFrame, [0, 2], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

const Scene10: React.FC = () => {
	const frame = useCurrentFrame();

	const line1Local = frame - LINE1_START;
	const line2Local = frame - LINE2_START;

	const line1Scale = popIn(line1Local);
	const line1Opacity = popOpacity(line1Local);
	const line2Scale = popIn(line2Local);
	const line2Opacity = popOpacity(line2Local);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — two-line typography contrast */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{
					top: zones.middle.y,
					height: zones.middle.height,
					gap: 16,
				}}
			>
				<div
					style={{
						fontSize: 90,
						fontWeight: 900,
						color: colors.muted,
						letterSpacing: '-0.02em',
						lineHeight: 1,
						transform: `scale(${line1Scale})`,
						opacity: line1Opacity,
					}}
				>
					SAME REACH.
				</div>
				<div
					style={{
						fontSize: 90,
						fontWeight: 900,
						color: colors.primary,
						letterSpacing: '-0.02em',
						lineHeight: 1,
						transform: `scale(${line2Scale})`,
						opacity: line2Opacity,
					}}
				>
					BETTER PAYOFF.
				</div>
			</div>

			{/* BOTTOM — celebratory mascot anchor */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene10;
