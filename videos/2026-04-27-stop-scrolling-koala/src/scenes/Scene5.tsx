import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 16.89;

const WORDS = [
	{word: 'Koala', start: 16.89, end: 17.3},
	{word: 'starts', start: 17.3, end: 17.79},
	{word: 'recording', start: 17.79, end: 18.53},
	{word: 'a', start: 18.53, end: 18.65},
	{word: 'time', start: 18.65, end: 18.94},
	{word: 'lapse', start: 18.94, end: 19.37},
	{word: 'while', start: 19.37, end: 19.76},
	{word: 'working.', start: 19.76, end: 20.58},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'rec' | 'big-text';
	emoji?: string;
	value?: string;
	subtitle: string;
	color: string;
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'rec',
		emoji: '📹',
		subtitle: 'REC',
		color: colors.danger,
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[5].endFrame,
	},
	{
		kind: 'big-text',
		value: 'TIMELAPSE',
		subtitle: 'WHILE WORKING',
		color: colors.primary,
		startFrame: wordFrames[6].startFrame,
		endFrame: wordFrames[7].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: 0},
	{pose: 'koala_explains.png', fromFrame: wordFrames[6].startFrame},
];

const Scene5: React.FC = () => {
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

	const recPulse = 0.6 + 0.4 * Math.abs(Math.sin((frame * Math.PI) / 30));

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'rec' ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 200, lineHeight: 1}}>{phase.emoji}</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								marginTop: 10,
							}}
						>
							<div
								style={{
									width: 20,
									height: 20,
									borderRadius: '50%',
									backgroundColor: colors.danger,
									opacity: recPulse,
								}}
							/>
							<div
								style={{
									fontSize: 44,
									fontWeight: 900,
									color: colors.danger,
									letterSpacing: '0.1em',
								}}
							>
								{phase.subtitle}
							</div>
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
								color: phase.color,
								fontWeight: 900,
								fontSize: 96,
								letterSpacing: '-0.04em',
							}}
						>
							{phase.value}
						</div>
						<div
							style={{
								color: colors.muted,
								fontWeight: 800,
								fontSize: 36,
								marginTop: 6,
								letterSpacing: '0.05em',
							}}
						>
							{phase.subtitle}
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene5;
