import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 21.98;

const WORDS = [
	{word: 'Then', start: 21.98, end: 22.06},
	{word: 'Koala', start: 22.06, end: 22.41},
	{word: 'figured', start: 22.41, end: 22.91},
	{word: 'it', start: 22.91, end: 23.05},
	{word: 'out.', start: 23.05, end: 23.7},
	{word: 'Your', start: 23.7, end: 23.76},
	{word: 'brain', start: 23.76, end: 24.12},
	{word: "isn't", start: 24.12, end: 24.54},
	{word: 'addicted', start: 24.54, end: 25.05},
	{word: 'to', start: 25.05, end: 25.19},
	{word: 'your', start: 25.19, end: 25.48},
	{word: 'phone.', start: 25.48, end: 26.05},
	{word: "It's", start: 26.05, end: 26.33},
	{word: 'addicted', start: 26.33, end: 26.91},
	{word: 'to', start: 26.91, end: 27.05},
	{word: 'dopamine.', start: 27.05, end: 27.84},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase =
	| {
			kind: 'aha';
			startFrame: number;
			endFrame: number;
	  }
	| {
			kind: 'strike';
			startFrame: number;
			endFrame: number;
	  }
	| {
			kind: 'dopamine';
			startFrame: number;
			endFrame: number;
	  };

const PHASES: PropPhase[] = [
	{
		kind: 'aha',
		startFrame: 0,
		endFrame: wordFrames[4].endFrame, // end of "out."
	},
	{
		kind: 'strike',
		startFrame: wordFrames[5].startFrame, // "Your"
		endFrame: wordFrames[11].endFrame, // end of "phone."
	},
	{
		kind: 'dopamine',
		startFrame: wordFrames[12].startFrame, // "It's"
		endFrame: wordFrames[15].endFrame, // end of "dopamine."
	},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: 0},
	{pose: 'koala_explains.png', fromFrame: wordFrames[5].startFrame},
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

	// Subtle wiggle for the lightbulb to amplify the "aha" punch.
	const bulbWiggle = Math.sin(phaseLocal / 6) * 4;

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex flex-col items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'aha' ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${propScale}) rotate(${bulbWiggle}deg)`,
							lineHeight: 1,
						}}
					>
						<div style={{fontSize: 220, lineHeight: 1}}>💡</div>
					</div>
				) : phase.kind === 'strike' ? (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								color: colors.muted,
								fontWeight: 800,
								fontSize: 44,
								letterSpacing: '0.05em',
								textTransform: 'uppercase',
							}}
						>
							Not the
						</div>
						<div
							style={{
								position: 'relative',
								display: 'inline-block',
								marginTop: 8,
							}}
						>
							<div
								style={{
									color: colors.muted,
									fontWeight: 900,
									fontSize: 130,
									letterSpacing: '-0.04em',
									lineHeight: 1,
								}}
							>
								PHONE
							</div>
							{/* Manually drawn strikethrough bar */}
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: -10,
									right: -10,
									height: 10,
									backgroundColor: colors.danger,
									transform: 'translateY(-50%) rotate(-3deg)',
									borderRadius: 5,
								}}
							/>
						</div>
					</div>
				) : (
					<div
						style={{
							transform: `scale(${propScale})`,
							textAlign: 'center',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								color: colors.muted,
								fontWeight: 800,
								fontSize: 44,
								letterSpacing: '0.05em',
								textTransform: 'uppercase',
							}}
						>
							Addicted to
						</div>
						<div
							style={{
								color: colors.primary,
								fontWeight: 900,
								fontSize: 130,
								letterSpacing: '-0.04em',
								lineHeight: 1,
								marginTop: 8,
							}}
						>
							DOPAMINE.
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
