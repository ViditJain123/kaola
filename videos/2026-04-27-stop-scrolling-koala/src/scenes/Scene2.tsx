import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 4.17;

const WORDS = [
	{word: 'Koala', start: 4.17, end: 4.57},
	{word: 'scrolls', start: 4.57, end: 5.15},
	{word: 'a', start: 5.15, end: 5.4},
	{word: 'lot,', start: 5.4, end: 5.65},
	{word: '5', start: 5.65, end: 5.89},
	{word: 'to', start: 5.89, end: 6.05},
	{word: '6', start: 6.05, end: 6.3},
	{word: 'hours', start: 6.3, end: 6.7},
	{word: 'every', start: 6.7, end: 7.12},
	{word: 'day.', start: 7.12, end: 7.61},
	{word: 'TikTok', start: 7.61, end: 8.11},
	{word: 'reels.', start: 8.11, end: 8.74},
	{word: 'All', start: 8.74, end: 8.99},
	{word: 'day', start: 8.99, end: 9.28},
	{word: 'long.', start: 9.28, end: 9.81},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase =
	| {
			kind: 'emoji';
			emoji: string;
			subtitle: string;
			subColor: string;
			startFrame: number;
			endFrame: number;
	  }
	| {
			kind: 'stat';
			big: string;
			small: string;
			color: string;
			startFrame: number;
			endFrame: number;
	  };

const PHASES: PropPhase[] = [
	{
		kind: 'emoji',
		emoji: '📱',
		subtitle: 'scroll  scroll  scroll',
		subColor: colors.muted,
		startFrame: wordFrames[0].startFrame,
		endFrame: wordFrames[3].endFrame,
	},
	{
		kind: 'stat',
		big: '5–6',
		small: 'HOURS / DAY',
		color: colors.danger,
		startFrame: wordFrames[4].startFrame,
		endFrame: wordFrames[9].endFrame,
	},
	{
		kind: 'emoji',
		emoji: '🎞️',
		subtitle: 'TikTok  reels',
		subColor: colors.text,
		startFrame: wordFrames[10].startFrame,
		endFrame: wordFrames[11].endFrame,
	},
	{
		kind: 'stat',
		big: 'ALL.',
		small: 'DAY. LONG.',
		color: colors.danger,
		startFrame: wordFrames[12].startFrame,
		endFrame: wordFrames[14].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_scrolls.png', fromFrame: 0},
	{pose: 'koala_scrolls_laughs.png', fromFrame: wordFrames[10].startFrame},
	{pose: 'koala_scrolls.png', fromFrame: wordFrames[12].startFrame},
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
				{phase.kind === 'stat' ? (
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
								fontSize: 180,
								lineHeight: 0.92,
								letterSpacing: '-0.04em',
							}}
						>
							{phase.big}
						</div>
						<div
							style={{
								color: phase.color,
								fontWeight: 800,
								fontSize: 52,
								letterSpacing: '0.02em',
								marginTop: 6,
							}}
						>
							{phase.small}
						</div>
					</div>
				) : (
					<div
						style={{
							transform: `scale(${propScale})`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div style={{fontSize: 200, lineHeight: 1}}>{phase.emoji}</div>
						<div
							style={{
								fontSize: 38,
								fontWeight: 800,
								color: phase.subColor,
								marginTop: 8,
								letterSpacing: '0.04em',
							}}
						>
							{phase.subtitle}
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot swaps */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene2;
