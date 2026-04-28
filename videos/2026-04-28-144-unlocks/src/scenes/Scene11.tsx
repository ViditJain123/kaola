import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 51.13;

const WORDS = [
	{word: 'Koala', start: 51.13, end: 51.63},
	{word: "doesn't", start: 51.63, end: 52.34},
	{word: 'gatekeep.', start: 52.34, end: 53.66},
	{word: 'Koala', start: 53.66, end: 53.96},
	{word: 'used', start: 53.96, end: 54.36},
	{word: 'lock-in', start: 54.36, end: 55.08},
	{word: 'club', start: 55.08, end: 55.49},
	{word: 'to', start: 55.49, end: 55.97},
	{word: 'track', start: 55.97, end: 56.2},
	{word: 'his', start: 56.2, end: 56.51},
	{word: 'productivity', start: 56.51, end: 57.75},
	{word: 'using', start: 57.75, end: 58.27},
	{word: 'time', start: 58.27, end: 58.74},
	{word: 'lapses.', start: 58.74, end: 60.0},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

// Phase boundaries (in scene-local frames)
const PHASE1_START = 0;
const PHASE2_START = wordFrames[3].startFrame; // second "Koala"
const PHASE3_START = wordFrames[7].startFrame; // "to"
const PHASE3_END = wordFrames[13].endFrame; // end of "lapses."

type PhaseKind = 'gatekeep' | 'reveal' | 'track';

type Phase = {
	kind: PhaseKind;
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{kind: 'gatekeep', startFrame: PHASE1_START, endFrame: PHASE2_START - 1},
	{kind: 'reveal', startFrame: PHASE2_START, endFrame: PHASE3_START - 1},
	{kind: 'track', startFrame: PHASE3_START, endFrame: PHASE3_END},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_happy.png', fromFrame: 0},
	{pose: 'koala_happy.png', fromFrame: PHASE2_START},
	{pose: 'koala_photographer.png', fromFrame: PHASE3_START},
];

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

const Scene11: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale = popIn(phaseLocal);
	const propOpacity = popOpacity(phaseLocal);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — phase-driven prop */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'gatekeep' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 4,
							transform: `scale(${propScale})`,
							opacity: propOpacity,
						}}
					>
						<div
							style={{
								fontSize: 80,
								fontWeight: 900,
								color: colors.text,
								letterSpacing: '-0.02em',
								lineHeight: 1,
							}}
						>
							KOALA DOESN'T
						</div>
						<div
							style={{
								fontSize: 80,
								fontWeight: 900,
								color: colors.text,
								letterSpacing: '-0.02em',
								lineHeight: 1,
							}}
						>
							GATEKEEP.
						</div>
					</div>
				)}

				{phase.kind === 'reveal' && (
					<div
						style={{
							position: 'relative',
							width: '100%',
							height: '100%',
							transform: `scale(${propScale})`,
							opacity: propOpacity,
						}}
					>
						<Img
							src={staticFile('assets/phone_screen.png')}
							style={{
								position: 'absolute',
								inset: 0,
								width: '100%',
								height: '100%',
								objectFit: 'contain',
							}}
						/>
						{/* Overlay big text inside the phone screen */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								pointerEvents: 'none',
							}}
						>
							<div
								style={{
									fontSize: 42,
									fontWeight: 900,
									color: '#000',
									letterSpacing: '-0.02em',
									lineHeight: 1,
									textAlign: 'center',
								}}
							>
								LOCKIN.CLUB
							</div>
						</div>
					</div>
				)}

				{phase.kind === 'track' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 8,
							transform: `scale(${propScale})`,
							opacity: propOpacity,
						}}
					>
						<div
							style={{
								fontSize: 36,
								fontWeight: 700,
								color: colors.muted,
								letterSpacing: '0.05em',
								textTransform: 'uppercase',
								lineHeight: 1,
							}}
						>
							PRODUCTIVITY
						</div>
						<div
							style={{
								fontSize: 75,
								fontWeight: 900,
								color: colors.primary,
								letterSpacing: '-0.02em',
								lineHeight: 1,
							}}
						>
							TRACK
						</div>
						<div
							style={{
								fontSize: 75,
								fontWeight: 900,
								color: colors.primary,
								letterSpacing: '-0.02em',
								lineHeight: 1,
							}}
						>
							TIMELAPSES.
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — mascot pose-swaps across phases */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene11;
