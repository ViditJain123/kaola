import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 27.95;

const WORDS = [
	{word: 'Koala', start: 27.95, end: 28.35},
	{word: 'feels', start: 28.35, end: 28.76},
	{word: 'happy.', start: 28.76, end: 30.0},
	{word: 'sleeps.', start: 30.0, end: 31.0},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

const SLEEP_START = wordFrames[3].startFrame;
const CTA_FADE_START = SLEEP_START + 8;
const CTA_FADE_END = CTA_FADE_START + 8;

type Phase = {
	kind: 'happy' | 'sleep';
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{kind: 'happy', startFrame: 0, endFrame: SLEEP_START - 1},
	{kind: 'sleep', startFrame: SLEEP_START, endFrame: wordFrames[3].endFrame},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_happy.png', fromFrame: 0},
	{pose: 'koala_sleeps.png', fromFrame: SLEEP_START},
];

const Scene8: React.FC = () => {
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

	const sleepOpacity =
		0.7 + 0.3 * Math.abs(Math.sin((phaseLocal * Math.PI) / 30));

	const ctaOpacity = interpolate(
		frame,
		[CTA_FADE_START, CTA_FADE_END],
		[0, 1],
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
				{phase.kind === 'happy' ? (
					<div
						style={{
							display: 'flex',
							gap: 24,
							transform: `scale(${propScale})`,
						}}
					>
						<div style={{fontSize: 200}}>🎉</div>
						<div style={{fontSize: 200}}>✨</div>
					</div>
				) : (
					<div
						style={{
							fontSize: 200,
							transform: `scale(${propScale})`,
							opacity: sleepOpacity,
						}}
					>
						💤
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot pose-swap */}
			<Mascot segments={MASCOT} />

			{/* CTA — soft close */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center"
				style={{bottom: 28, opacity: ctaOpacity}}
			>
				<div
					style={{
						color: colors.primary,
						fontWeight: fonts.ctaWeight,
						fontSize: 48,
						letterSpacing: '-0.02em',
					}}
				>
					Lockin Club
				</div>
				<div
					style={{
						color: colors.muted,
						fontSize: 24,
						fontWeight: 600,
						letterSpacing: '0.05em',
					}}
				>
					link in bio
				</div>
			</div>
		</AbsoluteFill>
	);
};

export default Scene8;
