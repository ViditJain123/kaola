import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 0.0;

const WORDS = [
	{word: 'Why', start: 0.0, end: 0.21},
	{word: 'do', start: 0.21, end: 0.35},
	{word: 'you', start: 0.35, end: 0.56},
	{word: 'unlock', start: 0.56, end: 1.06},
	{word: 'your', start: 1.06, end: 1.28},
	{word: 'phone', start: 1.28, end: 1.64},
	{word: '144', start: 1.64, end: 2.29},
	{word: 'times', start: 2.29, end: 2.67},
	{word: 'a', start: 2.67, end: 2.72},
	{word: 'day?', start: 2.72, end: 3.14},
	{word: 'Explained', start: 3.14, end: 3.79},
	{word: 'by', start: 3.79, end: 3.94},
	{word: 'Koala.', start: 3.94, end: 4.5},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'big-text' | 'giant-stat';
	value: string;
	subtitle?: string;
	color: string;
	subtitleColor?: string;
	fontSize: number;
	subtitleFontSize?: number;
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'big-text',
		value: 'WHY UNLOCK',
		subtitle: 'YOUR PHONE?',
		color: colors.text,
		fontSize: 88,
		subtitleFontSize: 72,
		startFrame: 0,
		endFrame: wordFrames[5].endFrame, // through end of "phone"
	},
	{
		kind: 'giant-stat',
		value: '144',
		subtitle: 'TIMES A DAY?',
		color: colors.danger,
		subtitleColor: colors.text,
		fontSize: 220,
		subtitleFontSize: 56,
		startFrame: wordFrames[6].startFrame, // start of "144"
		endFrame: wordFrames[9].endFrame, // through end of "day?"
	},
	{
		kind: 'big-text',
		value: 'EXPLAINED',
		subtitle: 'BY KOALAS.',
		color: colors.primary,
		fontSize: 88,
		subtitleFontSize: 72,
		startFrame: wordFrames[10].startFrame, // start of "Explained"
		endFrame: wordFrames[12].endFrame, // through end of "Koala."
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_explains.png', fromFrame: 0},
	{pose: 'koala_action.png', fromFrame: wordFrames[6].startFrame}, // pop on "144"
	{pose: 'koala_explains.png', fromFrame: wordFrames[10].startFrame}, // back to teacher on "Explained"
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
							fontWeight: fonts.hookWeight,
							fontSize: phase.fontSize,
							lineHeight: 0.95,
							letterSpacing: '-0.04em',
							textAlign: 'center',
						}}
					>
						{phase.value}
						{phase.subtitle && (
							<div
								style={{
									fontSize: phase.subtitleFontSize ?? phase.fontSize * 0.7,
									marginTop: 6,
								}}
							>
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
						<div
							style={{
								fontSize: phase.fontSize,
								fontWeight: 900,
								color: phase.color,
								lineHeight: 0.9,
								letterSpacing: '-0.05em',
							}}
						>
							{phase.value}
						</div>
						{phase.subtitle && (
							<div
								style={{
									fontSize: phase.subtitleFontSize ?? 56,
									fontWeight: 900,
									color: phase.subtitleColor ?? colors.text,
									marginTop: 8,
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
