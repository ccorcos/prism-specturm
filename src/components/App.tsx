import * as React from "react"

interface Point {
	x: number
	y: number
}

function radians(degress: number) {
	return (degress * Math.PI) / 180
}

const viewport = 600

const whiteIntersection: Point = { x: viewport * 0.5, y: viewport * 0.5 }

// Refraction index of glass.
// https://www.sciencelearn.org.nz/resources/49-refraction-of-light
const redRefraction = 1.513
const violetRefraction = 1.532

export function App() {
	const [incidentAngleDegrees, setIncidentAngleDegrees] = React.useState(45)
	const incidentAngle = radians(incidentAngleDegrees)

	const [prismAngleDegrees, setPrismAngleDegrees] = React.useState(60)
	const prismAngle = radians(prismAngleDegrees)

	// The distance from the point where the white light hits the prism
	// to the hinge point on the left.
	const sideLength = viewport / 5

	// The distance from the point where the white light hits the prism
	// to the far corner that we don't really care much about.
	const endLength = sideLength * Math.tan(prismAngle)

	const triangle = [
		whiteIntersection,
		{
			x: whiteIntersection.x - Math.cos(incidentAngle) * sideLength,
			y: whiteIntersection.y - Math.sin(incidentAngle) * sideLength,
		},
		{
			x: whiteIntersection.x + Math.sin(incidentAngle) * endLength,
			y: whiteIntersection.y - Math.cos(incidentAngle) * endLength,
		},
	]

	const redAngleInside = Math.asin(Math.sin(incidentAngle) / redRefraction)
	const violetAngleInside = Math.asin(
		Math.sin(incidentAngle) / violetRefraction
	)

	const endAngle = Math.PI - Math.PI / 2 - prismAngle

	const redLengthY =
		(endLength * Math.tan(endAngle)) /
		(Math.tan(endAngle) + Math.tan(redAngleInside))
	const redLenghtInside = redLengthY / Math.cos(redAngleInside)

	const violetLengthY =
		(endLength * Math.tan(endAngle)) /
		(Math.tan(endAngle) + Math.tan(violetAngleInside))
	const violetLenghtInside = violetLengthY / Math.cos(violetAngleInside)

	const redIntersection = {
		x:
			whiteIntersection.x +
			Math.sin(incidentAngle - redAngleInside) * redLenghtInside,
		y:
			whiteIntersection.y -
			Math.cos(incidentAngle - redAngleInside) * redLenghtInside,
	}
	const violetIntersection = {
		x:
			whiteIntersection.x +
			Math.sin(incidentAngle - violetAngleInside) * violetLenghtInside,
		y:
			whiteIntersection.y -
			Math.cos(incidentAngle - violetAngleInside) * violetLenghtInside,
	}

	const redIncidentAngle = prismAngle - redAngleInside
	const violetIncidentAngle = prismAngle - violetAngleInside

	const redAngleOutside = Math.asin(redRefraction * Math.sin(redIncidentAngle))
	const violetAngleOutside = Math.asin(
		violetRefraction * Math.sin(violetIncidentAngle)
	)

	return (
		<div>
			<div>
				<span style={{ width: 130, display: "inline-block	" }}>
					Incident Angle: {incidentAngleDegrees}
				</span>
				<input
					type="range"
					min={1}
					max={89}
					value={incidentAngleDegrees}
					onChange={e => setIncidentAngleDegrees(parseInt(e.target.value))}
				/>
			</div>
			<div>
				<span style={{ width: 130, display: "inline-block	" }}>
					Prism Angle: {prismAngleDegrees}
				</span>
				<input
					type="range"
					min={1}
					max={89}
					value={prismAngleDegrees}
					onChange={e => setPrismAngleDegrees(parseInt(e.target.value))}
				/>
			</div>
			<svg height="1000" width="1000">
				<line
					x1={whiteIntersection.x}
					y1={whiteIntersection.y + viewport / 3}
					x2={whiteIntersection.x}
					y2={whiteIntersection.y}
					style={{ stroke: "rgba(0,0,0,0.4)", strokeWidth: 1 }}
				/>

				<polygon
					points={triangle.map(({ x, y }) => `${x},${y}`).join(" ")}
					style={{
						fill: "rgba(0,0,0,0.1)",
						strokeWidth: 1,
					}}
				/>

				<line
					x1={whiteIntersection.x}
					y1={whiteIntersection.y}
					x2={redIntersection.x}
					y2={redIntersection.y}
					style={{ stroke: "rgba(255,0,0,0.4)", strokeWidth: 1 }}
				/>

				<line
					x1={whiteIntersection.x}
					y1={whiteIntersection.y}
					x2={violetIntersection.x}
					y2={violetIntersection.y}
					style={{ stroke: "rgba(65,0,255,0.4)", strokeWidth: 1 }}
				/>

				<line
					x1={redIntersection.x}
					y1={redIntersection.y}
					x2={
						redIntersection.x +
						Math.cos(
							incidentAngle -
								redAngleInside -
								redIncidentAngle -
								Math.PI / 2 +
								redAngleOutside
						) *
							200
					}
					y2={
						redIntersection.y +
						Math.sin(
							incidentAngle -
								redAngleInside -
								redIncidentAngle -
								Math.PI / 2 +
								redAngleOutside
						) *
							200
					}
					style={{ stroke: "rgba(255,0,0,0.4)", strokeWidth: 1 }}
				/>

				<line
					x1={violetIntersection.x}
					y1={violetIntersection.y}
					x2={
						violetIntersection.x +
						Math.cos(
							incidentAngle -
								violetAngleInside -
								violetIncidentAngle -
								Math.PI / 2 +
								violetAngleOutside
						) *
							200
					}
					y2={
						violetIntersection.y +
						Math.sin(
							incidentAngle -
								violetAngleInside -
								violetIncidentAngle -
								Math.PI / 2 +
								violetAngleOutside
						) *
							200
					}
					style={{ stroke: "rgba(65,0,255,0.4)", strokeWidth: 1 }}
				/>
			</svg>
		</div>
	)
}
