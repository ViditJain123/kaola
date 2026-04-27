import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 9.81;

const WORDS = [
	{word: 'Koala', start: 9.81, end: 10.29},
	{word: 'tries', start: 10.29, end: 10.61},
	{word: 'to', start: 10.61, end: 10.93},
	{word: 'focus.', start: 10.93, end: 11.57},
	{word: 'Koala', start: 11.57, end: 11.83},
	{word: 'fails.', start: 11.83, end: 12.48},
	{word: 'Brain', start: 12.48, end: 12.89},
	{word: 'fried.', start: 12.89, end: 13.54},
	{word: 'Work', start: 13.54, end: 13.87},
	{word: 'zero.', start: 13.87, end: 14.44},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'emoji' | 'punch';
	value: string;
	subtitle?: string;
	color: string;
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{
		kind: 'emoji',
		value: '🎯',
		subtitle: 'TRY TO FOCUS',
		color: colors.primary,
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[3].endFrame,
	},
	{
		kind: 'punch',
		value: '✕',
		subtitle: 'FAIL.',
		color: colors.danger,
		startFrame: wordFrames[4].startFrame,
		endFrame: wordFrames[5].endFrame,
	},
	{
		kind: 'emoji',
		value: '🧠🔥',
		subtitle: 'BRAIN FRIED',
		color: colors.danger,
		startFrame: wordFrames[6].startFrame,
		endFrame: wordFrames[7].endFrame,
	},
	{
		kind: 'punch',
		value: '0',
		subtitle: 'WORK DONE',
		color: colors.danger,
		startFrame: wordFrames[8].startFrame,
		endFrame: wordFrames[9].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_thinking.png', fromFrame: 0},
	{pose: 'koala_confused.png', fromFrame: wordFrames[4].startFrame},
	{pose: 'koala_sleeps.png', fromFrame: wordFrames[8].startFrame},
];

const Scene3: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale =
		phase.kind === 'punch'
			? interpolate(phaseLocal, [0, 2, 5], [0.6, 1.15, 1.0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
			  })
			: interpolate(phaseLocal, [0, motion.popInFrames], [0.88, 1.0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
			  });

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop phase */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				<div
					style={{
						fontSize: phase.kind === 'punch' ? 200 : 180,
						fontWeight: phase.kind === 'punch' ? 900 : 400,
						color: phase.color,
						transform: `scale(${propScale})`,
						lineHeight: 1,
						letterSpacing: '-0.04em',
					}}
				>
					{phase.value}
				</div>
				{phase.subtitle && (
					<div
						style={{
							fontSize: 44,
							fontWeight: 900,
							color: phase.color,
							marginTop: 10,
							letterSpacing: '0.04em',
							transform: `scale(${propScale})`,
						}}
					>
						{phase.subtitle}
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene3;
