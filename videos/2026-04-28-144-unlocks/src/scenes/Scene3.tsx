import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 13.32;

const WORDS = [
	{word: 'Koala', start: 13.32, end: 13.78},
	{word: 'used', start: 13.78, end: 13.96},
	{word: 'to', start: 13.96, end: 14.14},
	{word: 'do', start: 14.14, end: 14.24},
	{word: 'the', start: 14.24, end: 14.45},
	{word: 'same.', start: 14.45, end: 14.95},
	{word: 'Unlock.', start: 14.95, end: 15.59},
	{word: 'Scroll.', start: 15.59, end: 16.44},
	{word: 'Sleep.', start: 16.44, end: 16.80},
	{word: 'Unlock', start: 16.80, end: 17.31},
	{word: 'again.', start: 17.31, end: 17.80},
];

const wf = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type Phase = {
	text: string;
	emoji?: string;
	fontSize: number;
	fontWeight: number;
	color: string;
	startFrame: number;
	endFrame: number;
};

const PHASES: Phase[] = [
	{
		// "KOALA USED TO DO THE SAME."
		text: 'KOALA USED TO DO THE SAME.',
		fontSize: 56,
		fontWeight: 800,
		color: colors.muted,
		startFrame: wf[0].startFrame,
		endFrame: wf[5].endFrame,
	},
	{
		// "UNLOCK."
		text: 'UNLOCK.',
		fontSize: 180,
		fontWeight: 900,
		color: colors.text,
		startFrame: wf[6].startFrame,
		endFrame: wf[6].endFrame,
	},
	{
		// "SCROLL."
		text: 'SCROLL.',
		fontSize: 180,
		fontWeight: 900,
		color: colors.danger,
		startFrame: wf[7].startFrame,
		endFrame: wf[7].endFrame,
	},
	{
		// "SLEEP." with 💤
		text: 'SLEEP.',
		emoji: '💤',
		fontSize: 180,
		fontWeight: 900,
		color: colors.muted,
		startFrame: wf[8].startFrame,
		endFrame: wf[8].endFrame,
	},
	{
		// "UNLOCK AGAIN."
		text: 'UNLOCK AGAIN.',
		fontSize: 130,
		fontWeight: 900,
		color: colors.text,
		startFrame: wf[9].startFrame,
		endFrame: wf[10].endFrame,
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_thinking.png', fromFrame: 0},
	{pose: 'koala_scrolls.png', fromFrame: wf[6].startFrame},
	{pose: 'koala_scrolls_laughs.png', fromFrame: wf[7].startFrame},
	{pose: 'koala_sleeps.png', fromFrame: wf[8].startFrame},
	{pose: 'koala_scrolls.png', fromFrame: wf[9].startFrame},
];

const Scene3: React.FC = () => {
	const frame = useCurrentFrame();

	const phase =
		PHASES.find((p) => frame >= p.startFrame && frame <= p.endFrame) ??
		(frame < PHASES[0].startFrame ? PHASES[0] : PHASES[PHASES.length - 1]);
	const phaseLocal = frame - phase.startFrame;

	// Pop-in on every phase swap (per-period rhythm device).
	const popScale = interpolate(
		phaseLocal,
		[0, motion.popInFrames / 2, motion.popInFrames],
		[0.6, 1.12, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — single-word per-period typography */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				<div
					className="flex items-center justify-center"
					style={{
						transform: `scale(${popScale})`,
						gap: 16,
					}}
				>
					<div
						style={{
							fontSize: phase.fontSize,
							fontWeight: phase.fontWeight,
							color: phase.color,
							lineHeight: 1,
							letterSpacing: '-0.03em',
							textAlign: 'center',
							maxWidth: 540,
						}}
					>
						{phase.text}
					</div>
					{phase.emoji && (
						<div
							style={{
								fontSize: 120,
								lineHeight: 1,
							}}
						>
							{phase.emoji}
						</div>
					)}
				</div>
			</div>

			{/* BOTTOM — mascot pose swaps timed per period */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene3;
