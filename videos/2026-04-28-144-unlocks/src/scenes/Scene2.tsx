import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 4.5;

const WORDS = [
	{word: "That's", start: 4.5, end: 4.91},
	{word: 'once', start: 4.91, end: 5.32},
	{word: 'every', start: 5.32, end: 5.57},
	{word: 'six', start: 5.57, end: 5.78},
	{word: 'minutes.', start: 5.78, end: 6.49},
	{word: "You're", start: 6.49, end: 6.95},
	{word: 'not', start: 6.95, end: 7.12},
	{word: 'deciding.', start: 7.12, end: 8.19},
	{word: 'Your', start: 8.19, end: 8.2},
	{word: 'hand', start: 8.2, end: 8.49},
	{word: 'is.', start: 8.49, end: 8.84},
	{word: 'By', start: 8.84, end: 8.97},
	{word: 'lunch,', start: 8.97, end: 9.52},
	{word: "you've", start: 9.52, end: 9.9},
	{word: 'already', start: 9.9, end: 10.4},
	{word: 'pulled', start: 10.4, end: 10.83},
	{word: 'the', start: 10.83, end: 11.04},
	{word: 'phone', start: 11.04, end: 11.4},
	{word: 'out', start: 11.4, end: 11.64},
	{word: '60', start: 11.64, end: 12.04},
	{word: 'times', start: 12.04, end: 12.4},
	{word: 'for', start: 12.4, end: 12.61},
	{word: 'nothing.', start: 12.61, end: 13.32},
];

const wf = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'sixMin' | 'handDecides' | 'sixtyTimes';
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'sixMin',
		startFrame: wf[0].startFrame,
		endFrame: wf[4].endFrame, // through "minutes."
	},
	{
		kind: 'handDecides',
		startFrame: wf[5].startFrame, // "You're"
		endFrame: wf[10].endFrame, // through "is."
	},
	{
		kind: 'sixtyTimes',
		startFrame: wf[11].startFrame, // "By"
		endFrame: wf[22].endFrame, // through "nothing."
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_explains.png', fromFrame: 0},
	{pose: 'koala_confused.png', fromFrame: wf[5].startFrame},
	{pose: 'koala_scrolls.png', fromFrame: wf[11].startFrame},
];

const Scene2: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames],
		[0.88, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop phase */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'sixMin' ? (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
						}}
					>
						<div
							style={{
								color: colors.muted,
								fontWeight: 800,
								fontSize: 38,
								letterSpacing: '0.18em',
								marginBottom: 4,
							}}
						>
							ONCE
						</div>
						<div
							style={{
								color: colors.text,
								fontWeight: 900,
								fontSize: 110,
								lineHeight: 0.92,
								letterSpacing: '-0.04em',
							}}
						>
							EVERY 6 MIN
						</div>
					</div>
				) : phase.kind === 'handDecides' ? (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
						}}
					>
						<div
							style={{
								color: colors.danger,
								fontWeight: 900,
								fontSize: 78,
								lineHeight: 0.95,
								letterSpacing: '-0.03em',
							}}
						>
							YOUR HAND.
						</div>
						<div
							style={{
								color: colors.danger,
								fontWeight: 900,
								fontSize: 78,
								lineHeight: 0.95,
								letterSpacing: '-0.03em',
							}}
						>
							DECIDES.
						</div>
					</div>
				) : (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
						}}
					>
						<div
							style={{
								color: colors.danger,
								fontWeight: 900,
								fontSize: 220,
								lineHeight: 0.88,
								letterSpacing: '-0.06em',
							}}
						>
							60×
						</div>
						<div
							style={{
								color: colors.text,
								fontWeight: 800,
								fontSize: 44,
								letterSpacing: '0.05em',
								marginTop: 6,
							}}
						>
							BEFORE LUNCH
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — mascot swaps */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene2;
