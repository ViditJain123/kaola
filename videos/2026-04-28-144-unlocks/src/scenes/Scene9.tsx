import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 44.30;

const WORDS = [
	{word: 'Then', start: 44.30, end: 44.72},
	{word: 'film', start: 44.72, end: 45.11},
	{word: 'yourself', start: 45.11, end: 45.94},
	{word: 'doing', start: 45.94, end: 46.46},
	{word: 'it.', start: 46.46, end: 46.95},
	{word: 'Time', start: 46.95, end: 47.36},
	{word: 'lapse', start: 47.36, end: 47.86},
	{word: 'it.', start: 47.86, end: 48.60},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type Phase = {
	kind: 'film' | 'timelapse';
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{
		kind: 'film',
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[4].endFrame,
	},
	{
		kind: 'timelapse',
		startFrame: wordFrames[5].startFrame,
		endFrame: wordFrames[7].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_photographer.png', fromFrame: 0},
	{pose: 'koala_happy.png', fromFrame: wordFrames[5].startFrame},
];

const Scene9: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;

	const propScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.6, 1.12, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Tiny camera wiggle on phase 1 to give it life.
	const wiggle =
		phase.kind === 'film' ? Math.sin(phaseLocal / 6) * 3 : 0;

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop phases */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'film' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale}) rotate(${wiggle}deg)`,
						}}
					>
						<div style={{fontSize: 140, lineHeight: 1, marginBottom: 6}}>
							🎥
						</div>
						<div
							style={{
								color: colors.text,
								fontWeight: 900,
								fontSize: 95,
								letterSpacing: '-0.02em',
								lineHeight: 0.95,
								textAlign: 'center',
							}}
						>
							FILM
							<br />
							YOURSELF.
						</div>
					</div>
				)}
				{phase.kind === 'timelapse' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 90, lineHeight: 1, marginBottom: 4}}>
							⏩
						</div>
						<div
							style={{
								color: colors.primary,
								fontWeight: 900,
								fontSize: 78,
								letterSpacing: '-0.03em',
								lineHeight: 1,
								textAlign: 'center',
							}}
						>
							TIMELAPSE.
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene9;
