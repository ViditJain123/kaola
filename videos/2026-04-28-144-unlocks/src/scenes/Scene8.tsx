import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps, maxPropWidth} from '../design';

const SCENE_START = 37.46;

const WORDS = [
	{word: 'Running.', start: 37.46, end: 38.48},
	{word: 'Drawing.', start: 38.48, end: 39.52},
	{word: 'Lifting.', start: 39.52, end: 40.51},
	{word: 'Anything', start: 40.51, end: 41.33},
	{word: 'that', start: 41.33, end: 41.74},
	{word: 'ends', start: 41.74, end: 42.15},
	{word: 'in', start: 42.15, end: 42.38},
	{word: 'a', start: 42.38, end: 42.45},
	{word: 'result', start: 42.45, end: 43.14},
	{word: 'you', start: 43.14, end: 43.38},
	{word: 'can', start: 43.38, end: 43.78},
	{word: 'see.', start: 43.78, end: 44.3},
];

const wf = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

// Phase boundaries (in scene-local frames).
const RUN_START = wf[0].startFrame; // 0
const DRAW_START = wf[1].startFrame; // ~31
const LIFT_START = wf[2].startFrame; // ~62
const CLOSER_START = wf[3].startFrame; // ~91 ("Anything")
const CLOSER_END = wf[11].endFrame; // ~205 ("see.")

type Phase = {
	kind: 'running' | 'drawing' | 'lifting' | 'closer';
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{kind: 'running', startFrame: RUN_START, endFrame: DRAW_START - 1},
	{kind: 'drawing', startFrame: DRAW_START, endFrame: LIFT_START - 1},
	{kind: 'lifting', startFrame: LIFT_START, endFrame: CLOSER_START - 1},
	{kind: 'closer', startFrame: CLOSER_START, endFrame: CLOSER_END},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: RUN_START},
	{pose: 'koala_action.png', fromFrame: DRAW_START},
	{pose: 'koala_happy.png', fromFrame: LIFT_START},
	{pose: 'koala_photographer.png', fromFrame: CLOSER_START},
];

const Scene8: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;

	// Pop-in for the prop on every phase swap.
	const propScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.6, 1.12, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
	const propOpacity = interpolate(phaseLocal, [0, 2], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	let bigText = '';
	let bigColor = colors.text;
	let isCloser = false;
	if (phase.kind === 'running') {
		bigText = 'RUNNING.';
		bigColor = colors.text;
	} else if (phase.kind === 'drawing') {
		bigText = 'DRAWING.';
		bigColor = colors.primary;
	} else if (phase.kind === 'lifting') {
		bigText = 'LIFTING.';
		bigColor = colors.accent;
	} else {
		isCloser = true;
	}

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — big-text typography, swapped per period */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{
					top: zones.middle.y,
					height: zones.middle.height,
					padding: '0 32px',
				}}
			>
				{!isCloser ? (
					<div
						style={{
							fontSize: 120,
							fontWeight: 900,
							color: bigColor,
							letterSpacing: '-0.04em',
							lineHeight: 1,
							maxWidth: maxPropWidth,
							textAlign: 'center',
							transform: `scale(${propScale})`,
							opacity: propOpacity,
						}}
					>
						{bigText}
					</div>
				) : (
					<div
						style={{
							fontSize: 70,
							fontWeight: 900,
							color: colors.text,
							letterSpacing: '-0.03em',
							lineHeight: 1.05,
							textAlign: 'center',
							maxWidth: maxPropWidth,
							transform: `scale(${propScale})`,
							opacity: propOpacity,
						}}
					>
						<div>ANYTHING WITH</div>
						<div style={{color: colors.primary}}>A RESULT YOU</div>
						<div style={{color: colors.accent}}>CAN SEE.</div>
					</div>
				)}
			</div>

			{/* BOTTOM — mascot pose-swap per habit */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene8;
