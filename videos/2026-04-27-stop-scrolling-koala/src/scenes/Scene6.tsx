import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Mascot, MascotSegment} from '../Mascot';
import {colors, fonts, motion, zones, fps} from '../design';

const SCENE_START = 20.58;

const WORDS = [
	{word: 'Phone', start: 20.58, end: 20.97},
	{word: 'on.', start: 20.97, end: 21.41},
	{word: 'Camera', start: 21.41, end: 21.88},
	{word: 'rolling.', start: 21.88, end: 22.7},
	{word: 'Koala', start: 22.7, end: 23.1},
	{word: 'working.', start: 23.1, end: 24.02},
];

const wordFrames = WORDS.map((w) => ({
	word: w.word,
	startFrame: Math.round((w.start - SCENE_START) * fps),
	endFrame: Math.round((w.end - SCENE_START) * fps),
}));

type PropPhase = {
	kind: 'phone' | 'work';
	startFrame: number;
	endFrame: number;
};

const PHASES: PropPhase[] = [
	{kind: 'phone', startFrame: wordFrames[0].startFrame, endFrame: wordFrames[3].endFrame},
	{kind: 'work', startFrame: wordFrames[4].startFrame, endFrame: wordFrames[5].endFrame},
];

const MASCOT: MascotSegment[] = [
	{pose: 'koala_action.png', fromFrame: 0},
	{pose: 'koala_explains.png', fromFrame: wordFrames[4].startFrame},
];

const Scene6: React.FC = () => {
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

	const recPulse = 0.5 + 0.5 * Math.abs(Math.sin((frame * Math.PI) / 30));

	return (
		<AbsoluteFill
			style={{backgroundColor: colors.background, fontFamily: fonts.family}}
		>
			{/* MIDDLE — prop */}
			<div
				className="absolute left-0 right-0 flex items-center justify-center"
				style={{top: zones.middle.y, height: zones.middle.height}}
			>
				{phase.kind === 'phone' ? (
					<div
						style={{
							position: 'relative',
							transform: `scale(${propScale})`,
							width: 240,
							height: 240,
						}}
					>
						<Img
							src={staticFile('assets/phone_screen.png')}
							className="w-full h-full object-contain"
						/>
						<div
							style={{
								position: 'absolute',
								top: 28,
								left: '50%',
								transform: 'translateX(-50%)',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<div
								style={{
									width: 14,
									height: 14,
									borderRadius: '50%',
									backgroundColor: colors.danger,
									opacity: recPulse,
								}}
							/>
							<div
								style={{
									fontSize: 28,
									fontWeight: 900,
									color: colors.danger,
									letterSpacing: '0.1em',
								}}
							>
								REC
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
						<div style={{fontSize: 200, lineHeight: 1}}>💻</div>
						<div
							style={{
								color: colors.primary,
								fontWeight: 900,
								fontSize: 56,
								letterSpacing: '0.05em',
								marginTop: 10,
							}}
						>
							LOCKED IN
						</div>
					</div>
				)}
			</div>

			{/* BOTTOM — poppy mascot */}
			<Mascot segments={MASCOT} />
		</AbsoluteFill>
	);
};

export default Scene6;
