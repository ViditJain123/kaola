import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 24.02;

const WORDS = [
	{word: 'Now', start: 24.02, end: 24.17},
	{word: 'all', start: 24.17, end: 24.42},
	{word: 'addictive', start: 24.42, end: 25.16},
	{word: 'apps', start: 25.16, end: 25.49},
	{word: 'are', start: 25.49, end: 25.74},
	{word: 'locked', start: 25.74, end: 26.25},
	{word: 'until', start: 26.25, end: 26.64},
	{word: 'the', start: 26.64, end: 26.89},
	{word: 'work', start: 26.89, end: 27.22},
	{word: 'is', start: 27.22, end: 27.38},
	{word: 'done.', start: 27.38, end: 27.95},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type Phase = {
	kind: 'apps' | 'locked' | 'done';
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{kind: 'apps', startFrame: wordFrames[0].startFrame, endFrame: wordFrames[4].endFrame},
	{kind: 'locked', startFrame: wordFrames[5].startFrame, endFrame: wordFrames[9].endFrame},
	{kind: 'done', startFrame: wordFrames[10].startFrame, endFrame: wordFrames[10].endFrame},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: 0},
	{pose: 'koala_explains.png', fromFrame: wordFrames[5].startFrame},
	{pose: 'koala_happy.png', fromFrame: wordFrames[10].startFrame},
];

const Scene7: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		PHASES[PHASES.length - 1];
	const phaseLocal = frame - phase.startFrame;

	const propScale =
		phase.kind === 'locked'
			? interpolate(phaseLocal, [0, 3, 6], [0.4, 1.18, 1.0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
			  })
			: interpolate(phaseLocal, [0, motion.popInFrames], [0.88, 1.0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
			  });

	const apps = ['🎵', '📷', '▶️', '🎞️'];

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop phases */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'apps' && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 20,
							transform: `scale(${propScale})`,
						}}
					>
						{apps.map((a) => (
							<div
								key={a}
								style={{
									fontSize: 100,
									textAlign: 'center',
									opacity: 0.7,
									filter: 'grayscale(0.3)',
								}}
							>
								{a}
							</div>
						))}
					</div>
				)}
				{phase.kind === 'locked' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 200, lineHeight: 1}}>🔒</div>
						<div
							style={{
								color: colors.primary,
								fontWeight: 900,
								fontSize: 60,
								letterSpacing: '0.06em',
								marginTop: 6,
							}}
						>
							LOCKED
						</div>
					</div>
				)}
				{phase.kind === 'done' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 200, lineHeight: 1}}>✅</div>
						<div
							style={{
								color: colors.positive,
								fontWeight: 900,
								fontSize: 52,
								letterSpacing: '0.06em',
								marginTop: 8,
							}}
						>
							WORK = UNLOCK
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot swaps */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene7;
