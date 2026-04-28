import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 27.84;

const WORDS = [
	{word: 'The', start: 27.84, end: 28.14},
	{word: 'unlock', start: 28.14, end: 28.48},
	{word: 'is', start: 28.48, end: 28.62},
	{word: 'a', start: 28.62, end: 28.72},
	{word: 'reflex.', start: 28.72, end: 30.0},
	{word: 'is', start: 30.0, end: 30.2},
	{word: 'chasing', start: 30.2, end: 30.92},
	{word: 'chemistry.', start: 30.92, end: 32.22},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'reflex' | 'chemistry';
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'reflex',
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[4].endFrame,
	},
	{
		kind: 'chemistry',
		startFrame: wordFrames[5].startFrame,
		endFrame: wordFrames[7].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_explains.png', fromFrame: 0},
	{pose: 'koala_thinking.png', fromFrame: wordFrames[5].startFrame},
];

const Scene6: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames],
		[0.85, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'reflex' ? (
					<div
						style={{
							transform: `scale(${propScale}) rotate(-3deg)`,
							textAlign: 'center',
						}}
					>
						<div
							style={{
								color: colors.text,
								fontWeight: 800,
								fontSize: 44,
								letterSpacing: '0.08em',
								marginBottom: 4,
							}}
						>
							UNLOCK =
						</div>
						<div
							style={{
								color: colors.danger,
								fontWeight: 900,
								fontSize: 150,
								letterSpacing: '-0.02em',
								lineHeight: 1,
							}}
						>
							REFLEX.
						</div>
					</div>
				) : (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 12,
						}}
					>
						<div>
							<div
								style={{
									color: colors.muted,
									fontWeight: 800,
									fontSize: 50,
									letterSpacing: '0.05em',
									marginBottom: 4,
								}}
							>
								CHASING
							</div>
							<div
								style={{
									color: colors.primary,
									fontWeight: 900,
									fontSize: 95,
									letterSpacing: '-0.02em',
									lineHeight: 1,
								}}
							>
								CHEMISTRY.
							</div>
						</div>
						<div style={{fontSize: 80, lineHeight: 1}}>🧪</div>
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene6;
