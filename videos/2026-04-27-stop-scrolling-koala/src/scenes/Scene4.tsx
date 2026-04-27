import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 14.44;

const WORDS = [
	{word: 'One', start: 14.44, end: 14.69},
	{word: 'day', start: 14.69, end: 14.94},
	{word: 'Koala', start: 14.94, end: 15.34},
	{word: 'decides', start: 15.34, end: 15.91},
	{word: 'this', start: 15.91, end: 16.25},
	{word: 'is', start: 16.25, end: 16.41},
	{word: 'bad.', start: 16.41, end: 16.89},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	emoji: string;
	subtitle: string;
	color: string;
	startFrame: number;
	endFrame: number;
	emphasis?: boolean;
};

const PHASES: PropPhase[] = [
	{
		emoji: '📅',
		subtitle: 'ONE DAY',
		color: colors.primary,
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[2].endFrame,
	},
	{
		emoji: '💡',
		subtitle: 'DECIDES.',
		color: colors.accent,
		startFrame: wordFrames[3].startFrame,
		endFrame: wordFrames[6].endFrame,
		emphasis: true,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_thinking.png', fromFrame: 0},
	{pose: 'koala_action.png', fromFrame: wordFrames[3].startFrame},
];

const Scene4: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;
	const propScale = phase.emphasis
		? interpolate(phaseLocal, [0, 3, 6], [0, 1.15, 1.0], {
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
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				<div
					style={{
						fontSize: 200,
						transform: `scale(${propScale})`,
						lineHeight: 1,
						filter:
							phase.emoji === '💡'
								? `drop-shadow(0 0 24px ${colors.accent})`
								: 'none',
					}}
				>
					{phase.emoji}
				</div>
				<div
					style={{
						fontSize: 44,
						fontWeight: 900,
						color: phase.color,
						marginTop: 10,
						letterSpacing: '0.05em',
						transform: `scale(${propScale})`,
					}}
				>
					{phase.subtitle}
				</div>
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene4;
