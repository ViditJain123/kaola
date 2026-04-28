import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 32.22;

const WORDS = [
	{word: 'So', start: 32.22, end: 32.35},
	{word: "don't", start: 32.35, end: 32.86},
	{word: 'fight', start: 32.86, end: 33.62},
	{word: 'the', start: 33.62, end: 33.68},
	{word: 'reflex.', start: 33.68, end: 34.6},
	{word: 'Give', start: 34.6, end: 34.97},
	{word: 'it', start: 34.97, end: 35.32},
	{word: 'somewhere', start: 35.32, end: 36.14},
	{word: 'else', start: 36.14, end: 36.55},
	{word: 'to', start: 36.55, end: 36.95},
	{word: 'land.', start: 36.95, end: 37.46},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type Phase = {
	kind: 'negate' | 'redirect';
	startFrame: number;
	endFrame: number;
};

// Phase 1: "So don't fight the reflex." (words 0..4)
// Phase 2: "Give it somewhere else to land." (words 5..10)
const PHASES: Phase[] = [
	{
		kind: 'negate',
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[4].endFrame,
	},
	{
		kind: 'redirect',
		startFrame: wordFrames[5].startFrame,
		endFrame: wordFrames[10].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_confused.png', fromFrame: 0},
	{pose: 'koala_action.png', fromFrame: wordFrames[5].startFrame},
];

const Scene7: React.FC = () => {
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

	// Big red ❌ pulses on top of "DON'T" — pop-in then small breathe.
	const xPop = interpolate(
		phaseLocal,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.2, 1.25, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
	const xBreathe = 1 + Math.sin(phaseLocal / 14) * 0.04;

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop phases */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'negate' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${propScale})`,
							lineHeight: 1.05,
						}}
					>
						{/* Line 1: DON'T FIGHT — with giant red ❌ overlaid on DON'T */}
						<div style={{position: 'relative', display: 'inline-block'}}>
							<div
								style={{
									fontSize: 85,
									fontWeight: 900,
									color: colors.text,
									letterSpacing: '0.02em',
									textAlign: 'center',
								}}
							>
								DON&rsquo;T FIGHT
							</div>
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: '22%',
									transform: `translate(-50%, -50%) scale(${xPop * xBreathe})`,
									fontSize: 200,
									lineHeight: 1,
									color: colors.danger,
									textShadow: '0 4px 12px rgba(239,68,68,0.35)',
									pointerEvents: 'none',
								}}
							>
								❌
							</div>
						</div>
						{/* Line 2: THE REFLEX. */}
						<div
							style={{
								fontSize: 85,
								fontWeight: 900,
								color: colors.text,
								letterSpacing: '0.02em',
								textAlign: 'center',
								marginTop: 4,
							}}
						>
							THE REFLEX.
						</div>
					</div>
				)}

				{phase.kind === 'redirect' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${propScale})`,
							lineHeight: 1,
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<div
								style={{
									fontSize: 90,
									lineHeight: 1,
									color: colors.primary,
								}}
							>
								➡️
							</div>
							<div
								style={{
									fontSize: 110,
									fontWeight: 900,
									color: colors.primary,
									letterSpacing: '0.02em',
								}}
							>
								REDIRECT.
							</div>
						</div>
						<div
							style={{
								fontSize: 40,
								fontWeight: 800,
								color: colors.muted,
								letterSpacing: '0.08em',
								marginTop: 14,
								textAlign: 'center',
							}}
						>
							GIVE IT SOMEWHERE ELSE
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — mascot swap from confused to action */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene7;
