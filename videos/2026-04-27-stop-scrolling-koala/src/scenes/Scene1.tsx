import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 0.0;

const WORDS = [
	{word: 'How', start: 0.0, end: 0.29},
	{word: 'to', start: 0.29, end: 0.41},
	{word: 'stop', start: 0.41, end: 0.74},
	{word: 'your', start: 0.74, end: 1.1},
	{word: 'scrolling', start: 1.1, end: 1.81},
	{word: 'addiction', start: 1.81, end: 2.61},
	{word: 'explained', start: 2.61, end: 3.29},
	{word: 'by', start: 3.29, end: 3.45},
	{word: 'koalas.', start: 3.45, end: 4.17},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'big-text' | 'emoji-with-label';
	value: string;
	subtitle?: string;
	color: string;
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'big-text',
		value: 'HOW TO',
		subtitle: 'STOP.',
		color: colors.text,
		startFrame: 0,
		endFrame: wordFrames[2].endFrame,
	},
	{
		kind: 'emoji-with-label',
		value: '📱',
		subtitle: 'doom scroll',
		color: colors.danger,
		startFrame: wordFrames[3].startFrame,
		endFrame: wordFrames[5].endFrame,
	},
	{
		kind: 'big-text',
		value: 'EXPLAINED',
		subtitle: 'BY KOALAS',
		color: colors.primary,
		startFrame: wordFrames[6].startFrame,
		endFrame: wordFrames[8].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: 0},
	{pose: 'koala_explains.png', fromFrame: wordFrames[6].startFrame},
];

const Scene1: React.FC = () => {
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
			{/* MIDDLE — prop (holds through phase) */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'big-text' ? (
					<div
						style={{
							transform: `scale(${propScale})`,
							color: phase.color,
							fontWeight: 900,
							fontSize: 96,
							lineHeight: 0.95,
							letterSpacing: '-0.04em',
							textAlign: 'center',
						}}
					>
						{phase.value}
						{phase.subtitle && (
							<div style={{fontSize: 64, marginTop: 6}}>
								{phase.subtitle}
							</div>
						)}
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 200, lineHeight: 1}}>{phase.value}</div>
						{phase.subtitle && (
							<div
								style={{
									fontSize: 44,
									fontWeight: 900,
									color: phase.color,
									marginTop: 10,
									letterSpacing: '0.05em',
									textTransform: 'uppercase',
								}}
							>
								{phase.subtitle}
							</div>
						)}
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene1;
