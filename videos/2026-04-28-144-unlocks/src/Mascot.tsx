import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {motion as motionTokens, zones} from './design';

export type MascotSegment = {
	pose: string; // filename in public/assets/, e.g. 'koala_action.png'
	fromFrame: number; // first frame this pose is active
};

const baseImgStyle: React.CSSProperties = {
	filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))',
	transformOrigin: 'bottom center',
};

/**
 * Bottom-zone mascot with "poppy" pose swaps.
 * main.md §4: every pose change pops in (overshoot scale 0.6 → 1.12 → 1.0
 * over 6 frames) instead of a slow cross-fade. A subtle continuous
 * breathing scale keeps the static frame from feeling dead.
 */
export const Mascot: React.FC<{
	segments: MascotSegment[];
	popFrames?: number;
}> = ({segments, popFrames = motionTokens.mascotPopFrames}) => {
	const frame = useCurrentFrame();

	// Pick currently active segment.
	let currentIdx = 0;
	for (let i = 0; i < segments.length; i++) {
		if (frame >= segments[i].fromFrame) currentIdx = i;
	}
	const current = segments[currentIdx];
	const localFrame = frame - current.fromFrame;

	// Poppy overshoot pop on every pose swap (including the first pose).
	const popScale = interpolate(
		localFrame,
		[0, popFrames / 2, popFrames],
		[0.6, 1.12, 1.0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Tiny breathing oscillation while pose holds (≤ 1.5%).
	const breathe = 1 + Math.sin(localFrame / 22) * 0.012;

	// Quick 2-frame fade-in to soften the swap edge.
	const opacity = interpolate(localFrame, [0, 2], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const scale = popScale * breathe;

	return (
		<div
			className="absolute left-0 right-0"
			style={{top: zones.bottom.y, height: zones.bottom.height}}
		>
			<Img
				key={current.pose}
				src={staticFile(`assets/${current.pose}`)}
				className="absolute inset-0 w-full h-full object-contain"
				style={{
					...baseImgStyle,
					transform: `scale(${scale})`,
					opacity,
				}}
			/>
		</div>
	);
};
