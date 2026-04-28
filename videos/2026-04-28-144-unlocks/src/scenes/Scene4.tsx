import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 17.80;

const WORDS = [
	{word: 'Felt', start: 17.80, end: 18.08},
	{word: 'like', start: 18.08, end: 18.58},
	{word: 'the', start: 18.58, end: 18.60},
	{word: 'phone', start: 18.60, end: 18.95},
	{word: 'was', start: 18.95, end: 19.15},
	{word: 'running', start: 19.15, end: 19.65},
	{word: 'Koala,', start: 19.65, end: 20.14},
	{word: 'not', start: 20.14, end: 20.35},
	{word: 'the', start: 20.35, end: 20.56},
	{word: 'other', start: 20.56, end: 20.92},
	{word: 'way', start: 20.92, end: 21.13},
	{word: 'around.', start: 21.13, end: 21.98},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	startFrame: number;
	endFrame: number;
	kind: 'phoneRunsKoala' | 'notTheOther';
};

const PHASES: PropPhase[] = [
	{
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[6].endFrame,
		kind: 'phoneRunsKoala',
	},
	{
		startFrame: wordFrames[7].startFrame,
		endFrame: wordFrames[11].endFrame,
		kind: 'notTheOther',
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_scrolls.png', fromFrame: 0},
	{pose: 'koala_confused.png', fromFrame: wordFrames[7].startFrame},
];

const Scene4: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.7, 1.1, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'phoneRunsKoala' ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 8,
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 160, lineHeight: 1}}>📱</div>
						<div
							style={{
								fontSize: 85,
								fontWeight: 900,
								color: colors.danger,
								lineHeight: 0.95,
								letterSpacing: '-0.02em',
								textAlign: 'center',
							}}
						>
							PHONE RUNS
							<br />
							KOALA.
						</div>
					</div>
				) : (
					<div
						style={{
							fontSize: 76,
							fontWeight: 900,
							color: colors.text,
							lineHeight: 0.95,
							letterSpacing: '-0.02em',
							textAlign: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						NOT THE
						<br />
						OTHER WAY
						<br />
						AROUND.
					</div>
				)}
			</div>

			{/* BOTTOM — mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene4;
